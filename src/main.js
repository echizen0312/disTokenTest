// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

//import store from './vuex/store'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(MuseUI);

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  next()
})

/* eslint-disable no-new */
//页面挂载部分
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
