/**
 * Created by Kc on 2018/06/04.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  'login': {
    'loginName': '',
    'trustee': '',
    'userType': '',
    'eid': ''
  }
}

const mutations = {
  Slogin(state,data) {
    let {loginName,trustee,userType,eId} =data;
    state.login={...state.login,loginName: loginName,trustee: trustee,userType: userType,eid: eId};
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [
    createPersistedState({storage: window.sessionStorage})
  ]
})
/*
let bus;
if(typeof bus =='undefined'){
    bus = new Vue();
}
export bus;
*/