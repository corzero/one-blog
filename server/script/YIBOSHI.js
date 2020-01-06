const axios = require('axios')
const qs = require('qs')
class YiBoShi {
  constructor(params = { cookie: null, token: null, userId: null, score: 30 }) {
    this.score = params.score || 25
    this.uid = params.userId
    this.axios = null
    this.unfinish = []
    this.videoList = []
    this.questionList = []
    this.initAxios(params.cookie, params.token)
  }
  initAxios(c, t) {
    this.axios = axios.create({
      baseURL: 'http://shiyanma.yiboshi.com/',
      timeout: 20000,
      withCredentials: true
    })
    this.axios.defaults.headers.common['Authorization'] = t
    this.axios.defaults.headers.common['Cookie'] = c
  }
  async init() {
    await this.getUnfinishList()
    await this.getRealUrlList()
    await this.setVideoTime()
    await this.awanser()
    await this.applyCredit()
  }
  async login() {
    const res = await this.axios
      .post(
        'http://apicloud.yiboshi.com/api-study/v1/users/login',
        qs.stringify({
          password: this.password,
          username: this.username
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      )
      .catch(e => console.log('登录失败，错误原因', res.data))
    const userInfo = res.data.userInfo
    this.cookie = res.cookie
    this.uid = userInfo.id
    this.token = res.data.token
    console.log(`登录成功，欢迎：${userInfo.realName}，准备获取信息.....`)
    process.send(`登录成功，欢迎：${userInfo.realName}，准备获取信息.....`)
  }
  // 获取没完成的列表
  async getUnfinishList() {
    const res = await this.axios
      .get(
        `http://api.yiboshi.com/api/study/student/listStudentProjInfoAndStatus?userId=${
          this.uid
        }&trainingId=826&projType=&projState=&creType=&creValue=&projParam=&myProj=false&subId=`
      )
      .catch(e => console.log(`访问列表失败`, e))
    const list = res.data.data.list
    process.send(`未完成任务列表：${list.length}`)
    // 已完成
    const isfinished = list.filter(e => e.projState == 2 || e.projState == 3)
    // 未完成(只要1分的，2.5分要多次刷视频)
    const unfinished = list.filter(
      e =>
        (e.projState == undefined || e.projState == 0 || e.projState == 1) &&
        e.creditSetting == 1
    )
    if (isfinished.length < this.score) {
      this.unfinish = unfinished.slice(0, this.score - isfinished.length)
      process.send(
        `当前用户分数${isfinished.length}，其中未完成分数${
          this.unfinish.length
        }，等待刷分`
      )
    } else {
      process.send('当前用户25分满足，无需刷分，任务结束')
    }
  }
  // 获取视频，答题列表
  async getRealUrlList() {
    for (let i = 0; i < this.unfinish.length; i++) {
      const res = await this.axios
        .get(
          `http://api.yiboshi.com/api/study/project/getProjectCourse?trainingId=${
            this.unfinish[i].trainingId
          }&projectId=${this.unfinish[i].projId}`
        )
        .catch(e => console.log('获取课程id错误：', e))
      // process.send('当前值', this.unfinish[i])
      // process.send('返回参数', res.data.data.data[0].id)
      const video = {
        cId: res.data.data.data[0].id,
        pId: this.unfinish[i].projId,
        tId: this.unfinish[i].trainingId,
        upTime: 40
      }
      const scroe = {
        trainingId: this.unfinish[i].trainingId,
        projectId: this.unfinish[i].projId,
        userId: this.uid,
        courseId: res.data.data.data[0].id,
        score: 100,
        versionId: 3.1
      }
      res && this.videoList.push(video)
      res && this.questionList.push(scroe)
    }
    process.send('视频列表，答题列表获取成功准备开始。')
  }
  // 刷时间
  async setVideoTime() {
    if (this.videoList.length < 1) {
      process.send('视频列表为空。时间任务结束.....\n\n')
    } else {
      for (let index = 0; index < this.videoList.length; index++) {
        // 获取时间长度
        const getTimeRes = await this.axios
          .get(
            `http://apicloud.yiboshi.com/api-study/v1/users/${
              this.uid
            }/course/percent?trainingId=${
              this.videoList[index].tId
            }&projectId=${this.videoList[index].pId}&courseId=${
              this.videoList[index].cId
            }`
          )
          .catch(e => console.log('获取时间长度失败：', e))
        const { courseCountTime, viewCourseTime } = getTimeRes.data
        const times = Math.ceil((courseCountTime - viewCourseTime) / 40)
        for (let i = 0; i < times; i++) {
          await this.axios
            .post(
              'http://api.yiboshi.com/api/study/course/syncCourseStatus',
              qs.stringify({
                cId: this.videoList[index].cId,
                pId: this.videoList[index].pId,
                tId: this.videoList[index].tId,
                upTime: 40
              }),
              {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
              }
            )
            .catch(e => console.log('增加时间失败', e))
        }
        process.send(
          `视频：${
            this.videoList[index].cId
          }总时长${courseCountTime}, 观看时间增加完成，准备下一个视频`
        )
      }
      process.send('视频观看时间增加成功, 开始答题')
    }
  }
  // 答题
  async awanser() {
    if (this.questionList.length < 1) {
      process.send('题目列表为空。答题任务结束')
    } else {
      process.send(`未答题${this.questionList.length}个题目，准备答题`)
      for (let i = 0; i < this.questionList.length; i++) {
        const saveRes = await this.axios
          .post(
            `http://api.yiboshi.com/api/WebApp/commitCoursePracticeScore?trainingId=${
              this.questionList[i].trainingId
            }&projectId=${this.questionList[i].projectId}&userId=${
              this.uid
            }&courseId=${this.questionList[i].courseId}&score=100&versionId=3.1`
          )
          .catch(e => console.log('答题失败：', e))
      }
      process.send('刷题结束，任务完成！！')
    }
  }
  // 申请学分
  async applyCredit() {
    const res = await this.axios
      .get(
        `http://api.yiboshi.com/api/study/student/listStudentProjInfoAndStatus?userId=${
          this.uid
        }&trainingId=826&projType=&projState=&creType=&creValue=&projParam=&myProj=false&subId=`
      )
      .catch(e => console.log(`访问列表失败`, e))
    const list = res.data.data.list
    // 已完成但未申请学分的
    const unCredit = list.filter(e => e.projState == 2)
    process.send(`未申请学分${unCredit.length}个`)
    for (let i = 0; i < unCredit.length; i++) {
      await this.axios
        .post(
          'http://api.yiboshi.com/api/study/credit/applyCredit',
          qs.stringify({
            projectId: unCredit[i].projId,
            trainingId: unCredit[i].trainingId,
            userId: this.uid
          })
        )
        .catch(e => console.log(`访问列表失败`, e))
    }
    process.send('所有科目学分申请成功！')
  }
}
// cookie,token,uid
// const args = process.argv.splice(2)
const args = process.argv.slice(2)
// process.send(args)
if (args.length === 3) {
  const yiboshi = new YiBoShi({
    cookie: args[0],
    token: args[1],
    userId: args[2],
    score: 30
  })
  process.send('开始任务')
  yiboshi.init()
} else {
  process.send('参数错误请检查参数')
}
