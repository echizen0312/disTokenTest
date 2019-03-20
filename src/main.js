// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router'
import { Message ,MessageBox } from 'element-ui'
import { ToastPlugin,TransferDom,LoadingPlugin,AlertPlugin,ConfirmPlugin } from 'vux'
import infiniteScroll from 'vue-infinite-scroll'
//import MuseUI from 'muse-ui';
import VueResource from 'vue-resource'
//import 'muse-ui/dist/muse-ui.css';
import VueClipboard from 'vue-clipboard2'

import store from './vuex/store'
import VueRx from 'vue-rx';
import Rx from 'rxjs/Rx'

Vue.use(VueRx, Rx);

/* import myUtils from './api/Utils' */

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(infiniteScroll)
//Vue.use(MuseUI);
Vue.use(VueResource)
Vue.use(VueClipboard)

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.directive('transfer-dom', TransferDom)
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  const id = store.getters['EosConfig/AccountId'];
  const List = store.getters['EosConfig/AccountList'];
  if(to.path=='/' && id != ''){
    next({ name: 'WalletHome', 
      params: { 
        id: id
      }
    })
  }else if(to.path=='/' && id == '' && List.length > 0){
    next({ path: '/HomeList' });
  }else if(to.path=='/' && id == '' && List.length == 0){
    next({ path: '/guide' });
  }
  next()
})
/*
时间格式化
@method function
@param  Date
@return value
 */
Date.prototype.format = function(format){   
  let o = {  
    'M+': this.getMonth()+1, //month  
    'd+': this.getDate(), //day  
    'h+': this.getHours(), //hour  
    'm+': this.getMinutes(), //minute  
    's+': this.getSeconds(), //second  
    'q+': Math.floor((this.getMonth()+3)/3), //quarter  
    'S': this.getMilliseconds() //millisecond  
  }   
  if(/(y+)/.test(format)) {  
    format = format.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));  
  }  
  for(let k in o) {  
    if(new RegExp('('+ k +')').test(format)) {  
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k]: ('00'+ o[k]).substr((''+ o[k]).length));   
    }  
  }  
  return format;  
}
/* eslint-disable no-new */
//页面挂载部分
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
