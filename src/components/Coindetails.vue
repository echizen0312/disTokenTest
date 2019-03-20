<template>
  <div class="Coindetails">
    <x-header class="Coin_hd" slot="header" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #F2F2F2;"></x-header>
    <div class="kccontainer">
      <div class="headers">
        <div class="title">
          <div style="line-height: 1.2;">
            <div>
              <span style="font-size: 25px;color: #FFFFFF;" v-text="symbol"></span>
            </div>
            <div style="font-size: 12px;color: #83D9FA;" v-text="code"></div>
          </div>
          <div>
            <span style="font-size: 25px;color: #FFFFFF;" v-text="balance"></span>
          </div>
        </div>
        <div class="Bt_group">
          <a href="javascript:" @click="Gotransfer('Transfer')" style="padding-right: 20px;">
            <span>转账</span>
          </a>
          <a class="dr" v-show="netName == 'NatureToken' || netName == 'MainNet'" href="javascript:" @click="Gotransfer('Crosslinktransfer')" style="padding-left: 20px;">
            <span>跨链转账</span>
          </a>
        </div>
      </div>
      <div class="content_list" :style="{ height: height + 'px' }" style="width: 100%;position: absolute;overflow: auto;-webkit-overflow-scrolling: touch;">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" style="padding-bottom: 100px;">
          <div class="Content">
            <div class="c_title">转账记录</div>
            <div class="cell_content" v-for="(item,index) in tranList" :key="index" @click="trsDetail(item)">
              <div style="text-align:left;">
                <div style="font-weight: bold;font-size: 15px;color:#656565;" v-text="`${item.type == 'in'?item.data.from:item.data.to}`"></div>
                <div style="color:#999999;font-size:12px;" v-text="item.time"></div>
              </div>
              <div style="text-align:right;font-size: 15px;">
                <div>
                  <span v-bind:style="{ color: item.type == 'in'?'#2c3e50':'#FD4A4A' }" v-text="`${item.type == 'in' ? '+ '+item.data.quantity.split(' ')[0] : '- '+item.data.quantity.split(' ')[0]}`"></span>
                  <span style="color:#FF9900;font-weight: bold;" v-text="item.data.quantity.split(' ')[1]"></span>
                </div>
              </div>
            </div>
          </div>
          <load-more :show-loading="shload" :tip="!shload ? '没有更多数据了':''" background-color="#fbf9fe"></load-more>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showdetail" class="dialog-demo">
        <div class="popup1">
          <group>
            <div class="popup_header" style="background:#05a8f5;">转账详情</div>
            <div style="padding: 10px;position: absolute;top: 0;right: 0;color: #fff;" @click="showdetail=false">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </div>
            <div class="diatrs">
              <div style="font-size: 24px;padding: 15px 0;">
                <span style="color:#343434;" v-bind:style="{ color: detail.type == 'in'?'#2c3e50':'#FD4A4A' }" v-text="`${detail.type == 'in' ? '+'+ detail.data.quantity.split(' ')[0] : '-'+detail.data.quantity.split(' ')[0]}`"></span>
                <span style="color:#FE9900;font-weight: bold;" v-text="detail.data.quantity.split(' ')[1]"></span>
              </div>
              <div class="diatrs_cell">
                <span class="ce_title">TRX_ID</span>
                <a class="ce_sp ce_a" v-text="detail.trx_id" @click="GoLink(detail.trx_id)"></a>
              </div>
              <div class="diatrs_cell">
                <span class="ce_title">接收方</span>
                <span class="ce_sp" v-text="detail.data.to"></span>
              </div>
              <div class="diatrs_cell">
                <span class="ce_title">发送方</span>
                <span class="ce_sp" v-text="detail.data.from"></span>
              </div>
              <div class="diatrs_cell">
                <span class="ce_title">交易时间</span>
                <span class="ce_sp sp_time" v-text="detail.time"></span>
              </div>
              <div class="diatrs_cell">
                <span class="sp_time">备注</span>
                <span class="ce_sp sp_time" style="max-width: 200px;text-align: left;" v-text="detail.data.memo"></span>
              </div>
            </div>
          </group>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Group,ViewBox,XHeader,XButton,Cell,XDialog,LoadMore } from 'vux'
