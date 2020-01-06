const Logger = require('log4js')
const config = require('../config')
const path = require('path')

Logger.configure({
  appenders: {
    console: { type: 'stdout' },

    file: {
      type: 'dateFile',
      filename: config.log.filename,
      pattern: config.log.pattern,
      alwaysIncludePattern: true
    }
  },

  categories: {
    default: { appenders: ['console', 'file'], level: config.log.level }
  }

})
module.exports = Logger.getLogger()
