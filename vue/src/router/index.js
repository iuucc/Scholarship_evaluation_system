import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'
import store from "@/store";

Vue.use(VueRouter)

const routes = [

  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name:'Login',
    component:()=>import('../views/Login.vue')
  },
  {
    path: '/register',
    name:'Register',
    component:()=>import('../views/Register.vue')
  },
  {
    path: '/404',
    name:'404',
    component:()=>import('../views/404.vue')
  },
  {
    path: '/index',
    name:'index',

    children:[
      {
        path:'home',
        name:'home',

      }, {
        path:'order',
        name:'order',

      },{
        path:'car',
        name:'car',

      },{
        path:'message',
        name:'message',

      },
      {
        path:'password',
        name:'password',

      },
      {
        path:'person',
        name:'person',

      },{
        path:'detail',
        name:'detail',

      },
      {
        path:'orderdetail',
        name:'orderdetail',
      },

    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export const setRouters =()=>{
  const storeMenus=localStorage.getItem("menus")
  if(storeMenus){
    const manageRoute={path: '/', name: 'Manage', component: () => import('../views/Manage.vue'), redirect: "/home", children: [
        {path:'person',name:'个人信息',component:()=>import('../views/Person.vue')},
        {path:'password',name:'修改密码',component:()=>import('../views/Password.vue')},
      ]}
    const menus=JSON.parse(storeMenus)
    menus.forEach(item=>{
      if(item.path){
        let itemMenu={path:item.path.replace("/",""),name:item.name,component:()=>import('../views/'+item.pagePath+'.vue')}
        manageRoute.children.push(itemMenu)
      }else  if(item.children.length){
        item.children.forEach(item=>{
          if(item.path){
            let itemMenu={path:item.path.replace("/",""),name:item.name,component:()=>import('../views/'+item.pagePath+'.vue')}
            manageRoute.children.push(itemMenu)
          }
        })
      }
    })
    const currentRoutes = router.getRoutes().map(v=>v.name)
    if(!currentRoutes.includes('Manage')){
      router.addRoute(manageRoute)
    }
  }
}

setRouters()
router.beforeEach((to,from,next)=>{
  localStorage.setItem("currentPathName",to.name)
  store.commit("setPath")
  if(!to.matched.length){
    const storeMenus=localStorage.getItem("menus")
    if(storeMenus){
      next("/404")
    }else{
      next("/login")
    }
  }
  next()
})
export default router
