import SparkMD5 from 'spark-md5'
const blobSlice =
  File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
const chunkSize = 10 * 1024 * 1024 // 每个chunk的大小，设置为10MB
const loadNext = (file, fileReader, chunkSize, currentChunk) => {
  const start = currentChunk * chunkSize
  const end = start + chunkSize >= file.size ? file.size : start + chunkSize
  fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
}
const hashFile = async file => {
  return new Promise((resolve, reject) => {
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.onload = e => {
      spark.append(e.target.result) // Append array buffer
      currentChunk += 1
      if (currentChunk < chunks) {
        loadNext(file, fileReader, chunkSize, currentChunk)
      } else {
        console.log('finished loading')
        const result = spark.end()
        // 如果单纯的使用result 作为hash值的时候, 如果文件内容相同，而名称不同的时候
        // 想保留两个文件无法保留。所以把文件名称加上。
        const sparkMd5 = new SparkMD5()
        sparkMd5.append(result)
        sparkMd5.append(file.name) // 可要可不要
        const hexHash = sparkMd5.end()
        resolve(hexHash)
      }
    }
    fileReader.onerror = () => console.warn('文件读取失败！')
    fileReader.onloadend = e => console.log('ahhhhhhhhhh', e)
    loadNext(file, fileReader, chunkSize, currentChunk)
  }).catch(err => console.log(err))
}
const spliceFile = async (file, uploadFn, progress, id) => {
  const taskList = []
  const blockCount = Math.ceil(file.size / chunkSize)
  console.log('分块个数', blockCount)
  const hash = await hashFile(file) // 文件 hash
  console.log('文件hash', hash)
  // 获取文件hash之后，如果需要做断点续传，可以根据hash值去后台进行校验。
  // 看看是否已经上传过该文件，并且是否已经传送完成以及已经上传的切片。
  for (let i = 0; i < blockCount; i++) {
    const start = i * chunkSize
    const end = Math.min(file.size, start + chunkSize)
    // 构建表单
    const form = new FormData()
    form.append('file', blobSlice.call(file, start, end))
    form.append('name', file.name)
    form.append('total', blockCount)
    form.append('index', i)
    form.append('size', file.size)
    form.append('hash', hash)
    // ajax提交 分片，此时 content-type 为 multipart/form-data
    const option = {
      onUploadProgress: e => {
        // 处理上传的进度
        progress && progress(id, (i + 1) / blockCount, e.loaded)
        console.log('处理上传的进度', blockCount, i, e, file)
      }
    }
    // 加入到 Promise 数组中
    taskList.push(() => uploadFn(form, option))
  }
  return { taskList, total: blockCount, hash }
}
export default spliceFile
