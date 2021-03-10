import Vue from 'vue'
import VueRouter from 'vue-router'
import globalApi from '../utils/globalApi'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
document.title = globalApi.configJson.projectTitle || globalApi.projectTitle
const routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home'),
    children: [
      // gis调度(异常处理)
      {
        path: '/gisDispatchDispose',
        name: 'gisDispatchDispose',
        component: () => import('../views/gisDispatch/caseDetail')
      },
      // gis调度
      {
        path: '/gisDispatch',
        name: 'gisDispatch',
        component: () => import('../views/gisDispatch')
      },
      // 实时视频
      {
        path: '/videoSystem',
        name: 'videoSystem',
        component: () => import('../views/videoSystem/realVideo')
      },
      // 设备地图
      {
        path: '/deviceMap',
        name: 'deviceMap',
        component: () => import('../views/videoSystem/deviceMap')
      },
      // 回放
      {
        path: '/playback',
        name: 'playbackSystem',
        component: () => import('../views/videoSystem/playback')
      },

      // 案件中心
      {
        path: '/caseCenter',
        name: 'caseCenter',
        component: () => import('../views/caseCenter')
      },
      // 系统设置
      {
        path: '/systemSettings',
        name: 'systemSettings',
        component: () => import('../views/systemSettings'),
        children: []
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/webRs/',
  routes,
  // 记录滚动条的坐标
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  const notNeedToLogin = ['login', 'register', 'forgetPass']
  if (notNeedToLogin.indexOf(to.name) > -1) {
    next()
  } else {
    if (!token || !to.name) {
      next({ name: 'login' })
      return
    }
    next()
  }
})

export default router
