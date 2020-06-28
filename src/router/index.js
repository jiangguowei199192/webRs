import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('../views/login')
},
{
  path: '/home',
  name: 'home',
  component: () => import('../views/home'),
  children: [{
    path: '/videoSystem',
    name: 'videoSystem',
    component: () => import('../views/videoSystem/realVideo')
  },
  {
    path: '/playback',
    name: 'playbackSystem',
    component: () => import('../views/videoSystem/playback')
  },
  {
    path: '/decisionSystem',
    name: 'decisionSystem',
    component: () => import('../views/decisionSystem')
  },
  {
    path: '/evaluationSystem',
    name: 'evaluationSystem',
    component: () => import('../views/evaluationSystem')
  },
  {
    path: '/digitalIndividual',
    name: 'digitalIndividual',
    component: () => import('../views/digitalIndividual')
  },
  {
    path: '/digitalEquipment',
    name: 'digitalEquipment',
    component: () => import('../views/digitalEquipment')
  },
  {
    path: '/systemSettings',
    name: 'systemSettings',
    component: () => import('../views/systemSettings')
  }
  ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.publicPath,
  routes
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token') || 'token'
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
