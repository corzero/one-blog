const logger = require('../utils/logger')
const fse = require('fs-extra')
const {
  uploadImgHandler,
  uploadAudioHandler,
  uploadvideoHandler,
  uploadAvatarHandler,
  handlerUpload
} = require('../middleware')
const path = require('path')
const statusCode = require('../utils/statusCode')

class UploadController {
  /**
   * 图片上传
   * @param ctx file、
   * @returns {Promise<boolean>}
   */
  static async uploadImg (ctx) {
    const file = ctx.request.files.file
    logger.info('上传图片', file.name)
    const basename = path.basename(file.path)
    return (ctx.body = statusCode.Success_200('更新成功', {
      url: `${ctx.origin}/img/${basename}`
    }))
  }

  /**
   * 头像上传
   * @param ctx file、
   * @returns {Promise<boolean>}
   */
  static async uploadAvator (ctx) {
    const file = ctx.request.files.file
    logger.info('上传头像', file)
    const basename = path.basename(file.path)
    return (ctx.body = statusCode.Success_200('更新成功', {
      url: `${ctx.origin}/avatar/${basename}`
    }))
  }

  /**
   * 音频上传
   * @param ctx file、
   * @returns {Promise<boolean>}
   */
  static async uploadMusic (ctx) {
    const file = ctx.request.files.file
    logger.info('上传音频', file.name)
    const basename = path.basename(file.path)
    return (ctx.body = statusCode.Success_200('更新成功', {
      url: `${ctx.origin}/audio/${basename}`
    }))
  }

  /**
   * 视频上传
   * @param ctx file、
   * @returns {Promise<boolean>}
   */
  static async uploadVideo (ctx) {
    const file = ctx.request.files.file
    logger.info('上传视频', file.name)
    const basename = path.basename(file.path)
    return (ctx.body = statusCode.Success_200('更新成功', {
      url: `${ctx.origin}/video/${basename}`
    }))
  }

  static async upload (ctx) {
    const file = ctx.request.files.file
    const fpath = file.path.split('\\public')[1].replace(/\\/g, '/')
    // const basename = path.basename(file.path)
    logger.info('上传文件', file.name)
    return (ctx.body = statusCode.Success_200('更新成功', {
      url: `${ctx.origin}${fpath}`
    }))
  }
}

module.exports = router => {
  router.post('/upload/img', uploadImgHandler, UploadController.uploadImg)
  router.post(
    '/upload/avatar',
    uploadAvatarHandler,
    UploadController.uploadAvator
  )
  router.post('/upload/music', uploadAudioHandler, UploadController.uploadMusic)
  router.post('/upload/video', uploadvideoHandler, UploadController.uploadVideo)
}
