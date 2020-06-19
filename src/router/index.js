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
    component: () => import('../views/videoSystem')
  }
  ]
}
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.publicPath,
  routes
})
router.beforeEach((to, from, next) => {
  // const token = sessionStorage.getItem('token')
  const notNeedToLogin = ['login', 'register', 'forgetPass']
  if (notNeedToLogin.indexOf(to.name) > -1) {
    next()
  } else {
    // if (!token || !to.name) {
    //   next({ name: 'login' })
    //   return
    // }
    next()
  }
})
export default router
