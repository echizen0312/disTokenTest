<template>
  <div class="paymentCode">
    <view-box ref="viewBox">
      <x-header slot="header" title="支付" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
      <div class="Content">
        <!-- <div style="padding:20px;">
          <qrcode :value="qrvalue"></qrcode>
        </div> -->
        <div class="popup1">
          <div class="qrcontent">
            <qrcode :value="qrvalue" :size="200"></qrcode>
          </div>
          <div class="qrfooter">
            <div style="font-size: 20px;font-weight: bold;color: #656565;" v-text="name"></div>
            <div style="font-size: 12px;color: #9a9a9a;" v-text="`所在链：${netName}`"></div>
          </div>
        </div>
      </div>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="payform" class="vux-1px-r" height="100%">
        <div class="pop_content">
          <x-header slot="header" :title="title" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
          <div class="req">
            <group label-width="4.5em" label-margin-right="2em" label-align="right">
              <div class="trdetail">
                <div>
                  <span style="font-weight: bold;color: #FF9900;font-size: 18px;" v-text="symbol"></span>
                  <span style="font-size:12px;color:#999999;" v-text="code"></span>
                </div>
                <div style="font-size:12px;color:#999999;" v-text="`可用余额 ${balance} ${symbol}`"></div>
              </div>
              <x-input disabled style="font-size: 25px;" v-model="form.number" type="number" :show-clear="false" placeholder="输入转账金额"></x-input>
            </group>
          </div>
          <div class="noreq">
            <group label-width="4.5em" label-margin-right="2em" label-align="right">
              <group-title slot="title" style="text-align: left;"></group-title>
              <div>
                <div style="text-align: left;padding-left: 15px;padding-top: 10px;">收款地址</div>
                <x-input disabled v-model="form.to" placeholder="输入有效的收款地址"></x-input>
              </div>
              <div>
                <div style="text-align: left;padding-left: 15px;padding-top: 10px;">付款地址</div>
                <x-input disabled placeholder="付款地址" v-model="name"><span style="font-size: 12px;" slot="right" v-text="`所在链：${netName}`"></span></x-input>
              </div>
              <div style="background: #fef3ef;">
                <div style="text-align: left;padding-left: 15px;padding-top: 10px;">备注：<span style="#888">（选填）</span></div>
                <x-input disabled v-model="form.memo" placeholder="填写您的备注"></x-input>
              </div>
            </group>
          </div>
          <div class="Buttons">
            <x-button class="createuse" @click.native="subtrans">支付</x-button>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Group,ViewBox,XHeader,Qrcode,Popup,XInput,XButton,GroupTitle } from 'vux'
//const CryptoJS = require('crypto-js')
export default {
  components: {
    Group,ViewBox,XHeader,Qrcode,Popup,XInput,XButton,GroupTitle
  },
  name: 'paymentCode',
  data () {
    return {
      id: '',
      netName: '',
      name: '',
      aesR: '',
      title: '',
      codeobj: {
        name: '',
        head: 'disToken_QR',
        type: 'pos_pay'
      },
      form: {
        to: '',
        number: '',
        memo: ''
      },
      qrvalue: '',
      Num: 120,
      STout: null,
      Interval: '',
      pos: -1,
      offset: -1,
      isRun: false,
      code: null,
      balance: '',
      symbol: null,
      payform: false,
      isFocus: false
    }
  },
  created() {
    this.id = this.$route.params.id;
    for(let key of this.AccountList){
      if(key.id == this.id){
        this.netName = key.netName;
        this.name = key.name;
        this.codeobj.name = key.name;
        this.aesR = key.aesR;
        this.qrvalue = JSON.stringify(this.codeobj);
        break;
      }
    }
    this.isRun = true;
    this.pollings();
  },
  methods: {
    pollings(){
      const that = this;
      that.$store.dispatch('EosConfig/getPayMent',{name: that.name,pos: that.pos,offset: that.offset}).then(res => {
        const datas = res.datas;
        const obj = res.obj;
        if (datas.length>0){
          const tmp = datas[0];
          try {
            if (obj.head == 'disToken_MSG' && obj.type == 'pos_pay') {
              that.code = obj.msg.code;
              that.symbol = obj.msg.symbol;
              that.balance = tmp.balance;
              if (that.code != '' && that.symbol != '' && that.isRun) {
                that.isRun = false;
                if (that.STout != null) {
                    clearInterval(that.STout);
                }
                that.title = `${that.symbol} 转账`;
                that.form.to = obj.msg.to;
                that.form.number = obj.msg.number;
                let tempMemo = `order - ${new Date().getTime()}`;
                if (obj.msg.memo != undefined && obj.msg.memo != '') {
                    tempMemo = obj.msg.memo;
                }
                that.form.memo = tempMemo;
                that.payform = true;
                //that.transferBalance()
              }
            }
          } catch (e) {
              console.log(e)
          }
        }else{
          //that.pos = that.pos > 0 ? that.pos : res.lastId+1;
          that.offset = 0;
          if(that.STout!=null){
            clearTimeout(that.STout);
          }
          that.STout = setTimeout(() => {
            this.isRun = true;
            that.pollings();
          }, 1000);
        }
        that.pos = that.pos > 0 ? res.lastId > that.pos ? res.lastId : that.pos : res.lastId+1;
          console.log(that.pos);
      });
      /* if(that.STout != ''){
        clearTimeout(that.STout);
      }that.STout = setTimeout(() => {
        that.pollings();
      }, 1000); */
    },
    subtrans(){
      const that = this;
      let reg = /^\d+(\.\d{1,4})?$/;
      let isNum = reg.test(that.form.number);
      let f = Number.parseFloat(that.form.number);
      let s = f.toFixed(4);
      if (that.name != '' && that.form.to !== '' && isNum && f > 0){
        that.$vux.confirm.prompt('交易密码', {
          title: '请输入交易密码',
          closeOnConfirm: false,
          onConfirm (pwd) {
            if(pwd == '') return;
            that.form.number = s;
            let quantity = s + ' ' + that.symbol;
            const params = {
              account: that.name,
              code: that.code,
              aesR: that.aesR,
              quantity: quantity,
              pwd: pwd,
              ...that.form
            }
            that.$store.dispatch('EosConfig/Transfer',[{...params},function(res){
              if(res.success){
                that.$vux.confirm.hide();
                that.$message({message: res.msg,type: 'success',center: true});
                that.$router.go(-1);
              }else{
                that.$message({message: res.msg,type: 'error',center: true});
              }
            }]);
          }
        })
        setTimeout(() => {
        document.getElementsByTagName('input')[0].onblur = function(){
          setTimeout(() => {
            const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
          }, 100);
        }
      },100);
      }else{
        that.$message({message: '请把信息填写完整',type: 'warning',center: true});
      }
    }
  },
  beforeDestroy(){
    if(this.STout!=null){
      clearTimeout(this.STout);
    }
    if(this.Interval!=null){
      clearInterval(this.Interval);
    }
  },
  destroyed(){
    if(this.STout!=null){
      clearTimeout(this.STout);
    }
    if(this.Interval!=null){
      clearInterval(this.Interval);
    }
  },
  computed: {
    ...mapState('EosConfig', {
      AccountList: 'AccountList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.paymentCode{
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
    padding-top:30px;
    padding-left: 20px;
    text-align: left;
    position: relative;
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
