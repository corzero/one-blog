import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度加载条
import 'nprogress/nprogress.css' // 进度加载条样式
import { encodeToken } from '@/utils/auth' // 获取本地token
import { getPageTitle } from '@/utils/pageTitle'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/register'] // 无验证白名单

export const constantRoutes = [
  // 公共路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '主页', icon: 'dashboard' }
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/user/index'),
        meta: { title: '个人主页' },
        hidden: true
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: { title: '文章', icon: 'article' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/article/list'),
        meta: { title: '列表', icon: 'list' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/article/view'),
        meta: { title: '添加文章' },
        props: { type: 'add' },
        hidden: true
      },
      {
        path: 'view/:aid',
        name: 'View',
        component: () => import('@/views/article/view'),
        meta: { title: '查看文章' },
        props: { type: 'view' },
        hidden: true
      },
      {
        path: 'edit/:aid',
        name: 'Edit',
        component: () => import('@/views/article/view'),
        meta: { title: '编辑文章' },
        props: { type: 'edit' },
        hidden: true
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/article/config'),
        meta: { title: '设置', icon: 'setting' }
      }
    ]
  },
  {
    path: '/storage',
    component: Layout,
    redirect: '/storage/list',
    name: 'Music',
    meta: { title: '云盘', icon: 'cloud' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/storage/index'),
        meta: { title: '全部文件', icon: 'list' },
        props: { type: -1 }
      },
      {
        path: 'document',
        name: 'Document',
        component: () => import('@/views/storage/index'),
        meta: { title: '文档', icon: 'document' },
        props: { type: 0 }
      },
      {
        path: 'video',
        name: 'Video',
        component: () => import('@/views/storage/index'),
        meta: { title: '视频', icon: 'video' },
        props: { type: 1 }
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import('@/views/storage/index'),
        meta: { title: '音乐', icon: 'music' },
        props: { type: 2 }
      },
      {
        path: 'other',
        name: 'Other',
        component: () => import('@/views/storage/index'),
        meta: { title: '其他', icon: 'other' },
        props: { type: 3 }
      },
      {
        path: 'trash',
        name: 'Trash',
        component: () => import('@/views/storage/trash'),
        meta: { title: '回收站', icon: 'trash' }
      }
    ]
  },
  {
    path: '/music',
    component: Layout,
    redirect: '/music/list',
    name: 'Music',
    meta: { title: '音乐', icon: 'music' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/music/search'),
        meta: { title: '搜索', icon: 'search' }
      },
      {
        path: 'singer/:sid',
        name: 'Singer',
        component: () => import('@/views/music/singer')
      },
      {
        path: 'album/:aid',
        name: 'Album',
        component: () => import('@/views/music/album')
      },
      {
        path: 'song',
        name: 'Song',
        component: () => import('@/views/music/song')
      }
    ]
  },
  {
    path: '/script',
    component: Layout,
    redirect: '/script/list',
    name: 'Script',
    meta: { title: '脚本', icon: 'script' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/script/list'),
        meta: { title: '脚本', icon: 'script' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// 权限验证
router.beforeEach(async (to, from, next) => {
  // 开始 加载
  NProgress.start()
  // 设置页面title
  document.title = getPageTitle(to.meta.title)
  // 获取本地token
  const hasToken = encodeToken()
  if (hasToken && store.getters.token) {
    if (to.path === '/login') {
      // 如果有token且去向login 跳转到根页面
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo =
        store.getters.user._id && store.getters.user.username
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          console.log(router, to)
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果没token 过滤白名单
      next()
    } else {
      // 其他无权访问的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条完毕
  NProgress.done()
})

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
