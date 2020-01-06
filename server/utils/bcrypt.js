const { saltRounds } = require('../config')
const bcrypt = require('bcryptjs')

/**
 * @func encrypt - 加密
 * @param {String} - 密码
 */
exports.encrypt = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(password)
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) resolve(password)
        resolve(hash)
      })
    })
  })
}

/**
 * @func comparePassword - 密码校验
 * @param {String} _password - 需要校验的密码
 * @param {String} hash - 加密后的密码
 */
exports.decrypt = (_password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(_password, hash, (err, isMatch) => {
      if (err) reject(err)
      else resolve(isMatch)
    })
  })
}
