/**
 * Created by Kc on 2018/06/04.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import session from './modules/Session'
import EosConfig from './modules/EosConfig'

const vuexPersist = new VuexPersist({
  key: 'eos',
  storage: localStorage
})
Vue.use(Vuex)

export default new Vuex.Store({
  /* state,
  getters,
  mutations,
  actions, */
  plugins: [vuexPersist.plugin],
  modules: {
    session,
    EosConfig
  }
})
/*
let bus;
if(typeof bus =='undefined'){
    bus = new Vue();
}
export bus;
*/