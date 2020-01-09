import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // 进度加载条
import 'nprogress/nprogress.css' // 进度加载条样式
import store from '@/store'
import router from '@/router'
import { encodeToken } from '@/utils/auth'
// 请求列表
const requestList = []
// 取消列表
const CancelToken = axios.CancelToken
const sources = {}
// 进度条加载
NProgress.configure({ showSpinner: false, ease: 'ease', speed: 500 })
// 全局配置
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.timeout = 20000 // 超时取消请求
axios.interceptors.request.use(
  config => {
    // 请求列表载入
    const request = JSON.stringify(config.url) + JSON.stringify(config.data)
    config.cancelToken = new CancelToken(cancel => {
      sources[request] = cancel
    })
    if (!request.includes('storage') && requestList.includes(request)) {
      sources[request]() // 取消重复请求
    } else {
      requestList.push(request)
      NProgress.start().inc()
    }

    if (store.getters.token) {
      config.headers['authorization'] = `Bearer ${encodeToken()}` // Bearer类型Token
    }
    return config
  },
  error => {
    NProgress.done()
    requestList.length = 0
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    console.log(response)
    const request =
      JSON.stringify(response.config.url) + JSON.stringify(response.config.data)
    requestList.splice(requestList.findIndex(item => item === request), 1)
    if (requestList.length === 0) {
      NProgress.done()
    }
    const newToken = response.headers['authorization']
    // 检查是否含有Token
    if (newToken && newToken !== store.getters.token) {
      store.dispatch('user/addToken', newToken)
    }
    if (response.data.code !== 200) {
      if (response.data.code === 401) {
        // to re-login
        // MessageBox.confirm('身份验证失效，请重新登录或退出系统。', 'Tips~', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '退出',
        //   type: 'warning'
        // })
        //   .then(() => {
        //     location.reload()
        //   })
        //   .catch(action => {
        //     window.opener = null
        //     window.open('', '_self')
        //     window.close()
        //   })
        const redirect = router.currentRoute.fullPath
        store
          .dispatch('user/resetToken')
          .then(() => router.push(`/login?redirect=${redirect}`))
      } else {
        Message({
          message: response.data.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return { code: 401, msg: '身份失效' }
    } else {
      return response.data
    }
  },
  error => {
    if (axios.isCancel(error)) {
      requestList.length = 0
      throw new axios.Cancel('cancel request')
    } else {
      Message({
        message: '网络请求失败',
        type: 'error',
        duration: 5 * 1000
      })
    }
    NProgress.done()
    return Promise.reject(error || '未知错误')
  }
)

export default axios
