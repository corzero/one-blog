const axios = require('axios')
const qs = require('qs')
const cheerio = require('cheerio')
class SHUANG {
  constructor(params = { cookie: null, times: 60 }) {
    this.times = Math.ceil(params.times)
    this.axios = null
    this.projectList = []
    this.initAxios(params.cookie)
  }
  async init() {
    await this.getProjectList()
    await this.getcourseList()
    await this.commit()
  }
  initAxios(c) {
    this.axios = axios.create({
      timeout: 10000,
      withCredentials: true
    })
    this.axios.defaults.headers.common['Cookie'] = c
  }
  async getProjectList() {
    const res = await this.axios
      .get('http://www.sww.com.cn/html/myProfile')
      .catch(e => {
        console.log('获取项目列表失败', e)
      })
    const $ = cheerio.load(res.data)
    $('tbody tr td:last-child', $('.jix-kecheng')[1]).each((i, e) => {
      const projectId = $('a', e).attr('attr-data')
      if (projectId && i < this.times) {
        this.projectList.push({ pid: projectId, cid: [] })
      }
    })
    console.log(
      `成功获取${this.projectList.length}个项目，准备获取项目下的课程.....\n\n`
    )
  }
  async getcourseList() {
    for (let i = 0; i < this.projectList.length; i++) {
      const item = this.projectList[i]
      await this.axios
        .post(
          'http://www.sww.com.cn/member/joinProject',
          qs.stringify({
            project_id: item.pid
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        )
        .catch(e => console.log('加项目失败', e))
      const res = await this.axios
        .get(`http://www.sww.com.cn/html/projectDetail?project_id=${item.pid}`)
        .catch(e => {
          console.log('获取课程列表失败', e)
        })
      const $ = cheerio.load(res.data)
      $('.kecheng-titles a', '.kecheng-list').each((i, e) => {
        const cid = $(e)
          .attr('href')
          .split('&')[0]
          .split('=')[1]
        if (cid) {
          item.cid.push(cid)
        }
      })
    }
    console.log('所有项目课程获取完毕，开始答题......\n\n')
  }

  async commit() {
    for (let i = 0; i < this.projectList.length; i++) {
      console.log(`项目:\n${this.projectList[i].pid}学习开始......\n\n`)
      for (let h = 0; h < this.projectList[i].cid.length; h++) {
        if (this.projectList[i].pid && this.projectList[i].cid[h]) {
          let res1 = null
          let res2 = null
          let res3 = null
          console.log('视频观看开始.....\n')
          res1 = await this.study(
            this.projectList[i].pid,
            this.projectList[i].cid[h],
            0,
            1
          )
          if (res1) {
            console.log('视频观看结束.....\n')
            res2 = await this.study(
              this.projectList[i].pid,
              this.projectList[i].cid[h],
              1,
              1
            )
          }
          if (res2) {
            console.log('答题开始.....\n')
            res3 = await this.study(
              this.projectList[i].pid,
              this.projectList[i].cid[h],
              0,
              2
            )
          }
          if (res3) {
            console.log('答题结束.....\n')
            await this.study(
              this.projectList[i].pid,
              this.projectList[i].cid[h],
              1,
              2
            )
          }
        }
      }
      console.log(`项目:\n${this.projectList[i].pid}学习完毕......\n\n`)
    }
    console.log(`所有项目学习完毕！！！！......\n\n`)
  }
  async study(pid, cid, compelet, type) {
    const res = await this.axios
      .post(
        'http://www.sww.com.cn/member/logStudy',
        qs.stringify({
          type: type,
          project_id: pid,
          study_id: cid,
          is_complete: compelet
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      )
      .catch(e => console.log('学习失败，错误原因', res.data))
    return res.data
  }
}
const args = process.argv.splice(2)
console.log(args)
const shuang = new SHUANG({
  cookie: args[0],
  times: args[1] || 3
})
shuang.init()
