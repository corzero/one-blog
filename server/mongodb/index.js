const mongoose = require('mongoose')
const config = require('../config')
const DB_URL = config.MongoDB.url
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
/**
 * 连接
 */
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

/**
 * 连接成功
 */
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection success to ' + DB_URL)
})

/**
 * 连接异常
 */
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err)
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose
