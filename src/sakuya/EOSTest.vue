<template>
  <div style="margin: 0; padding: 10px;">
    <mu-button class="sak-button" slot="actions" @click="getInfo">获取链信息</mu-button>
    <mu-button class="sak-button" slot="actions" @click="getAccount">获取账户信息</mu-button>
    <mu-button class="sak-button" slot="actions" @click="getCurrencyStats">获取余额</mu-button>
    <mu-button class="sak-button" slot="actions" @click="getActions">获取交易记录</mu-button>
    <mu-button class="sak-button" slot="actions" @click="transaction">发起交易</mu-button>
    <mu-button class="sak-button" slot="actions" @click="importAccount">导入账号</mu-button>
  </div>
</template>

<script>
  let Eos = require('eosjs') // 引入读写EOS
  let EosApi = require('eosjs-api') // 引入只读EOS
  let chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' // 链ID
  let httpEndpoint = 'http://10.255.1.225:8888' // 链接口地址
  let eosApi = EosApi({
    chainId: chainId,
    httpEndpoint: httpEndpoint
  }) // 实例化只读接口对象
  export default {
    name: 'EOSTest',
    data () {
      return {}
    },
    created () {

    },
    methods: {
      getInfo () {
        eosApi.getInfo({}).then(r => {
          console.log(r)
        }).catch(e => {
          console.log(e)
        })
      },
      getAccount () {
        let acc = 'zj'
        eosApi.getAccount(acc).then(r => {
          console.log(r)
        }).catch(e => {
          console.log(e)
        })
      },
      getCurrencyStats () {
        let code = 'eosio.token'
        let account = 'zj'
        let symbol = 'TOK'
        eosApi.getCurrencyBalance(code, account, symbol).then(r => {
          console.log(r)
        }).catch(e => {
          console.log(e)
        })
      },
      getActions () {
        let account = 'zj'
        let pos = -1
        let offset = -10
        eosApi.getActions(account, pos, offset).then(r => {
          console.log(r)
        }).catch(e => {
          console.log(e)
        })
      },
      transaction () {
        let pk = '5JzHPSPmLSaZR7Xna7WqQkouZw5Hoq2BSR7kW2JgLgn6AruZgSU' // 签名私钥
        let eos = Eos({
          chainId: chainId,
          httpEndpoint: httpEndpoint,
          keyProvider: pk
        }) // 实例读写接口对象
        let tr = {
          actions: [
            {
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: 'zj',
                permission: 'active'
              }],
              data: {
                from: 'zj',
                to: 'sakuya',
                quantity: '0.0001 TOK',
                memo: 'hahaha'
              }
            }
          ]
        }
        eos.transaction(tr).then(r => {
          console.log(r)
        }).catch(e => {
          console.log(e)
        })
      },
      importAccount () {
        console.log(1)
      }
    }
  }
</script>

<style scoped>
  .sak-button {
    float: left;
    width: 120px;
    margin: 0 8px 8px 0;
  }
</style>
