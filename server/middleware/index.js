const { encodeToken, decodeToken } = require('../utils/token')
const logger = require('../utils/logger')
const koaBody = require('koa-body')
const fse = require('fs-extra')
const uuid = require('uuid')
const path = require('path')
const statusCode = require('../utils/statusCode')
const config = require('../config')
/**
 * 判断token是否可用
 */
const errorHandle = () => {
  return async (ctx, next) => {
    try {
      // 获取jwt
      const token = ctx.header.authorization
      if (token) {
        try {
          // 解密payload，获取用户名和ID
          const payload = decodeToken(token)
          console.log(payload)
          const { iat, exp, ...params } = payload
          ctx.user = params
          console.log(
            'token有效期(分钟)',
            (exp - Math.floor(Date.now() / 1000)) / 60
          )
          if (Date.now() - iat > config.maxAge) {
            return (ctx.body = statusCode.Error_401('身份验证过期，请重新登录'))
          } else if (
            exp - Math.floor(Date.now() / 1000) <
            config.token.refrash
          ) {
            // 小于时间自动刷新token
            const newToken = encodeToken(params)
            ctx.setHeader('Authorization', newToken)
          }
        } catch (err) {
          // token 过期
          if (err.name === 'TokenExpiredError') {
            logger.warn('Token 过期...')
            return (ctx.body = statusCode.Error_401('身份验证过期，请重新登录'))
          }
          logger.error('TokenError: ', err.message)
        }
      }
      await next()
    } catch (err) {
      console.log(err)
      if (err.status === 401) {
        ctx.status = 401
        ctx.body = {
          code: 401,
          msg: '认证失败'
        }
      } else {
        err.status = 404
        ctx.body = {
          code: 404,
          msg: '内部错误'
        }
      }
    }
  }
}

const uploadImgHandler = koaBody({
  multipart: true,
  formidable: {
    hash: 'sha1',
    multipart: true,
    uploadDir: path.join(__dirname, '../public/img'),
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    onFileBegin: (name, file) =>
      logger.info(`Files: ${name},Data: ${JSON.stringify(file)}`)
  }
})

const uploadAvatarHandler = koaBody({
  multipart: true,
  formidable: {
    hash: 'sha1',
    multipart: true,
    uploadDir: path.join(__dirname, '../public/avatar'),
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    onFileBegin: (name, file) => {
      logger.info(`Files: ${name},Data: ${JSON.stringify(file)}`)
    }
  }
})

const uploadAudioHandler = koaBody({
  multipart: true,
  formidable: {
    hash: 'sha1',
    multipart: true,
    uploadDir: path.join(__dirname, '../public/audio'),
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    onFileBegin: (name, file) =>
      logger.info(`Files: ${name},Data: ${JSON.stringify(file)}`)
  }
})
const uploadvideoHandler = koaBody({
  multipart: true,
  formidable: {
    hash: 'sha1',
    multipart: true,
    uploadDir: path.join(__dirname, '../public/video'),
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    onFileBegin: (name, file) =>
      logger.info(`Files: ${name},Data: ${JSON.stringify(file)}`)
  }
})
const uploadStorageHandler = async (ctx, next) => {
  const file = ctx.request.files.file
  // 设置文件名称
  file.name = uuid.v1()
  // 创建可读流
  const reader = fse.createReadStream(file.path)
  // 设置上传临时路径
  file.path = path.join(__dirname, `../public/storage/temp/${file.name}`)
  console.log('最终路径', file.path)
  // 创建可写流
  const upStream = fse.createWriteStream(file.path)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  await next()
}

// const filePathHandler = (name, path) => {
//   let fpath = path.replace(/[^<>/\\\|:""\*\?]+\.\w+$/, '')
//   const fname = path.match(/[^<>/\\\|:""\*\?]+\.\w+$/)
//   if (checkImg(fname)) {
//     // 图片(头像还是其他内容)
//     fpath =
//       name === 'avatar' ? `${fpath}avatar\\${fname}` : `${fpath}img\\${fname}`
//   } else if (checkAudio(fname)) {
//     // 音频
//     fpath = `${fpath}audio\\${fname}`
//   } else if (checkVideo(fname)) {
//     // 视频
//     fpath = `${fpath}video\\${fname}`
//   } else {
//     // 其他
//     fpath = `${fpath}other\\${fname}`
//   }
//   return fpath
// }

const checkImg = name => {
  const suffix = /\.[^\.]+/.exec(name)
  return /\.(jpg|gif|png)$/i.test(suffix)
}
const checkAudio = name => {
  const suffix = /\.[^\.]+/.exec(name)
  return /\.(mp3|m4a)$/i.test(suffix)
}
const checkVideo = name => {
  const suffix = /\.[^\.]+/.exec(name)
  return /\.(mp4|flv)$/i.test(suffix)
}

module.exports = {
  errorHandle,
  uploadImgHandler,
  uploadAvatarHandler,
  uploadAudioHandler,
  uploadvideoHandler,
  uploadStorageHandler
}
