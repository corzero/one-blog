const logger = require('../utils/logger')
const SingerModel = require('../mongodb/Schema/singer')
const AlbumModel = require('../mongodb/Schema/album')
const SongModel = require('../mongodb/Schema/song')
class MusicService {
  /**
   * 随机专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async queryRandomAlbum() {
    const res = await AlbumModel.find(
      { random: { $gte: Math.random() }},
      { name: 1, picUrl: 1, pubTime: 1, singer: 1 }
    )
      .populate('singer', { name: 1, _id: 1 })
      .limit(8)
      .catch(e => logger.error(e))
    return res || null
  }
  /**
   * 随机歌曲
   * @param null
   * @returns {Promise<list>}
   */
  static async queryRandomSong() {
    const res = await SongModel.find(
      { random: { $gte: Math.random() }},
      { name: 1, playUrl: 1, singer: 1, duration: 1, album: 1 }
    )
      .populate('album', { name: 1, _id: 1, picUrl: 1 })
      .limit(12)
      .catch(e => logger.error(e))
    return res || null
  }
  /**
   * 全部歌手
   * @param null
   * @returns {Promise<list>}
   */
  static async querySingerList() {
    const res = await SingerModel.find({}, { name: 1, picUrl: 1 }).catch(e =>
      logger.error(e)
    )
    return res || null
  }
  /**
   * 某个歌手下的专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async queryAlbumListBySingerId(sid) {
    const res = await SingerModel.find(
      { singer: sid },
      { name: 1, picUrl: 1, pubTime: 1 }
    ).catch(e => logger.error(e))
    return res || null
  }
  /**
   * 某个歌手下的专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async getSongListByAlbumId(aid) {
    const res = await SongModel.find(
      { album: aid },
      { name: 1, playUrl: 1, pubTime: 1, duration: 1, singer: 1 }
    ).catch(e => logger.error(e))
    return res || null
  }
  /**
   * 某个歌手下的专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async queryOneSinger(sid) {
    const res = await SingerModel.findOne(
      { _id: sid },
      { __v: 0, meta: 0, random: 0 }
    )
      .populate('albumList', { name: 1, picUrl: 1, pubTime: 1 })
      .catch(e => logger.error(e))
    return res || null
  }
  /**
   * 某个歌手下的专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async queryAlbumlist(sid) {
    const res = await AlbumModel.findOne(
      { _id: sid },
      { __v: 0, meta: 0, random: 0 }
    )
      .populate('singer', { name: 1, _id: 1 })
      .populate('songList', { __v: 0, meta: 0, author: 0, lyric: 0 })
      .catch(e => logger.error(e))
    return res || null
  }
  /**
   * 删除某个歌手
   * @param null
   * @returns {Promise<list>}
   */
  static async deleteSinger(sid) {
    const res = await SingerModel.findByIdAndDelete(sid).catch(e =>
      logger.error(e)
    )
    const res1 = await AlbumModel.deleteMany({ singer: sid }).catch(e =>
      logger.error(e)
    )
    const res2 = await SongModel.deleteMany({ singer: sid }).catch(e =>
      logger.error(e)
    )
    return res && res1 && res2
  }
  /**
   * 删除某个专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async deleteAlbum(aid) {
    const res = await AlbumModel.findById(aid).catch(e => logger.error(e))
    const res1 = await SingerModel.findByIdAndUpdate(res.singer, {
      $pull: { albumList: aid }
    })
    const res2 = await AlbumModel.findByIdAndDelete(aid).catch(e =>
      logger.error(e)
    )
    const res3 = await SongModel.deleteMany({ album: aid }).catch(e =>
      logger.error(e)
    )
    return res3 && res2 && res1 && res
  }
  /**
   * 删除某个专辑
   * @param null
   * @returns {Promise<list>}
   */
  static async deleteSong(sid) {
    const res = await SingerModel.findByIdAndDelete(sid).catch(e =>
      logger.error(e)
    )
    return !!res
  }
}

module.exports = MusicService
