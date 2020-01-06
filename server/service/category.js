const logger = require('../utils/logger')
const CategoryModel = require('../mongodb/Schema/category')
class CategoryService {
  /**
   * 创建文章
   * @param category
   * @returns {Promise<boolean>}
   */
  static async create(category) {
    const model = new CategoryModel(category)
    const res = await model.save().catch(e => logger.error(e))
    return res || null
  }

  /**
   * 更改文章
   * @param category
   * @returns {Promise<boolean>}
   */
  static async update(category) {
    const { _id, ...params } = category
    const res = await CategoryModel.findOneAndUpdate(
      { _id: _id },
      { ...params }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 更改分类标签
   * @param category
   * @returns {Promise<boolean>}
   */
  static async pushTag(category) {
    const { cid, tid } = category
    const res = await CategoryModel.findOneAndUpdate(
      { _id: cid },
      { $push: { tagList: tid }}
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 全部分类
   * @param all
   * @returns {Promise<boolean>}
   */
  static async getList() {
    const res = await CategoryModel.find(
      {},
      { meta: 0, tagList: 0, __v: 0 }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 全部分类和下面的标签
   * @param all
   * @returns {Promise<boolean>}
   */
  static async getAllWidthTag() {
    const res = await CategoryModel.find({}, { meta: 0, __v: 0 })
      .populate('tagList', { name: 1, _id: 1 })
      .catch(e => logger.error(e))
    return res || null
  }

  /**
   * 删除分类
   * @param category
   * @returns {Promise<boolean>}
   */
  static async delete(ids) {
    const res = await CategoryModel.deleteMany({ _id: { $in: ids }}).catch(e =>
      logger.error(e)
    )
    return res || null
  }
}

module.exports = CategoryService
