const jwt = require('jsonwebtoken')
const config = require('../config')
/* 获取一个有期限的token */
const encodeToken = (payload = {}) => {
  return jwt.sign(payload, config.token.secret, {
    expiresIn: config.token.expires
  })
}
/* 通过token获取JWT的payload部分 */
const decodeToken = token => {
  return jwt.verify(token.split(' ')[1], config.token.secret)
}
module.exports = { encodeToken, decodeToken }
