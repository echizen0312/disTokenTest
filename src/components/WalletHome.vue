<template>
  <div class="WalletHome">
    <div class="kccontainer">
      <div class="headers">
        <div class="title">
          <div style="line-height: 1.2;">
            <div>
              <span style="font-size: 25px;color: #FFFFFF;" v-text="name"></span>
              <a href="javascript:" @click="copyaccount">
                <i class="copyicon"></i>
                <span style="color:#62cdf9;font-size:12px;">复制</span>
              </a>
            </div>
            <div style="font-size: 12px;color: #FFFFFF;" v-text="`所在链：${netName}`"></div>
          </div>
          <div>
            <a class="pkey" @click="Getpk" href="javascript:"></a>
            <a class="w_refresh" @click="HomeList" href="javascript:"></a>
          </div>
        </div>
        <div class="Bt_group">
          <a @click="GoPage('paymentCode')" href="javascript:">
            <span class="pay"></span>
            <span>支付</span>
          </a>
          <a @click="GoPage('selectAccount')" href="javascript:">
            <span class="Payee"></span>
            <span>收款</span>
          </a>
          <a @click="GotransferList" href="javascript:">
            <span class="bill"></span>
            <span>账单</span>
          </a>
        </div>
      </div>
      <div class="content_list" :style="{ height: height + 'px' }" style="width: 100%;position: absolute;overflow: auto;-webkit-overflow-scrolling: touch;padding-bottom:60px;">
        <div class="Content">
          <div v-for="(item,index) in TokenList" :key="index" class="c_card" @click="Gocoin(item)">
            <div>
              <span class="c_card_sa" v-text="item.symbol"></span>
              <span class="c_card_sb" v-text="`${item.code}`"></span>
            </div>
            <div>
              <span v-text="item.balance" style="color: #333333;font-size: 20px;"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Observable } from 'rxjs';
import { Group,ViewBox,XHeader,XButton,Popup } from 'vux'
export default {
  components: {
    Group,ViewBox,XHeader,XButton,Popup
  },
  name: 'WalletHome',
  data () {
    return {
      height: `${document.body.scrollHeight - 150}`,
      id: '',
      netName: '',
      name: '',
      aesR: '',
      privateKey: '',
      pops: true
    }
  },
  created() {
    this.id = this.$route.params.id;
    for(let key of this.AccountList){
      if(key.id == this.id){
        this.netName = key.netName;
        this.name = key.name;
        this.aesR = key.aesR;
        this.$store.dispatch('EosConfig/getTokenList',key.name);
      }
    }
  },
  methods: {
    Gocoin(item){
      this.$router.push(`/Coindetails/${this.id}/${item.code}/${item.symbol}/${item.balance}`);
    },
    HomeList(){
      this.$store.commit('EosConfig/SetAccountId', '');
      this.$router.push(`/HomeList`);
    },
    GotransferList(item){
      this.$router.push(`/AllTransferList/${this.id}`);
    },
    copyaccount(){
      const _this = this;
      _this.$copyText(_this.name).then(function () {
        _this.$message({message: '复制成功',type: 'success',center: true});
      }, function () {
        _this.$message({message: '复制失败',type: 'error',center: true});
      })
    },
    Getpk(){
      const _this = this;
      this.$vux.confirm.prompt('交易密码', {
        title: '请输入交易密码',
        closeOnConfirm: false,
        onConfirm (pwd) {
          if(pwd == '') return;
          _this.$store.dispatch('EosConfig/importKey',{aesR: _this.aesR, pwd: pwd}).then(res => {
            if(res.type == 'success'){
              _this.$copyText(res.data).then(function () {
                _this.$vux.confirm.hide();
                _this.$message({message: '成功导出私钥到剪贴板',type: 'success',center: true});
              }, function () {
               _this.$message({message: '导出失败',type: 'error',center: true});
              })
            }else{
              _this.$message(res);
            }
          });
        }
      })
      setTimeout(() => {
        const node = document.querySelector('input');
        const ins = new Observable.fromEvent(node, 'blur');
        ins.subscribe(e => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
          window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        });
        /* document.getElementsByTagName('input')[0].onblur = function(){
          setTimeout(() => {
            const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
          }, 100);
        } */
      },100);
    },
    GoPage(address){
      this.$router.push(`/${address}/${this.id}`);
    }
  },
  mounted() {},
  computed: {
    ...mapState('EosConfig', {
      AccountList: 'AccountList',
      TokenList: 'TokenList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.WalletHome{
  background-color:#f7f7f7; 
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>

<style lang='less' scoped>
.kccontainer{
  .headers{
    background:url(../../static/bg_01.png) no-repeat;
    background-size: 100% 100%;
    height: 150px;
    padding:10px;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      .copyicon{
        background:url(../../static/ico_01.png) no-repeat;
        display: inline-block;
        background-size: contain;
        width: 15px;
        height: 15px;
        vertical-align: middle;
      }
      .pubclass{
        background-size: contain;
        display: inline-block;
        width: 18px;
        height: 18px;
        padding-right:25px;
      }
      .pkey{
        background:url(../../static/ico_02.png) no-repeat;
        .pubclass
      }
      .w_refresh{
        background:url(../../static/ico_03.png) no-repeat;
        .pubclass
      }
    }
    .Bt_group{
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 20px;
      a{
        color:#F7F7F7;
        font-size: 12px;
        letter-spacing: 2px;
      }
      .Bt_icon{
        background-size: 100% 100%;
        display: block;
        width: 50px;
        height: 50px;
      }
      .pay{
        background:url(../../static/ico_05.png) no-repeat;
        .Bt_icon
      }
      .Payee{
        background:url(../../static/ico_06.png) no-repeat;
        .Bt_icon
      }
      .bill{
        background:url(../../static/ico_07.png) no-repeat;
        .Bt_icon
      }
    }
  }
  .Content{
    .c_card{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px;
      padding: 10px;
      background: #fff;
      border-radius: 8px;
      text-align: left;
      font-family: sans-serif;
      .c_card_sa{
        display:block;
        font-size: 20px;
        font-weight: bold;
        color: #FF9900;
      }
      .c_card_sb{
        display:block;
        font-size: 13px;
        color: #999999;
      }
      .delIcon{
        background:url(../../static/ico_14.png) no-repeat;
        background-size: contain;
        display: block;
        width: 20px;
        height: 20px;
        padding-right: 30px;
      }
    }
  }
}
</style>
