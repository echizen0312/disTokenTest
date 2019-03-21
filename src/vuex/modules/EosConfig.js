import { from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import Vue from 'vue'
import api from '../../api/api'
/* eslint-disable no-undef */
let Eos = require('eosjs') // 引入读写EOS
let EosApi = require('eosjs-api') // 引入只读EOS
let ecc = require('eosjs-ecc') // 引入EOS秘钥算法
let CryptoJS = require('crypto-js')

const getDefaultState = () => {
  return {
    /*global configList:true*/
    configList: configList,
    eosApi: null,
    eos: null,
    form: {
      privateKey: '',
      publicKey: '',
      accountName: '',
      netId: '',
      aesKey: ''
    },
    configobj: {},
    nodeJsAddress: '',
    TokenList: [],
    UserInfo: {},
    AccountList: [],
    AccountId: '',
    ceshi: ''
  }
};
const state = getDefaultState();
const getters = {
  AccountId: state => state.AccountId,
  AccountList: state => state.AccountList
}

const actions = {
  async getInfos({commit,state}){
    await commit('updateEosApi', state.configobj.netId);
    const eosApi = state.eosApi;
    return new Promise((resolve, reject) => {
      eosApi.getInfo({}).then(r => {
        resolve(r);
      }).catch(e => {
        reject(e);
      })
    }); 
  },
  ImportAccount({commit,state},parmas){
    let pub = null;
    let cb = parmas[1];
    let success = null;
    const eosApi = state.eosApi;
    const co = state.configList.find(function (obj) {
      return obj.netId === parmas[0].netId
    })
    if(co == undefined){
      Vue.prototype.$message({message: '不支持这条链',type: 'error',center: true});
    }else{
      try {
        pub = ecc.privateToPublic(parmas[0].privateKey)
      }
      catch(e) {
        Vue.prototype.$message({message: '私钥地址错误',type: 'error',center: true});
        return;
      }
      Vue.$vux.loading.show({text: 'Loading'});
      eosApi.getKeyAccounts(pub).then(r => {
        Vue.$vux.loading.hide();
        let ss = r.account_names
        if (ss !== undefined && ss.length === 1) {
          let accountName = ss[0]
          let ciphertext = CryptoJS.AES.encrypt(parmas[0].privateKey, parmas[0].aesKey);
          let aesR = ciphertext.toString();
          const obj = {
            netId: parmas[0].netId,
            id: new Date().getTime(),
            name: accountName,
            aesR: aesR,
            netName: co.netName
          }
          let HasClass = true;
          if(state.AccountList.length > 0){
            state.AccountList.some(item => {
              if(item.name == accountName && item.netId == parmas[0].netId){
                HasClass = false;
              }
            })
            if(HasClass){
              commit('updateState', {'Account': obj});
            }
          }else{
            commit('updateState', {'Account': obj});
          }
          /* if((new Set(state.AccountList)).size != state.AccountList.length){
            console.log('数组有重复数据')
          }else{
            commit('updateState', {'Account': obj});
          } */
          /* if(!state.AccountList){
            
            for(let key of state.AccountList){
              console.log(key.name)
              if(key.name == accountName){
                commit('updateState', {'Account': obj});
              }
            }
          }else{
            commit('updateState', {'Account': obj});
          } */
          success = true;
          cb(success);
        }else {
          success = false;
          Vue.prototype.$message({message: '秘钥可能不正确',type: 'error',center: true});
          cb(success);
        }
      }).catch(e => {
        success = false;
        Vue.$vux.loading.hide();
        Vue.prototype.$message({message: '链接口错误',type: 'error',center: true});
        cb(success);
      })
    }
  },
  getKeys({commit},parmas) {
    Vue.$vux.loading.show({text: 'Loading'});
    setTimeout(() => {
      ecc.randomKey().then(res => {
        Vue.$vux.loading.hide()
        const publicKey = ecc.privateToPublic(res);
        commit('SetEosform', {'prkey': res, 'pukey': publicKey});
        parmas('success');
      }).catch(() => {
        Vue.prototype.$message({message: '秘钥生成失败，请重新生成',type: 'error',center: true});
        Vue.$vux.loading.hide();
        parmas('error');
      })
    },500);
    /* const privateKey = ecc.randomKey();
      const publicKey = ecc.privateToPublic(123);
      commit('SetEosform', {'prkey': privateKey, 'pukey': publicKey}); */
  },
  createAccount({commit,state},parmas) {
    let cb = parmas[1];
    Vue.$vux.loading.show({text: 'Loading'});
    try{
      api.createAccount(`${state.configobj.nodeJsAddress}/eosSak/CreateSysAccount`,{
        accountName: parmas[0].accountName,
        pk: state.form.publicKey
      }).then(res => {
        Vue.$vux.loading.hide();
        let success = null;
        if(res.data.success){
          success = true;
          cb(success)
        }else{
          Vue.prototype.$message({message: '账户创建失败',type: 'error',center: true});
          success = false;
          cb(success)
        }
      }).catch(err => {
        console.log(err);
        Vue.$vux.loading.hide();
        Vue.prototype.$message({message: '账户创建失败',type: 'error',center: true});
      })
    }catch(e){
      console.log(e);
      Vue.$vux.loading.hide();
      Vue.prototype.$message({message: '账户创建失败',type: 'error',center: true});
    }
  },
   async getTokenList({commit,state},parmas) {
    await commit('updateEosApi', state.configobj.netId);
    const eosApi = state.eosApi;
    Vue.$vux.loading.show({text: 'Loading'});
    eosApi.getTableRows({'scope': 'usrtokenlist','code': 'usrtokenlist','table': 'token','json': true,'lower_bound': '','limit': 100}).then(async (res) => {
      if(res.rows.length == 0){
        Vue.$vux.loading.hide();
      }
      let rows = [];
      /* from(res.rows).pipe(
        map(x => of(x).pipe(async item => {
          const data = await eosApi.getCurrencyBalance({code: item.value.code,account: parmas,symbol: item.value.symbol});
          if (data.length === 0) {
            item.value.balance = 0;
          } else {
            item.value.balance = data[0].split(` ${item.symbol}`)[0];
          } 
        return item.value;
        })),
        concatAll()
      ).subscribe(item => rows.push(item)); */
      from(res.rows).pipe(concatMap(async item => {
          const data = await eosApi.getCurrencyBalance({code: item.code,account: parmas,symbol: item.symbol});
          if (data.length === 0) {
            item.balance = 0;
          } else {
            item.balance = data[0].split(` ${item.symbol}`)[0];
          }
          return item;
        })
      ).subscribe(item => rows.push(item));
      /* new Observable.from(res.rows).concatMap(async item => {
        const data = await eosApi.getCurrencyBalance({code: item.code,account: parmas,symbol: item.symbol});
        if (data.length === 0) {
          item.balance = 0;
        } else {
          item.balance = data[0].split(` ${item.symbol}`)[0];
        }
        return item;
      }).subscribe(item => rows.push(item)); */
      /* new Observable.from(res.rows).map(item => item).subscribe(
        async item => {
          const data = await eosApi.getCurrencyBalance({code: item.code,account: parmas,symbol: item.symbol});
          if (data.length === 0) {
            item.balance = 0;
          } else {
            item.balance = data[0].split(` ${item.symbol}`)[0];
          }
          console.log(item);
          rows.push(item);
        }/* ,err => console.error('Observer got an error: ' + err),() => {
          Vue.$vux.loading.hide();
          commit('SetTokenList',rows);
        }
      ); */
      Vue.$vux.loading.hide();
      commit('SetTokenList',rows);
      /* for(let i =0; i < res.rows.length; i++){
        let item = res.rows[i];
        const data = await eosApi.getCurrencyBalance({code: item.code,account: parmas,symbol: item.symbol});
        if (data.length === 0) {
          item.balance = 0;
        } else {
          item.balance = data[0].split(` ${item.symbol}`)[0]; //Number.parseFloat(data[0].split(` ${item.symbol}`)[0])
        }
        if(i+1 == res.rows.length){
          Vue.$vux.loading.hide();
          commit('SetTokenList',res.rows);
        }
      } */
    }).catch(e => {
      Vue.$vux.loading.hide();
      //reject(e);
    });
  },
  async getTransferList({commit,state},payload){
    await commit('updateEosApi', state.configobj.netId);
    const eosApi = state.eosApi;
    Vue.$vux.loading.show({text: 'Loading'});
    return new Promise((resolve, reject) => {
      eosApi.getActions(payload.name, -1, -100).then(res => {
        let IsAll = true; //是否需要继续分页
        let cp = -1;
        let result = res.actions;
        if(res.actions.length > 0){
          if(result[0].account_action_seq == 0){
            IsAll = false;
          }else{
            cp = result[0].account_action_seq;
          }
        }
        Vue.$vux.loading.hide();
        let Arr = []
        result.reverse();
        for(const key of result){
          let obj
          if (key != undefined && key.act != undefined) {
            obj = key;
          } else if (key != undefined && key.action_trace != undefined) {
            obj = key.action_trace
          } else {
              continue
          }
          if(obj.receipt.receiver == payload.name && obj.act.account == payload.code && obj.act.name == 'transfer'){
            let cache = obj.act.data.quantity.split(' ');
            if (cache.length == 2 && cache[1] == payload.symbol){
              if(obj.act.data.to == payload.name){
                Arr.push({
                  trx_id: obj.trx_id,
                  account: obj.act.account,
                  name: obj.act.name,
                  data: obj.act.data,
                  seq: key.account_action_seq,
                  time: new Date(key.block_time).format('yyyy-MM-dd hh:mm'),
                  type: 'in'
                });
              }else if(obj.act.data.from == payload.name){
                Arr.push({
                  trx_id: obj.trx_id,
                  account: obj.act.account,
                  name: obj.act.name,
                  data: obj.act.data,
                  seq: key.account_action_seq,
                  time: new Date(key.block_time).format('yyyy-MM-dd hh:mm'),
                  type: 'out'
                });
              }
            }
          }
        }
        resolve({arr: Arr,IsAll: IsAll,cp: cp});
      }).catch(e => {
        Vue.$vux.loading.hide();
        //reject(e);
      })
    }); 
  },
  async getAllTransferList({commit,state},payload){
    await commit('updateEosApi', state.configobj.netId);
    const eosApi = state.eosApi;
    Vue.$vux.loading.show({text: 'Loading'});
    return new Promise((resolve, reject) => {
      eosApi.getActions(payload.name, payload.cp, payload.ps).then(res => {
        let IsAll = true; //是否需要继续分页
        let cp = -1;
        let result = res.actions;
        if(res.actions.length > 0){
          if(result[0].account_action_seq == 0){
            IsAll = false;
          }else{
            cp = result[0].account_action_seq; 
          }
        }
        Vue.$vux.loading.hide();
        let Arr = [];
        result.reverse();
        for(const key of result){
          let obj
          if (key != undefined && key.act != undefined) {
            obj = key;
          } else if (key != undefined && key.action_trace != undefined) {
            obj = key.action_trace
          } else {
              continue
          }
          if(obj.receipt.receiver == payload.name && obj.act.name == 'transfer'){
            let cache = obj.act.data.quantity.split(' ');
            if (cache.length == 2){
              if(obj.act.data.to == payload.name){
                Arr.push({
                  trx_id: obj.trx_id,
                  account: obj.act.account,
                  name: obj.act.name,
                  data: obj.act.data,
                  seq: key.account_action_seq,
                  time: new Date(key.block_time).format('yyyy-MM-dd hh:mm'),
                  type: 'in'
                });
              }else if(obj.act.data.from == payload.name){
                Arr.push({
                  trx_id: obj.trx_id,
                  account: obj.act.account,
                  name: obj.act.name,
                  data: obj.act.data,
                  seq: key.account_action_seq,
                  time: new Date(key.block_time).format('yyyy-MM-dd hh:mm'),
                  type: 'out'
                });
              }
            }
          }
        }
        resolve({arr: Arr,IsAll: IsAll,cp: cp});
      }).catch(e => {
        Vue.$vux.loading.hide();
        //reject(e);
      })
    }); 
  },
  //支付轮询
  async getPayMent({commit,state},payload){
    //轮询没问题了貌似，明天精简下代码。最好把.vue里面处理链的部分拿到这里来处理
    await commit('updateEosApi', state.configobj.netId);
    const eosApi = state.eosApi;
    return new Promise((resolve, reject) => {
      eosApi.getActions(payload.name, payload.pos, payload.offset).then(async (res) => {
        const actions = res.actions;
        let r = {
            datas: [],
            lastId: -1,
            obj: null
        };
        r.lastId = actions.length == 0 ? 0 : actions[actions.length - 1].account_action_seq;
        const tmp = actions[0];
        if(!tmp){
          resolve(r);
          return;
        }
        if (payload.pos != -1 && tmp.action_trace.receipt.receiver == payload.name && tmp.action_trace.act.name == 'transfer' && tmp.action_trace.act.account == 'sakmsg' && tmp.action_trace.act.data.to == payload.name){
          let data = {
            id: -1,
            time: '',
            from: '',
            memo: '',
            balance: '',
            obj: null
          };
          data.id = tmp.account_action_seq;
          data.time = tmp.block_time;
          data.from = tmp.action_trace.act.data.from;
          data.memo = tmp.action_trace.act.data.memo;
          let key = CryptoJS.enc.Hex.parse('74d811ae023038d5a4036cb6b12e8215467edf56a426f9574632ed79911f2b88');
          let iv = CryptoJS.enc.Hex.parse('0697327deacb3f7696dc0baafc5810a8');
          let bytes = CryptoJS.AES.decrypt(data.memo, key, {iv: iv});
          let plaintext = bytes.toString(CryptoJS.enc.Utf8);
          if(plaintext !=''){
            const obj = JSON.parse(plaintext);
            r.obj = obj;
            const bala = await eosApi.getCurrencyBalance({code: obj.msg.code,account: payload.name,symbol: obj.msg.symbol});
            if (bala.length === 0) {
              data.balance = 0;
            } else {
              data.balance = bala[0].split(` ${obj.msg.symbol}`)[0]; //Number.parseFloat(data[0].split(` ${item.symbol}`)[0])
            }
          }
          r.datas.push(data);
          r.lastId = data.id;
        }else{
          if(payload.pos != -1){
            r.lastId = tmp.account_action_seq + 1;
          }
        }
        resolve(r);
      }).catch(e => {
        Vue.prototype.$message({message: '链接口错误 ',type: 'error',center: true});
      })
    }); 
  },
  importKey({commit,state},payload){
    return new Promise((resolve, reject) => {
      let bytes = CryptoJS.AES.decrypt(payload.aesR, payload.pwd);
      let plaintext = bytes.toString(CryptoJS.enc.Utf8);
      if(plaintext != ''){
        resolve({data: plaintext,message: '导出成功',type: 'success',center: true});
      }else {
        resolve({message: '交易密码错误',type: 'error',center: true});
      }
    });
  },
  Transfer({commit,state},payload){
    //console.log(payload);
    let cb = payload[1];
    const item = payload[0];
    let r = null;
    Vue.$vux.loading.show({text: 'Loading'});
    setTimeout(() => {
      let bytes = CryptoJS.AES.decrypt(item.aesR, item.pwd);
      let plaintext = bytes.toString(CryptoJS.enc.Utf8);
      if (plaintext != ''){
        let config = {};
        if(item.hasOwnProperty('netId')){
          for(const key of state.configList){
            if(key.netId == item.netId){
              config = {
                chainId: state.configobj.chainId,
                keyProvider: plaintext,
                httpEndpoint: state.configobj.httpEndpoint,
                authorization: `${item.account}@active`
              }
              break;
            }
          }
        }else{
          config = {
            chainId: state.configobj.chainId,
            keyProvider: plaintext,
            httpEndpoint: state.configobj.httpEndpoint,
            authorization: `${item.account}@active`
          }
        }
        let eos = Eos(config);
        eos.contract(item.code).then(contract => {
          contract.transfer(item.account, item.hasOwnProperty('tr_to') ? item.tr_to : item.to, item.quantity, item.hasOwnProperty('trMemo') ? item.trMemo : item.memo).then(result => {
            Vue.$vux.loading.hide();
            if (result.processed != undefined && result.transaction_id != undefined) {
              r = {success: true, msg: '转账成功', result: result};
              cb(r);
            } else {
              r = {success: false, msg: '转账失败', result: result.error};
              cb(r);
            }
          }).catch(error => {
            Vue.$vux.loading.hide();
            r = {success: false, msg: '转账失败',result: error};
            cb(r);
          })
        }).catch(error => {
          Vue.$vux.loading.hide();
          r = {success: false, msg: '合约错误',result: error};
          cb(r);
        });
        //MMP 明天继续 
      }else{
        Vue.$vux.loading.hide();
        r = {success: false, msg: '交易密码错误'};
        cb(r);
        return
      }
    }, 500);
  },
  transaction({commit,state},payload){
    const item = payload;
    return new Promise((resolve, reject) => {
      Vue.$vux.loading.show({text: 'Loading'});
      setTimeout(() => {
        let bytes = CryptoJS.AES.decrypt(item.aesR, item.pwd);
        let plaintext = bytes.toString(CryptoJS.enc.Utf8);
        if (plaintext != ''){
          const config = {
            chainId: state.configobj.chainId,
            keyProvider: plaintext,
            httpEndpoint: state.configobj.httpEndpoint,
            authorization: `${item.account}@active`
          }
          let eos = Eos(config);
          eos.transaction(item.tr).then(res => {
            Vue.$vux.loading.hide();
            if (res.processed != undefined && res.transaction_id != undefined) {
              resolve({success: true, msg: '交易成功', result: res});
            } else {
              resolve({success: false, msg: '交易失败', result: result.error});
            }
          }).catch(error => {
            Vue.$vux.loading.hide();
            resolve({success: false, msg: '交易失败',result: error});
          });
        }else{
          Vue.$vux.loading.hide();
          resolve({success: false, msg: '交易密码错误'});
          return
        }
      }, 500);
    });
  },
  UpdateNetLink({commit,state},payload){
    const item = state.AccountList;
    for(const key of item){
      if(key.id == payload){
        commit('clearTokenList');
        commit('updateEosApi',key.netId);
      }
    }
  }
};

const mutations = {
  updateState (state, payload) {
    state.AccountList.push(payload.Account);
    //state = {...state,...payload};
    /* return {...state, ...payload} */
  },
  updateAllAccountList(state, payload){
    state.AccountList = payload;
  },
  clearTokenList(state){
    state.TokenList = [];
  },
  SetAccountId(state,payload){
    state.AccountId = payload;
  },
  updateEosApi(state,payload){
    for(let key of state.configList){
      if(key.netId == payload){
        state.eosApi = EosApi({chainId: key.chainId,httpEndpoint: key.httpEndpoint});
        /* state.eos = Eos({chainId: key.chainId,httpEndpoint: key.httpEndpoint}); */
        //state.nodeJsAddress = key.nodeJsAddress;
        state.configobj = key;
      }
    }
    //console.log(payload.httpEndpoint);
    //state.eosApi = EosApi({chainId: payload.chainId,httpEndpoint: payload.httpEndpoint});
  },
  SetTokenList(state,payload){
    state.TokenList = payload;
  },
  SetEosform(state,payload){
    state.form = {...state.form,privateKey: payload.prkey, publicKey: payload.pukey}
  },
  bool(state, { payload: field }) {
    let { [field]: bool } = state;
    state = { ...state, [field]: !bool }
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
};

export default {
  namespaced: true,
  getters,
  state,
  actions,
  mutations
}
