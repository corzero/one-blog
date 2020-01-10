const logger = require('../utils/logger')
const _ = require('lodash')
const ArticleModel = require('../mongodb/Schema/article')
class ArticleService {
  /**
   * 创建文章
   * @param article
   * @returns {Promise<boolean>}
   */
  static async create (article) {
    const model = new ArticleModel(article)
    const res = await model.save().catch(e => logger.error(e))
    return res || null
  }

  /**
   * 更改文章
   * @param article
   * @returns {Promise<boolean>}
   */
  static async update (article) {
    const { _id, ...params } = article
    const res = await ArticleModel.findOneAndUpdate(
      { _id: _id },
      { ...params }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 文章列表
   * @param article
   * @returns {Promise<boolean>}
   */
  static async queryList (query) {
    const { title, category, tag, pageNum, pageSize, status } = query
    const conditions = { isDeleted: !!status }
    if (title) {
      conditions.title = { $regex: title, $options: 'i' }
    }
    if (category) {
      conditions.category = category
    }
    if (tag) {
      conditions.tagList = tag
    }
    const res = await ArticleModel.find(conditions, { __v: 0, content: 0 })
      .populate('tagList', { name: 1, _id: 1 })
      .populate('author', { username: 1, _id: 1 })
      .populate('category', { name: 1, _id: 1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort('{ meta.updatedAt: -1}')
      .catch(e => logger.error(e))
    const total = await ArticleModel.countDocuments(conditions).catch(e =>
      logger.error(e)
    )
    return _.isNil(res) && _.isNil(total) ? null : { total, list: res }
  }

  /**
   * 文章获取单个
   * @param article_id
   * @returns {Promise<boolean>}
   */
  static async getOne (aid) {
    const res = await ArticleModel.findOne(
      { _id: aid },
      { __v: 0, meta: 0, author: 0, visited: 0 }
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 文章回收站
   * @param article_ids
   * @returns {Promise<boolean>}
   */
  static async delete (ids) {
    const res = await ArticleModel.updateMany(
      { _id: { $in: ids }},
      { $set: { isDeleted: true }}
    ).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 物理删除
   * @param article_ids
   * @returns {Promise<boolean>}
   */
  static async destroy (ids) {
    const res = await ArticleModel.deleteMany({ _id: { $in: ids }}).catch(e =>
      logger.error(e)
    )
    return res || null
  }

  /**
   * 恢复文章
   * @param article_ids
   * @returns {Promise<boolean>}
   */
  static async recover (ids) {
    const res = await ArticleModel.updateMany(
      { _id: { $in: ids }},
      { $set: { isDeleted: false }}
    ).catch(e => logger.error(e))
    return res || null
  }
}

module.exports = ArticleService
