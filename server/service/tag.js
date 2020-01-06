const logger = require('../utils/logger')
const TagModel = require('../mongodb/Schema/tag')
const categoryService = require('./category')
class TagService {
  /**
   * 创建标签
   * @param {name, category}
   * @returns {Promise<boolean>}
   */
  static async create(params) {
    const model = new TagModel(params)
    const tres = await model.save().catch(e => logger.error(e))
    const cres = await categoryService.pushTag({
      cid: params.category,
      tid: tres.id
    })
    return (tres && cres) || null
  }

  /**
   * 更改标签
   * @param { name, categoryId }
   * @returns {Promise<boolean>}
   */
  static async update(params) {
    const { id, ...others } = params
    const res = await TagModel.findOneAndUpdate(
      { _id: id },
      { ...others }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 获取某一个分类下的所有标签
   * @param { category cid }
   * @returns {Promise<boolean>}
   */
  static async getList(category) {
    const res = await TagModel.find(
      { category },
      { meta: 0, category: 0, __v: 0 }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 删除某一个指标
   * @param { tag tid }
   * @returns {Promise<boolean>}
   */
  static async delete(ids) {
    const res = await TagModel.deleteMany({ _id: { $in: ids }}).catch(e =>
      logger.error(e)
    )
    return res || null
  }
}

module.exports = TagService
