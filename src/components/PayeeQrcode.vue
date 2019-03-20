<template>
  <div class="PayeeQrcode">
    <view-box ref="viewBox">
      <x-header slot="header" title="收款" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
      <div class="Content">
        <!-- <div style="padding:20px;">
          <qrcode :value="qrvalue"></qrcode>
        </div> -->
        <div class="popup1">
          <div class="qrcontent">
            <qrcode :value="qrvalue" :size="200"></qrcode>
          </div>
          <div class="qrfooter">
            <div>
              <div style="font-size: 20px;font-weight: bold;color: #656565;" v-text="name"></div>
              <div style="font-size: 12px;color: #9a9a9a;" v-text="`所在链：${netName}`"></div>
            </div>
            <div style="text-align:right;">
              <div style="font-size: 20px;font-weight: bold;color: #fe9900;" v-text="symbol"></div>
              <div style="font-size: 12px;color: #9a9a9a;" v-text="`${code}`"></div>
            </div>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Group,ViewBox,XHeader,Qrcode } from 'vux'
//const CryptoJS = require('crypto-js')
export default {
  components: {
    Group,ViewBox,XHeader,Qrcode
  },
  name: 'PayeeQrcode',
  data () {
    return {
      id: '',
      netName: '',
      name: '',
      aesR: '',
      title: '',
      qrvalue: '123123123',
      code: null,
      symbol: null,
      payform: false,
      payeeobj: null
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.symbol = this.$route.params.symbol;
    this.code = this.$route.params.code;
    for(let key of this.AccountList){
      if(key.id == this.id){
        this.netName = key.netName;
        this.name = key.name;
        this.aesR = key.aesR;
        this.payeeobj = {
          name: key.name,
          symbol: this.symbol,
          code: this.code,
          chain: key.netName,
          head: 'disToken_QR',
          type: 'phone_pay'
        }
        this.qrvalue = JSON.stringify(this.payeeobj);
        break;
      }
    }
  },
  methods: {},
  computed: {
    ...mapState('EosConfig', {
      AccountList: 'AccountList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.PayeeQrcode{
  background-color:#05a8f5; 
  height: 100%;
  position: relative;
}
.pop_content{
  .weui-cells{
    margin-top:0 !important;
  }
  .req{
    padding-top: 46px;
    .weui-cell{
      display: block !important;
      &:before {
        content:normal;
      }
    }
    .trdetail{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    }
  }
  .noreq{
    .weui-cells{
      padding-top:0;
      margin-top:0;
    }
    .weui-cell{
      &:before {
        content:normal;
      }
      &:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        left: 15px;
      }
    }
    .weui-cells:before{
      content: none;
    }
  }
  .weui-label{
    text-align: left !important;
  }
  .vux-popup-picker-select{
    text-align: left !important;
  }
  .weui-cell__bd{
    position: relative;
    &:after {
      height: 13px !important;
      width: 13px !important;
      border-width: 0 2px 2px 0 !important;
      margin-top: -6px !important;
    }
  }
}
</style>

<style lang='less' scoped>
.pop_content{
  position: relative;
  height: 100%;
  .Buttons{
    padding: 0 35px;
    position: absolute;
    width: 100%;
    bottom: 60px;
    .createuse{
      color: #FFFFFF;
      background-color: #14d6a4;
    }
    button{
      margin-top: 20px;
      height: 45px;
      letter-spacing: 2px;
    }
  }
}
.Content{
  padding-top:46px;
}
.popup1{
  height: 330px;
  background: #fff;
  margin:20px;
  border-radius: 5px;
  .qrfooter{
    padding: 30px 15px 0 15px;
    text-align: left;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 28px;
      right: 0;
      height: 1px;
      border-top: 1px solid #d8d4d4;
      color: #d8d4d4;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      left: 10px;
      right:10px;
    }
  }
}
.qrcontent{
  width: 320px;
  padding-top: 40px;
  position: relative;
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