export default {
  components: {
    Group,ViewBox,XHeader,XButton,Cell,XDialog,LoadMore
  },
  name: 'Coindetails',
  data () {
    return {
      height: `${document.body.scrollHeight - 150}`,
      id: '',
      code: '',
      symbol: '',
      balance: '',
      showdetail: false,
      detail: {
        account: '',
        trx_id: '',
        name: '',
        seq: '',
        time: '',
        type: '',
        data: {
          to: '',
          from: '',
          quantity: '',
          memo: ''
        }
      },
      tranList: [],
      cp: -1,
      ps: -15,
      busy: false,
      Isload: true,
      shload: true,
      tname: '',
      netName: ''
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.code = this.$route.params.code;
    this.symbol = this.$route.params.symbol;
    this.balance = this.$route.params.balance;
    for(let key of this.AccountList){
      if(key.id == this.id){
        this.tname = key.name;
        this.netName = key.netName;
        /* this.$store.dispatch('EosConfig/getTransferList',{name: key.name, code: this.code,symbol: this.symbol}).then(res => {
          this.tranList = res;
        }); */
      }
    }
  },
  methods: {
    Gotransfer(address){
      this.$router.push(`/${address}/${this.id}/${this.code}/${this.symbol}/${this.balance}`);
    },
    trsDetail(item){
      this.detail = item;
      this.showdetail = true;
    },
    GoLink(link){
      const that = this;
      if(that.netName == 'testNet'){
        window.open(`http://10.255.1.225:3000/disTokenTracker/#/Transaction/${link}`);
      }else if(that.netName == 'NatureToken'){
        window.open(`http://tracker.distoken.io/tracker/#/Transaction/${link}`);
      }else if(that.netName == 'HpNet'){
        window.open(`http://hp.distoken.io/hp/#/Transaction/${link}`);
      }else if(that.netName == 'MainNet'){
        window.open(`https://eospark.com/MainNet/tx/${link}`);
      }
    },
    GetTransList(){
      const that = this;
      this.$store.dispatch('EosConfig/getAllTransferList',{name: this.tname,code: this.code,symbol: this.symbol,cp: this.cp,ps: this.ps}).then(res => {
        that.busy = false;
        if(!res.IsAll || res.arr.length == 0){
          that.Isload = false;
          that.shload = false;
        }else{
          that.cp = res.cp -1;//加上分页页码
        }
        this.tranList = that.tranList.concat(res.arr);
        //Math.abs
      });
    },
    loadMore() {
      const that = this;
      that.busy = true;
      if(that.Isload){
        that.busy = true;
        that.GetTransList();
      }
    }
  },
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
.Coindetails{
  background-color:#FFFFFF; 
  height: 100%;
  position: relative;
  overflow: hidden;
  .Coin_hd{
    .vux-header-back{
      color:#919191 !important;
    }
    .left-arrow:before {
      border: 1px solid #716e6e !important;
      border-width: 1px 0 0 1px !important;
    }
  }
}
.popup1{
  .vux-no-group-title{
    margin-top:0 !important;
    color: #8b8b8b;
  }
  .weui-cells:before{
    content: none;
  }
}
</style>

<style lang='less' scoped>
.kccontainer{
  padding-top: 1px;
  background: #F2F2F2;
  height: 122px;
  .headers{
    background:url(../../static/bg_01.png) no-repeat;
    background-size: 100% 100%;
    height: 150px;
    padding:10px;
    margin: 47px 10px 0 10px;
    border-radius: 7px; 
    position: relative;
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
      justify-content: flex-start;
      align-items: center;
      margin-top: 20px;
      position: absolute;
      bottom: 20px;
      left: 20px;
      a{
        color:#F7F7F7;
        font-size: 15px;
        letter-spacing: 1px;
        
      }
      .dr{
        &:after {
          content: "";
          position: absolute;
          background:#ccc;
          width: 1px;
          height: 12px;
          top: 6px;
          left: 50px;
        }
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
    .c_title{
      position: relative;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      &:after{
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #E7E7E7;
        color: #E7E7E7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        left: 15px;
      }
    }
    .cell_content{
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      &:after{
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #E7E7E7;
        color: #E7E7E7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        left: 15px;
      }
    }
  }
}
.popup1{
  .popup_header{
    height: 50px;
    line-height:50px;
    text-align: center;
    background:#1580de;
    color:#fff;
    position: relative;
    a{
      color: #fff;
      text-decoration: none;
      position: absolute;
      right: 1em;
    }
  }
  .diatrs{
    margin-bottom: 60px;
    .diatrs_cell{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 10px 10px;
      &:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #E7E7E7;
        color: #E7E7E7;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        left: 10px;
        right:10px;
      }
      .ce_title{
        color:#343434;
      }
      .ce_sp{
        font-size:13px;
        .ce_title
      }
      .sp_time{
        color: #8b8a8a;
        word-wrap: break-word;
        word-break: normal;
      }
      .ce_a{
        color: #1678f6;
        text-decoration: underline;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
