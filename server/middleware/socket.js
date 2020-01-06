const scriptEntrance = require('../script')
const socket = client => {
  console.log('socket初始化完成')
  // 前端脚本开始
  client.on('runScript', async data => {
    console.log('运行参数', data)
    scriptEntrance(data, client)
  })
  // ...其他内容
}
module.exports = socket
