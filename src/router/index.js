/* import Vue from 'vue'
import Router from 'vue-router' */
const Home = () => import('@/components/Home').then(m => m.default)
const AccountList = () => import('@/components/AccountList').then(m => m.default)

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home,
    children: [
      { 'path': '/AccountList', component: AccountList, 'name': 'AccountList' }
    ]
  }
]

export default routes;
