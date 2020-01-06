const joi = require('joi')
const musicService = require('../service/music')
const statusCode = require('../utils/statusCode')

class MusicController {
  /**
   * 获取随机专辑
   * @param ctx
   * @returns {Promise<list>}
   */
  static async randomAlbum (ctx) {
    const res = await musicService.queryRandomAlbum()
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }
  /**
   * 获取随机歌曲
   * @param ctx
   * @returns {Promise<list>}
   */
  static async randomSong (ctx) {
    const res = await musicService.queryRandomSong()
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }
  /**
   * 获取歌手列表
   * @param ctx
   * @returns {Promise<list>}
   */
  static async getSingerList (ctx) {
    const res = await musicService.querySingerList()
    if (!res) {
      return (ctx.body = statusCode.Error_500('获取失败，请重试'))
    } else {
      return (ctx.body = statusCode.Success_200('获取成功', res))
    }
  }
  /**
   * 获取某个歌手的专辑列表
   * @param singerId
   * @returns {Promise<obj>}
   */
  static async getAlbumListBySingerId (ctx) {
    const { sid } = ctx.params
    if (!sid) {
      return (ctx.body = statusCode.Error_400('缺少歌手id'))
    } else {
      const res = await musicService.queryAlbumListBySingerId(sid)
      if (!res) {
        return (ctx.body = statusCode.Error_500('获取失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('获取成功', res))
      }
    }
  }
  /**
   * 获取歌手的所有
   * @param singerId
   * @returns {Promise<obj>}
   */
  static async getSongListByAlbumId (ctx) {
    const { aid } = ctx.params
    if (!aid) {
      return (ctx.body = statusCode.Error_400('缺少专辑id'))
    } else {
      const res = await musicService.querySongListByAlbumId(aid)
      if (!res) {
        return (ctx.body = statusCode.Error_500('获取失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('获取成功', res))
      }
    }
  }
  /**
   * 通过歌手信息
   * @param singerId
   * @returns {Promise<boolean>}
   */
  static async getOneSinger (ctx) {
    const { sid } = ctx.params
    if (!sid) {
      return (ctx.body = statusCode.Error_400('缺少歌手id'))
    } else {
      const res = await musicService.queryOneSinger(sid)
      if (!res) {
        return (ctx.body = statusCode.Error_500('获取失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('获取成功', res))
      }
    }
  }
  /**
   * 获取某个专辑下的所有歌
   * @param singerID
   * @returns {Promise<boolean>}
   */
  static async getAlbumlist (ctx) {
    const { aid } = ctx.params
    if (!aid) {
      return (ctx.body = statusCode.Error_400('缺少专辑id'))
    } else {
      const res = await musicService.queryAlbumlist(aid)
      if (!res) {
        return (ctx.body = statusCode.Error_500('获取失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('获取成功', res))
      }
    }
  }

  /**
   * 删除歌曲
   * @param songId
   * @returns {Promise<boolean>}
   */
  static async deleteSinger (ctx) {
    const { sid } = ctx.params
    if (!sid) {
      return (ctx.body = statusCode.Error_400('参数错误'))
    } else {
      const res = await musicService.deleteSinger(sid)
      if (!res) {
        return (ctx.body = statusCode.Success_500('删除失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('删除成功'))
      }
    }
  }
  /**
   * 删除歌曲
   * @param songId
   * @returns {Promise<boolean>}
   */
  static async deleteAlbum (ctx) {
    const { aid } = ctx.params
    if (!aid) {
      return (ctx.body = statusCode.Error_400('参数错误'))
    } else {
      const res = await musicService.deleteAlbum(aid)
      if (!res) {
        return (ctx.body = statusCode.Success_500('删除失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('删除成功'))
      }
    }
  }
  /**
   * 删除歌曲
   * @param songId
   * @returns {Promise<boolean>}
   */
  static async deleteSong (ctx) {
    const { sid } = ctx.params
    if (!sid) {
      return (ctx.body = statusCode.Error_400('参数错误'))
    } else {
      const res = await musicService.deleteSong(sid)
      if (!res) {
        return (ctx.body = statusCode.Success_500('删除失败，请重试'))
      } else {
        return (ctx.body = statusCode.Success_200('删除成功'))
      }
    }
  }
}

module.exports = router => {
  // 随机推荐
  router.get('/randomAlbum', MusicController.randomAlbum)
  router.get('/randomSong', MusicController.randomSong)
  // 分页列表
  router.get('/singerList', MusicController.getSingerList)
  router.get('/albumList/:sid', MusicController.getAlbumListBySingerId)
  router.get('/songList/:aid', MusicController.getSongListByAlbumId)
  // 获取单个信息
  router.get('/singer/:sid', MusicController.getOneSinger)
  router.get('/album/:aid', MusicController.getAlbumlist)
  // 删除
  router.delete('singer/:sid', MusicController.deleteSinger)
  router.delete('album/:aid', MusicController.deleteAlbum)
  router.delete('song/:sid', MusicController.deleteSong)
}
