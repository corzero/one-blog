const logger = require('../utils/logger')
const ScriptModel = require('../mongodb/Schema/script')
class ScriptService {
  /**
   * 创建标签
   * @param {name, category}
   * @returns {Promise<boolean>}
   */
  static async create(params) {
    const model = new ScriptModel(params)
    const res = await model.save().catch(e => logger.error(e))
    return res || null
  }

  /**
   * 更改标签
   * @param { name, categoryId }
   * @returns {Promise<boolean>}
   */
  static async update(params) {
    const { _id, ...others } = params
    const res = await ScriptModel.findOneAndUpdate(
      { _id },
      { ...others }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 获取某一个分类下的所有标签
   * @param { category cid }
   * @returns {Promise<boolean>}
   */
  static async getList() {
    const res = await ScriptModel.find({}, { __v: 0 }).catch(e =>
      logger.error(e)
    )
    return res || null
  }

  /**
   * 删除某一个指标
   * @param { script tid }
   * @returns {Promise<boolean>}
   */
  static async delete(ids) {
    const res = await ScriptModel.deleteMany({ _id: { $in: ids }}).catch(e =>
      logger.error(e)
    )
    return res || null
  }

  /**
   * 改变状态
   * @param { script tid }
   * @returns {Promise<boolean>}
   */
  static async changeStatus(ids, status) {
    const res = await ScriptModel.updateMany(
      { _id: { $in: ids }},
      { $set: { disabled: status }}
    ).catch(e => logger.error(e))
    return res || null
  }
}

module.exports = ScriptService
