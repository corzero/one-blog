const joi = require('joi')
const { encrypt, decrypt } = require('../utils/bcrypt')
const userSchema = require('../schemas/user')
const userService = require('../service/user')
const storageService = require('../service/storage')
const { encodeToken } = require('../utils/token')
const statusCode = require('../utils/statusCode')
const logger = require('../utils/logger')

class UserController {
  /**
   * 用户注册
   * @param ctx username、password、sex、title、
   * @returns {Promise<boolean>}
   */
  static async register (ctx) {
    const user = ctx.request.body
    const validate = joi.validate(user, userSchema.regiester)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const isExist = await userService.getOne({
        username: user.username
      })
      if (!isExist) {
        user.password = await encrypt(user.password)
        const fres = await storageService.create({ fName: '我的文件' })
        user.baseFolder = `/${fres._id}`
        const res = await userService.create(user)
        if (res) {
          return (ctx.body = statusCode.Success_200('注册成功'))
        } else {
          return (ctx.body = statusCode.Error_400('数据错误'))
        }
      } else {
        return (ctx.body = statusCode.Error_400('该名称已注册，请重试'))
      }
    }
  }

  /**
   * 用户登录
   * @param ctx account、password
   * @returns {Promise<boolean>}
   */
  static async login (ctx) {
    const user = ctx.request.body
    const validate = joi.validate(user, userSchema.login)
    if (validate.error) {
      return (ctx.body = statusCode.Error_400(validate.error.message))
    } else {
      const res = await userService.getOne({
        username: user.username
      })
      const isTrue = await decrypt(res.password, res.password)
      if (!res || isTrue) {
        return (ctx.body = statusCode.Error_400('用户名或密码错误'))
      } else {
        const authToken = encodeToken({
          _id: res._id,
          username: res.username,
          baseFolder: res.baseFolder
        })
        const { avatar, username, sex, title, _id, baseFolder } = res
        ctx.set('Authorization', authToken)
        return (ctx.body = statusCode.Success_200('登录成功', {
          avatar,
          username,
          sex,
          title,
          baseFolder,
          _id
        }))
      }
    }
  }

  /**
   * 修改用户信息
   * @param ctx title,sex,email
   * @returns {Promise<boolean>}
   */
  static async updateUser (ctx) {
    const user = ctx.request.body
    const res = await userService.update(user)
    if (res) {
      return (ctx.body = statusCode.Success_200('修改成功'))
    } else {
      return (ctx.body = statusCode.Success_500('修改失败，请重试'))
    }
  }

  /**
   * 获取用户信息
   * @param ctx title,sex,email
   * @returns {Promise<boolean>}
   */
  static async getUserInfo (ctx) {
    const user = ctx.user
    if (user) {
      return (ctx.body = statusCode.Success_200('查询成功', user))
    } else {
      return (ctx.body = statusCode.Error_401('身份失效，请重新登录'))
    }
  }

  /**
   * 获取用户详细信息
   * @param ctx title,sex,email
   * @returns {Promise<boolean>}
   */
  static async getUserDetail (ctx) {
    const { id } = ctx.params
    const res = await userService.getOne({ _id: id }, { __v: 0, password: 0 })
    if (res) {
      return (ctx.body = statusCode.Success_200('查询成功', res))
    } else {
      return (ctx.body = statusCode.Error_500('查询错误'))
    }
  }
}

module.exports = router => {
  router.post('/login', UserController.login)
  router.post('/register', UserController.register)
  router.put('/user', UserController.updateUser)
  router.get('/user', UserController.getUserInfo)
  router.get('/userDetail/:id', UserController.getUserDetail)
}
