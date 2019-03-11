<template>
  <div class="AccountList">
    <div class="viewbox">
      <mu-appbar style="width: 100%; height: 56px; position: fixed; top: 0; text-align: center;" color="primary">
        <mu-button icon slot="left" v-show="true">
          <mu-icon value=""></mu-icon>
        </mu-button>
        <span>DisTokenTest</span>
        <mu-button icon slot="right" @click="goAdd">
            <mu-icon value="add"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 10px;" v-if="AccountList.length == 0">
        <div style="text-align: center;padding-top: 50px;">
          <h3 style="font-size: 25px;margin: 0;">欢迎</h3>
          <h3 style="margin: 0;" v-text="`使用DisTokenTest`"></h3>
          <p style="margin: 50px 0 10px 0;">您可以：</p>
        </div>
        <mu-paper class="account-item" :z-depth="3" style="padding: 12px;" @click="addClick">
          <div class="account-item-center">
            <div class="account-item-center-center" style="justify-content: center;">
              <span style="font-size: 18px;">导入账户</span>
            </div>
          </div>
        </mu-paper>
        <mu-paper class="account-item" :z-depth="3" style="padding: 12px;" @click="createClick">
            <div class="account-item-center">
                <div class="account-item-center-center" style="justify-content: center;">
                    <span style="font-size: 18px;">创建账户</span>
                </div>
            </div>
        </mu-paper>
      </div>
      <div style="padding: 10px;" v-if="AccountList.length > 0">
        <mu-paper style="padding: 10px;" class="account-item" :z-depth="3" v-for="(account, index) in AccountList" :key="account.id + '_' + index">
            <div class="account-item-head"></div>
            <div class="account-item-top">
                <div class="account-item-top-center">
                    <div class="net-logo" v-text="configLists[account.netId].netName[0]"></div>
                    <span>所在链</span><span style="color: #e65100; margin-left: 5px;" v-text="configLists[account.netId].netName"></span>
                </div>
                <div class="account-item-top-right">
                    <mu-icon value="close" color="red500"></mu-icon>
                </div>
            </div>
            <div class="account-item-center">
                <div class="account-item-center-center">
                    <span class="account-name">{{ account.name }}</span>

                </div>
                <div class="account-item-center-right">

                </div>
            </div>
        </mu-paper>
      </div>
      <mu-dialog title="导入明文私钥" width="600" max-width="80%" :esc-press-close="false"
                   :overlay-close="false" :open.sync="openAlert">
            <mu-form :model="form" label-width="80">
                <mu-form-item prop="input" label="目标链">
                    <mu-select v-model="form.netId" full-width>
                        <mu-option v-for="configObj in configList" :key="configObj.netName" :label="configObj.netName" :value="configObj.netId"></mu-option>
                    </mu-select>
                </mu-form-item>
                <mu-form-item prop="input" label="明文私钥">
                    <mu-text-field v-model="form.privateKey"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="input" label="交易密码">
                    <mu-text-field type="password" v-model="form.aesKey"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <!--<mu-button slot="actions" textColor="error" @click="closeAlertDialog">关闭-->
            <!--</mu-button>-->
            <mu-button slot="actions" textColor="primary" @click="createClick">创建账户
            </mu-button>
            <mu-button slot="actions" color="primary" @click="submitAlertDialog">确定</mu-button>
            <mu-button style="position: absolute; right: 5px; top: 5px;" icon color="red500" @click="closeAlertDialog">
                <mu-icon value="close"></mu-icon>
            </mu-button>
        </mu-dialog>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import store from '../vuex/store'
export default {
  name: 'AccountList',
  data () {
    return {
      openAlert: false,
      form: {
        netId: '',
        privateKey: '',
        aesKey: ''
      },
      configList: [
        {
          netName: 'testNet',
          netId: '001'
        }
      ]
    }
  },
  created () {
    let sb = JSON.parse(window.localStorage.getItem('eos'));
    if(this.AccountList.length ==0 && sb.hasOwnProperty('EosConfig')){
      store.commit('EosConfig/updateState', {'Account': sb.EosConfig.AccountList});
    }
  },
  methods: {
    goAdd(){
    },
    addClick(){
      this.openAlert = true;
      this.form = {...this.form,netId: '',privateKey: '',aesKey: ''};
    },
    createClick(){},
    closeAlertDialog() {
      this.openAlert = false;
    },
    submitAlertDialog() {
      const that = this;
      if (that.form.netId != '' && that.form.privateKey != '' && that.form.aesKey != ''){
        store.dispatch('EosConfig/ImportAccount', that.form);
        that.$nextTick(() => {
          that.openAlert = false;
        })
      }
    }
  },
  computed: {
    ...mapState('EosConfig', {
      configLists: 'configList',
      userInfo: 'userInfo',
      AccountList: 'AccountList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.AccountList{
  height: 100%;
  .account-item {
        margin-bottom: 10px;
        padding: 14px 8px 8px 12px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        position: relative;
    }

    .account-item-head {
        width: 100%;
        height: 5px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .account-item-top {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .account-item-top-center {
        flex: 1;
        height: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
    }

    .account-item-top-right {
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .account-item-center {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .account-item-center-center {
        flex: 1;
        height: 62px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .account-item-center-right {
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .account-name {
        font-size: 32px;
        font-weight: 300;
        letter-spacing: 4px;
    }
}
</style>
