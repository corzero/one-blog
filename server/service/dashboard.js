const logger = require('../utils/logger')
const ArticleModel = require('../mongodb/Schema/article')
class DashboardService {
  /**
   * 获取文章访问次数
   * @param nul
   * @returns {Promise<boolean>}
   */
  static async getArticleVisit() {
    const res = await ArticleModel.aggregate([
      { $group: { _id: null, total: { $sum: '$visited' }}},
      { $project: { _id: 0, total: 1 }}
    ]).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 获取网站访问次数
   * @param null
   * @returns {Promise<boolean>}
   */
  static async getWebsitVisit() {
    const res = await ArticleModel.find().catch(e => logger.error(e))
    return res || null
  }

  /**
   * 获取创建文章频率
   * @param null
   * @returns {Promise<boolean>}
   */
  static async getArticleFrequency() {
    const res = await ArticleModel.aggregate([
      { $group: { _id: { time: '$meta.createdAt' }, count: { $sum: 1 }}}, // 先分组
      { $project: { _id: 0, time: '$_id.time', count: 1 }}, // 重新划分数据
      { $sort: { time: 1 }}
    ]).catch(e => logger.error(e))
    return res || null
  }

  /**
   * 获取文章总数
   * @param null
   * @returns {Promise<boolean>}
   */
  static async getArticleCount() {
    const res = await ArticleModel.countDocuments({}).catch(e =>
      logger.error(e)
    )
    return res || null
  }

  /**
   * 获取文章的分类
   * @param null
   * @returns {Promise<boolean>}
   */
  static async getArticleType() {
    const res = await ArticleModel.aggregate([
      {
        $lookup: {
          // 先取数据
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      { $group: { _id: { category: '$category.name' }, count: { $sum: 1 }}}, // 先分组
      { $project: { _id: 0, name: '$_id.category', count: 1 }} // 重新划分数据
    ]).catch(e => logger.error(e))
    return res || null
  }
}

module.exports = DashboardService
