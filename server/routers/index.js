const fse = require('fs-extra')
const path = require('path')
const Router = require('koa-router')
const logger = require('../utils/logger')
const router = new Router({
  prefix: '/api'
})
const controllers = fse
  .readdirSync(path.join(__dirname, '../controller'))
  .filter(s => /\.js$/i.test(s))
controllers.forEach(f => {
  logger.info(`register api: ${f}`)
  f = f.replace('.js', '')
  const ctrl = require(`../controller/${f}`)
  ctrl && ctrl(router)
})
module.exports = router
