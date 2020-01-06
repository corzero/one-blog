const axios = require('axios')
const cheerio = require('cheerio')
const SingerModel = require('../mongodb/Schema/singer')
const AlbumModel = require('../mongodb/Schema/album')
const SongModel = require('../mongodb/Schema/song')
axios.defaults.withCredentials = true
class MiGu {
  constructor(id) {
    this.baseUrl = 'http://music.migu.cn/v3/music/artist/' + id + '/album'
    this.pageList = []
    this.albumList = []
    this.from = 'MUGU'
  }
  // 开始
  async init() {
    await this.getPageList()
    await this.getAlbumList()
    await this.saveInfo()
  }
  // 辅助函数--获取专辑分页
  async getPageList() {
    const urlList = []
    const html = await axios
      .get(this.baseUrl)
      .catch(e => console.log('访问歌手专辑页失败', e))
    const $ = cheerio.load(html.data)
    const page = $('.pagination-item').length || 0
    console.log(`歌手专辑页总计${page}页`)
    for (let i = 0; i < page; i++) {
      this.pageList.push(this.baseUrl + `?page=${i + 1}`)
    }
  }
  // 获取每个专辑详情列表
  async getAlbumList() {
    if (this.pageList.length < 1) {
      console.log('专辑页数错误，任务中断.....\n')
    } else {
      const singerObj = {
        uid: null,
        from: this.from,
        name: null,
        desc: null,
        albumList: [],
        picUrl: null,
        path: ''
      }
      for (let h = 0; h < this.pageList.length; h++) {
        const pagehtml = await axios
          .get(this.pageList[h])
          .catch(e => console.log(`访问专辑页:${this.pageList[h]}失败`, e))
        const $ = cheerio.load(pagehtml.data)
        if (h < 1) {
          singerObj.uid = $('#J_FollowArtist').attr('data-id')
          singerObj.name = $('.artist-name a').text()
          singerObj.desc = $('#J_ArtistIntro .content').text()
          singerObj.picUrl = $('.artist-avatar img').attr('src')
        }
        $('.artist-album-list .album-name').each((i, e) => {
          singerObj.albumList.push($('.thumbnail span').attr('data-id'))
          this.albumList.push('http://music.migu.cn' + $(e).attr('href'))
        })
        if (h === this.pageList.length - 1) {
          const umodel = new SingerModel(singerObj)
          const ures = await umodel.save().catch(e => console.log(e))
          ures &&
            console.log(
              `歌手：${singerObj.name}信息存入成功，收集专辑访问列表......\n\n`
            )
        }
      }
      console.log(
        `专辑列表收集成功,共计${
          this.albumList.length
        }张，开始爬取专辑信息.....\n\n`
      )
    }
  }

  // 保存专辑信息和歌曲信息
  async saveInfo() {
    if (this.albumList.length < 1) {
      console.log('专辑详情列表错误，任务中断.....\n')
    } else {
      let albumNum = 0
      let songNum = 0
      for (let i = 0; i < this.albumList.length; i++) {
        const { anum, snum } = await this.saveAlbumAndSong(this.albumList[i])
        albumNum += anum
        songNum += snum
      }
      console.log(
        `\n\n爬取任务结束!!!，成功保存专辑:${albumNum},歌曲:${songNum}\n\n`
      )
    }
  }
  // 保存辅助函数
  async saveAlbumAndSong(albumUrl) {
    const from = this.from
    const songListObj = []
    let anum = 0
    let snum = 0
    const album = await axios
      .get(albumUrl)
      .catch(e => console.log(`专辑页URL:${albumUrl}失败`, e))
    const $ = cheerio.load(album.data)
    console.log('name:', $('.content .title').text())
    // 收集专辑信息
    const albumObj = {
      aid: $('#J_ResId').val(),
      from: from,
      name: $('.content .title').text(),
      desc: $('#J_IntroInline').text(),
      picUrl: $('.mad-album-info img').attr('src'),
      singer: $('.singer-name a')
        .attr('href')
        .split('/')
        .slice(-1)[0],
      pubTime: $('.pub-date')
        .text()
        .slice(5),
      songList: [],
      path: ''
    }
    const amodel = new AlbumModel(albumObj)
    const ares = await amodel.save().catch(e => console.log(e))
    ares && anum++
    ares &&
      console.log(
        `${albumObj.name}专辑已经入库，等待当前专辑歌曲入库......\n\n\n`
      )
    // 收集歌曲信息
    $('.J_CopySong').each((i, ele) => {
      const singers = Array.prototype.slice.call(
        $('.song-singers a', ele).map(
          (i, e) =>
            $(e)
              .attr('href')
              .split('/')[4]
        )
      )
      const songObj = {
        sid: $(ele).attr('data-cid'),
        from: from,
        albumId: $(ele).attr('data-aid'),
        singer: singers,
        name: $('.song-name-txt', ele).text(),
        lyric: null, // 歌词
        write: null, // 作词
        melody: null, // 作曲
        duration: $('.song-duration span', ele).text(),
        path: 'http://music.migu.cn' + $('.song-name-txt', ele).attr('href')
      }
      songListObj.push(songObj)
    })
    // 存入库
    for (let i = 0; i < songListObj.length; i++) {
      const smodel = new SongModel(songListObj[i])
      const sres = await smodel.save().catch(e => console.log(e))
      const update = await AlbumModel.updateOne(
        { aid: albumObj.aid },
        { $push: { songList: songListObj[i].sid }}
      )
      sres && snum++
      update &&
        sres &&
        console.log(
          `歌曲：${songListObj[i].name}已经入库，等待结束......\n\n\n`
        )
    }
    console.log(
      `专辑：${albumObj.name}存入成功，共计${
        songListObj.length
      }首歌曲，成功存入${snum}首`
    )
    return { anum, snum }
  }
}

const zjl = new MiGu(112)
zjl.init()
