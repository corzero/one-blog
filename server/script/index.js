const { fork } = require('child_process')
const path = require('path')
const fse = require('fs-extra')
const logger = require('../utils/logger')
function runScipt ({ name, args }, client) {
  if (!name) {
    logger.error('缺失脚本名称，停止运行')
    client.emit('scrpitOutput', {
      type: 'error',
      msg: '缺失脚本名称，停止运行'
    })
    return
  }
  const nameList = fse
    .readdirSync(path.join(__dirname, '../script'))
    .filter(s => /\.js$/i.test(s))
    .map(e => (e = e.replace('.js', '')))
  if (!nameList.includes(name.trim()) || name.trim() === 'index') {
    logger.error('脚本名称错误，请检查')
    client.emit('scrpitOutput', {
      type: 'error',
      msg: '脚本名称错误，请检查'
    })
    return
  }
  const child = fork(path.resolve(__dirname, `./${name}.js`), args)
  child.on('message', msg => client.emit('scrpitOutput', { type: 'info', msg }))
  child.on('exit', (code, signal) => {
    logger.info(`子进程已退出：code ${code} and signal ${signal}`)
    client.emit('scrpitOutput', {
      type: 'info',
      msg: `任务完成,代码：${code}，内容：${signal || '无'}`
    })
  })
}

module.exports = runScipt
