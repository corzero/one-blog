const logger = require('../utils/logger')
const UserModel = require('../mongodb/Schema/user')
class UserService {
  /**
   * 创建用户
   * @param user
   * @returns {Promise<boolean>}
   */
  static async create(user) {
    const model = new UserModel(user)
    const res = await model.save().catch(e => logger.error(e))
    return res || null
  }

  /**
   * 更改个人信息
   * @param "user_id,email,title,sex"
   * @returns {Promise<boolean>}
   */
  static async update(user) {
    const { _id, ...params } = user
    const res = await UserModel.findOneAndUpdate({ _id }, { ...params }).catch(
      e => logger.error(e)
    )
    return res || null
  }

  /**
   * 获取个人信息
   * @param "account:email,username"
   * @returns {Promise<boolean>}
   */
  static async getOne(query, filter) {
    const res = await UserModel.findOne(query, filter).catch(e =>
      logger.error(e)
    )
    return res || null
  }
}

module.exports = UserService
