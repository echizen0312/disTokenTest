<template>
  <div class="RequestTransfer">
    <view-box ref="viewBox">
      <div class="content">
        <x-header slot="header" :title="title" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
        <div class="req">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <div class="trdetail">
              <div>
                <span style="font-weight: bold;color: #FF9900;font-size: 18px;" v-text="symbol"></span>
                <span style="font-size:12px;color:#999999;" v-text="code"></span>
              </div>
              <!-- <div style="font-size:12px;color:#999999;" v-text="`可用余额 ${balance} ${symbol}`"></div> -->
            </div>
            <x-input disabled ref="fuckwxa" @on-blur="fuckWchart(1)" style="font-size: 25px;" v-model="form.number" type="number" :show-clear="false" placeholder="输入转账金额"></x-input>
          </group>
        </div>
        <div class="noreq">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <group-title slot="title" style="text-align: left;"></group-title>
            <div>
              <div style="text-align: left;padding-left: 15px;padding-top: 10px;">收款地址</div>
              <x-input disabled ref="fuckwxb" @on-blur="fuckWchart(1)" v-model="form.to" placeholder="输入有效的收款地址"></x-input>
            </div>
            <div class="rese">
              <group label-width="4.5em" label-margin-right="2em" label-align="right">
                <selector ref="valueMapRef" v-model="id" :value-map="['id', 'name']" title="付款地址" placeholder="选择付款地址" :options="accList" @on-change="getAesName"></selector>
              </group>
            </div>
            <div style="background: #fef3ef;">
              <div style="text-align: left;padding-left: 15px;padding-top: 10px;">备注：<span style="#888">（选填）</span></div>
              <x-input disabled ref="fuckwxc" @on-blur="fuckWchart(1)" v-model="form.memo" placeholder="填写您的备注"></x-input>
            </div>
          </group>
        </div>
        <div class="Buttons">
          <x-button class="createuse" @click.native="subtrans">提交</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Group, XTextarea,XButton,XHeader,XInput,Selector,GroupTitle,ViewBox } from 'vux'
export default {
  components: {
    Group,XTextarea,XButton,XHeader,XInput,Selector,GroupTitle,ViewBox
  },
  name: 'RequestTransfer',
  data () {
    return {
      netId: '',
      id: null,
      code: null,
      symbol: null,
      balance: null,
      account: null,
      NetName: '',
      aesR: '',
      title: '',
      form: {
        to: '',
        number: '',
        memo: ''
      },
      accList: [],
      isFocus: false
      /* isTring: false */
    }
  },
  created() {
    ///:netId/:code/:symbol/:to/:number/:memo
    this.netId = this.$route.params.netId;
    this.code = this.$route.params.code;
    this.symbol = this.$route.params.symbol;
    this.title = `${this.$route.params.symbol} 转账`;
    this.form = {...this.form,to: this.$route.params.to, number: this.$route.params.number,memo: this.$route.params.memo};
    //this.balance = this.$route.params.balance;
    for(let key of this.configList){
      if(key.netId == this.netId){
        this.NetName = key.netName;
      }
    }
    for(let key of this.AccountList){
      if(key.netId == this.netId){
        this.accList.push(key);
      }
    }
  },
  methods: {
    getAesName(v){
      if(v == null) return;
      for(const key of this.AccountList){
        if(key.id == v){
          this.aesR = key.aesR;
          this.account = key.name;
        }
      }
    },
    fuckWchart(){
      const that =this;
      setTimeout(() => {
        if(that.$refs.fuckwxa.isFocus || that.$refs.fuckwxb.isFocus || that.$refs.fuckwxc.isFocus) return;
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    },
    subtrans(){
      const that = this;
      let reg = /^\d+(\.\d{1,4})?$/;
      let isNum = reg.test(that.form.number);
      let f = Number.parseFloat(that.form.number);
      let s = f.toFixed(4);
      if (that.id != null && that.form.to !== '' && isNum && f > 0/*  && !that.isTring */){
        that.$vux.confirm.prompt('交易密码', {
          title: '请输入交易密码',
          closeOnConfirm: false,
          onConfirm (pwd) {
            if(pwd == '') return;
            that.form.number = s;
            let quantity = s + ' ' + that.symbol;
            const params = {
              account: that.account,
              code: that.code,
              aesR: that.aesR,
              quantity: quantity,
              pwd: pwd,
              ...that.form,
              netId: that.netId
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
  computed: {
    ...mapState('EosConfig', {
      configList: 'configList',
      AccountList: 'AccountList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.RequestTransfer{
  background-color:#f7f7f7; 
  height: 100%;
  .weui-cells{
    padding-top:10px;
    margin-top:0;
  }
  .req{
    margin-top: 46px;
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
  .rese{
    .weui-cell{
      display: block !important;
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
</style>
