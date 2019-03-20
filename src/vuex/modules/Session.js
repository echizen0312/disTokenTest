//import from '../../api/api';

const getDefaultState = () => {
  return {
    userInfo: {},
    llal: 123
  }
};
const state = getDefaultState();

const actions = {
  /* GetSession({commit}) {
    requestApi.getSession().then(res => {
      commit('updateState', {'userInfo': res.data});
    });
  } */
};

const mutations = {
  updateState (state, payload) {
    return {...state, ...payload}
  },
  bool(state, { payload: field }) {
    let { [field]: bool } = state;
    return { ...state, [field]: !bool }
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
