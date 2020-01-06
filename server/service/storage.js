const logger = require('../utils/logger')
const StorageModel = require('../mongodb/Schema/storage')
class StorageService {
  /**
   * 创建文件（夹）
   * @param {name, }
   * @returns {Promise<boolean>}
   */
  static async create (params) {
    const model = new StorageModel(params)
    const res = await model.save().catch(e => logger.error(e))
    return res || null
  }

  /**
   * 更改文件（夹）
   * @param { name, Id }
   * @returns {Promise<boolean>}
   */
  static async update (params) {
    const { _id, ...others } = params
    const res = await StorageModel.findOneAndUpdate(
      { _id },
      { ...others }
    ).catch(e => logger.error(e))
    return res || null
  }
  /**
   * 更改文件（夹）
   * @param { name, Id }
   * @returns {Promise<boolean>}
   */
  static async updateMany (filter, set) {
    const res = await StorageModel.updateMany(filter, {
      $set: { ...set }
    }).catch(e => logger.error(e))
    return res || null
  }
  /**
   * 获取某一个文件夹信息
   * @param {  fid }
   * @returns {Promise<boolean>}
   */
  static async getFolder (fid) {
    const res = await StorageModel.findOne(
      { _id: fid },
      { fName: 1, _id: 1, path: 1 }
    ).catch(e => logger.error(e))
    return res || null
  }
  /**
   * 获取某一个文件夹下的所有文件（夹）
   * @param {  fid }
   * @returns {Promise<boolean>}
   */
  static async getList (type, fid, isDelete = false) {
    let filter = {}
    if (type === -1) {
      // 全部列表
      // 查询全部
      filter = { parentId: fid, isDelete }
    } else if (type === 4) {
      // 回收站
      // 查询 文档0|电影视频1|音乐2|其他3
      filter = { isDelete: true }
    } else {
      if (type === 0) {
        // 文档
        type = { $in: ['pdf', 'word', 'excel', 'ppt'] }
      } else if (type === 1) {
        // 电影
        type = 'movie'
      } else if (type === 2) {
        // 音乐
        type = 'mp3'
      } else {
        type = 'other'
      }
      filter = { type, isFolder: false, isDelete }
    }
    const res = await StorageModel.find(filter, { __v: 0 }).catch(e =>
      logger.error(e)
    )
    return res || null
  }

  /**
   * 删除某一个文件（夹）
   * @param { script tid }
   * @returns {Promise<boolean>}
   */
  static async deleteMany (filter) {
    const res = await StorageModel.deleteMany(filter).catch(e =>
      logger.error(e)
    )
    return res || null
  }

  /**
   * 查询多个文件
   * @param { script tid }
   * @returns {Promise<boolean>}
   */
  static async findMany (ids) {
    const res = await StorageModel.find(
      { _id: { $in: ids }},
      { hash: 1, fName: 1, size: 1 }
    ).catch(e => logger.error(e))
    return res || null
  }
}
module.exports = StorageService
