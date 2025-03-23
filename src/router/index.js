import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GuaHao from '@/views/guahao/GuaHao.vue'
import MenZhen from '@/views/menzhen/MenZhen.vue'
import ShouFei from '@/views/shoufei/ShouFei.vue'
import yibaofuzhu from '@/views/yibao/YiBaoFuZhu.vue'
import RenYuanYiBaoXinxi from '@/views/yibao/RenYuanYiBaoXinxi.vue'
import MenZhenJieZhangGuanLi from '@/views/shoufei/MenZhenJieZhangGuanLi.vue'
import GaoLingZiFeiBiao from '@/views/shoufei/GaoLingZiFeiBiao.vue'
import MenZhenTuiFei from '@/views/shoufei/MenZhenTuiFei.vue'
import ZiFeiBingRenShangChuan from '@/views/yibao/ZiFeiBingRenShangChuan.vue'
import UserManage from '@/views/manager/UserManage.vue'
import Login from '@/views/user/Login.vue'
import PermissionManager from '@/views/manager/PermissionManager.vue'
import HISManager from '@/views/manager/HISManager.vue'
import dad from '@/views/zhuyuan/dad.vue'
import ruyuan02 from '@/views/zhuyuan/ruyuan02.vue'
import ChangePassword from '@/views/user/ChangePassword.vue'
import ShiQianFenXi from '@/views/yibao/ShiQianFenXi.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home',    component: HomeView   },
    { path: '/GuaHao',      name: 'GuaHao',   component: GuaHao   },
    { path: '/MenZhen',      name: 'MenZhen',   component: MenZhen   },
    {path:'/ShouFei',name:'ShouFei',component:ShouFei},
    {path:'/yibaofuzhu',name:'yibaofuzhu',component:yibaofuzhu},
    {path:'/RenYuanYiBaoXinxi',name:'RenYuanYiBaoXinxi',component:RenYuanYiBaoXinxi},
    {path:'/MenZhenJZGuanLi',name:'MenZhenJZGuanLi',component:MenZhenJieZhangGuanLi},
    {path:'/GaoLingZiFeiBiao',name:'GaoLingZiFeiBiao',component:GaoLingZiFeiBiao},
    {path:'/MenZhenTuiFei',name:'MenZhenTuiFei',component:MenZhenTuiFei},
    {path:'/ZiFeiBingRenShangChuan',name:'ZiFeiBingRenShangChuan',component:ZiFeiBingRenShangChuan},
    {path:'/Login',name:'Login',component:Login},
    {path:'/UserManage',name:'UserManage',component:UserManage},
    {path:'/dad',name:'dad',component:dad},
    {path:'/ruyuan02',name:'ruyuan02',component:ruyuan02},
    {path:'/PermissionManager',name:'PermissionManager',component:PermissionManager},
    {path:'/HISManager',name:'HISManager',component:HISManager},
    {path:'/ChangePassword',name:'ChangePassword',component:ChangePassword},
    {path:'/ShiQianFenXi',name:'ShiQianFenXi',component:ShiQianFenXi},
  ]
})

export default router
