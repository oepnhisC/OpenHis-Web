import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GuaHao from '@/views/guahao/GuaHao.vue'
import MenZhen from '@/views/menzhen/MenZhen.vue'
import ShouFei from '@/views/shoufei/ShouFei.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home',    component: HomeView   },
    { path: '/GuaHao',      name: 'GuaHao',   component: GuaHao   },
    { path: '/MenZhen',      name: 'MenZhen',   component: MenZhen   },
    {path:'/ShouFei',name:'ShouFei',component:ShouFei},

  ]
})

export default router
