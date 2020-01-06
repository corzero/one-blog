const path = require('path')
const fse = require('fs-extra')
const compressing = require('compressing')
const logger = require('../utils/logger')
const storageService = require('../service/storage')
const statusCode = require('../utils/statusCode')
const { uploadStorageHandler } = require('../middleware')
class StorageController {
  /**
   * 文件上传
   * @param ctx file
   * @returns {Promise<boolean>}
   */
  static async uploadStorage (ctx) {
    const file = ctx.request.files.file
    // 根据文件hash创建文件夹，把默认上传的文件移动当前hash文件夹下。方便后续文件合并。
    const { name, total, index, size, hash } = ctx.request.body
    const hashPath = path.join(__dirname, `../public/storage/${hash}`)
    const fsPath = `${hashPath}\\file_${index}`
    // 没有就创建
    fse.ensureDirSync(hashPath)
    if (!fse.existsSync(fsPath)) {
      // 判断hash文件夹是否存在
      fse.renameSync(file.path, fsPath) // 保存每一个块
      return (ctx.body = statusCode.Success_200('文件保存成功'))
    } else {
      // 存在(断点续传重点)
      return (ctx.body = statusCode.Success_200('文件已存在'))
    }
  }
  /**
   * 文件合并
   * @param ctx file、
   * @returns {Promise<boolean>}
   */
  static async mergeFile (ctx) {
    const user = ctx.user
    const { parentFolder, size, name, total, hash, type } = ctx.request.body
    const suffix = /\.[^\.]+$/.exec(name)
    // 根据hash值，获取分片文件。
    // 创建存储文件
    // 合并
    const hashPath = path.join(__dirname, `../public/storage/${hash}`)
    const filePath = path.join(__dirname, `../public/storage/${hash + suffix}`)
    // 没有就创建
    fse.ensureDirSync(hashPath)
    // 读取所有的chunks 文件名存放在数组中
    const chunks = fse.readdirSync(hashPath)
    if (chunks.length !== total || chunks.length === 0) {
      return (ctx.body = statusCode.Error_500('文件异常，请重新上传'))
    }
    try {
      // 创建存储文件
      fse.writeFileSync(filePath, '')
      for (let i = 0; i < total; i++) {
        // 追加写入到文件中
        console.log('写入文件', filePath)
        fse.appendFileSync(filePath, fse.readFileSync(`${hashPath}\\file_${i}`))
        // 删除本次使用的chunk
        fse.unlinkSync(`${hashPath}\\file_${i}`)
        // 删除hash文件夹
        if (i === total - 1) {
          fse.removeSync(hashPath)
        }
      }
      // 文件合并成功，可以把文件信息进行入库。
      const uploadInfo = {
        parentId: parentFolder._id,
        isFolder: type === -1,
        fName: name,
        hash,
        path: `${parentFolder.path}/${hash + suffix}`,
        type,
        size
      }
      await storageService.create(uploadInfo)
      return (ctx.body = statusCode.Success_200('文件合并成功'))
    } catch (e) {
      logger.error(e)
      return (ctx.body = statusCode.Error_500('文件合并失败'))
    }
  }
  /**
   * 文件列表
   * @param ctx query
   * @returns {Promise<array>}
   */
  static async storageList (ctx) {
    const { fid, type } = ctx.request.body
    const user = ctx.user
    const res = await storageService
      .getList(type, fid || user.baseFolder)
      .catch(e => logger.error(res))
    if (res) {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    } else {
      return (ctx.body = statusCode.Error_500('查询失败'))
    }
  }
  /**
   * 文件（夹）
   * @param ctx _id
   * @returns {Promise<object>}
   */
  static async queryOne (ctx) {
    const { fid } = ctx.params
    const res = await storageService
      .getFolder(fid)
      .catch(e => logger.error(res))
    if (res) {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    } else {
      return (ctx.body = statusCode.Error_500('查询失败'))
    }
  }
  /**
   * 创建文件夹
   * @param ctx name parentId
   * @returns {Promise<boolean>}
   */
  static async createFolder (ctx) {
    const { parentId, path, fName } = ctx.request.body
    const res = await storageService
      .create({ parentId, path, fName })
      .catch(e => logger.error(res))
    if (res) {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    } else {
      return (ctx.body = statusCode.Error_500('查询失败'))
    }
  }
  /**
   * 重命名文件（夹）
   * @param ctx query
   * @returns {Promise<array>}
   */
  static async rename (ctx) {
    const { _id, fName } = ctx.request.body
    const res = await storageService
      .update({ _id, fName })
      .catch(e => logger.error(res))
    if (res) {
      return (ctx.body = statusCode.Success_200('修改成功'))
    } else {
      return (ctx.body = statusCode.Error_500('修改失败'))
    }
  }
  /**
   * 物理删除文件（夹）
   * @param ctx id hash
   * @returns {Promise<boolean>}
   */
  static async deleteMany (ctx) {
    const { ids, type } = ctx.request.body
    let filter
    if (type && ids instanceof Array) {
      // 文件夹
      filter = {
        $or: ids.map(e => {
          return { path: { $regex: e }}
        })
      }
    } else {
      filter = { _id: { $in: ids }}
    }
    const res = await storageService.deleteMany(filter)
    if (res) {
      return (ctx.body = statusCode.Success_200('删除成功'))
    } else {
      logger.error(res)
      return (ctx.body = statusCode.Error_500('删除失败'))
    }
  }
  /**
   * 文件（夹）回收站
   * @param ctx id hash
   * @returns {Promise<array>}
   */
  static async setTrash (ctx) {
    const { ids, type } = ctx.request.body
    let filter = {}
    if (type && ids instanceof Array) {
      // 文件夹
      filter = {
        $or: ids.map(e => {
          return { path: { $regex: e }}
        })
      }
    } else {
      // 文件
      filter = { _id: { $in: ids }}
    }
    const res = await storageService.updateMany(filter, { isDelete: true })
    if (res) {
      return (ctx.body = statusCode.Success_200('删除成功'))
    } else {
      logger.error(res)
      return (ctx.body = statusCode.Error_500('删除失败'))
    }
  }
  /**
   * 下载文件（夹）
   * @param ctx id hash
   * @returns {Promise<Stream>}
   */
  static async download (ctx) {
    const { ids } = ctx.request.body
    const tarStream = new compressing.tar.Stream()
    const res = await storageService.findMany(ids)
    let size = 0
    res.forEach(e => {
      size += e.size
      tarStream.addEntry(
        path.resolve(
          __dirname,
          `../public/storage/${(e.hash += /\.[^\.]+$/.exec(e.fName))}`
        )
      )
    })
    ctx.set('Content-disposition', 'attachment;filename=name.tar')
    if (res) {
      return (ctx.body = statusCode.Success_200('删除成功'))
    } else {
      logger.error(res)
      return (ctx.body = statusCode.Error_500('删除失败'))
    }
  }
}

module.exports = router => {
  router.post('/storage', uploadStorageHandler, StorageController.uploadStorage)
  router.post('/merge', StorageController.mergeFile)
  router.post('/storageList', StorageController.storageList)
  router.get('/queryFolder/:fid', StorageController.queryOne)
  router.post('/createFolder', StorageController.createFolder)
  router.put('/storageRename', StorageController.rename)
  router.delete('/deleteStorage', StorageController.deleteMany)
  router.put('/storage', StorageController.setTrash)
  router.post('/downloadStorage', StorageController.download)
}
