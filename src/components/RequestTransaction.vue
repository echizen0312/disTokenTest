<template>
  <div class="RequestTransaction">
    <view-box ref="viewBox">
      <div class="content">
        <x-header slot="header" title="请求交易" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
        <div class="noreq">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <group-title slot="title" style="text-align: left;"></group-title>
            <div>
              <div style="text-align: left;padding-left: 15px;padding-top: 10px;">目标链</div>
              <x-input disabled ref="fuckwxb" @on-blur="fuckWchart(1)" v-model="NetName" placeholder="输入有效的收款地址"></x-input>
            </div>
            <div>
              <div style="text-align: left;padding-left: 15px;padding-top: 10px;">签名账户</div>
              <x-input disabled placeholder="付款地址" v-model="accName"></x-input>
            </div>
          </group>
        </div>
        <div class="ShowDetail">
          <x-button class="Showdt" @click.native="showjson = true">点击显示交易体</x-button>
        </div>
        <div class="Buttons">
          <x-button class="createuse" @click.native="subtrans">提交</x-button>
        </div>
      </div>
    </view-box>
    <div v-transfer-dom>
      <popup v-model="showjson">
        <popup-header
        right-text="关闭"
        title="交易体"
        :show-bottom-border="false"
        @on-click-right="showjson = false"></popup-header>
        <div class="popup0" style="background-color: #FFFFFF;">
          <pre class="jpre" v-html="tr"></pre>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { fromEvent } from 'rxjs';
import { Group,XButton,XHeader,XInput,GroupTitle,ViewBox,Popup,PopupHeader } from 'vux'
export default {
  components: {
    Group,XButton,XHeader,XInput,GroupTitle,ViewBox,Popup,PopupHeader
  },
  name: 'RequestTransaction',
  data () {
    return {
      id: null,
      account: null,
      NetName: '',
      aesR: '',
      title: '',
      form: {
        to: '',
        number: '',
        memo: ''
      },
      isFocus: false,
      netId: '',
      accName: '',
      tr: '',
      c: '',
      showjson: false
      /* isTring: false */
    }
  },
  created() {
    this.netId = this.$route.params.netId;
    this.accName = this.$route.params.accName;
    this.c = JSON.parse(this.$route.params.tr);
    if(this.netId == '' || this.accName == '' || this.c == ''){
      this.$message({message: '参数错误',type: 'error',center: true});
      setTimeout(() => {
        history.back();
      }, 2000);
    }
    let d = JSON.stringify(this.c, null, 4);
    this.tr = d.replace(/\n/g, '<br>').replace(/\s/g, ' ');
    for(let key of this.AccountList){
      if(key.netId == this.netId && key.id == this.AccountId){
        this.NetName = key.netName;
        this.aesR = key.aesR;
      }
    }
  },
  methods: {
    fuckWchart(){
      const that =this;
      setTimeout(() => {
        if(that.$refs.fuckwxb.isFocus || that.$refs.fuckwxc.isFocus) return;
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    },
    subtrans(){
      const that = this;
      that.$vux.confirm.prompt('交易密码', {
        title: '请输入交易密码',
        closeOnConfirm: false,
        onConfirm (pwd) {
          if(pwd == '') return;
          const parmas = {
            netId: that.netId,
            account: that.accName,
            pwd: pwd,
            aesR: that.aesR,
            tr: that.c
          }
          that.$store.dispatch('EosConfig/transaction',parmas).then(res => {
            if(res.success){
              that.$vux.confirm.hide();
              that.$vux.alert.show({
                content: '交易成功，将跳转回原页面',
                onHide () {
                  history.back();
                }
              });
            }else{
              that.$message({message: res.msg,type: 'error',center: true});
            }
          });
        }
      })
      setTimeout(() => {
        const node = document.querySelector('input');
        const ins = fromEvent(node, 'blur');
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
    }
  },
  computed: {
    ...mapState('EosConfig', {
      AccountList: 'AccountList',
      AccountId: 'AccountId'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.RequestTransaction{
  background-color:#f7f7f7; 
  height: 100%;
  .weui-cells{
    padding-top:10px;
    margin-top:0;
  }
  .noreq{
    margin-top: 46px;
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
.ShowDetail{
  padding: 0 35px;
  .Showdt{
    color: #FFFFFF;
    background-color: #90a4ae;
  }
  button{
    margin-top: 20px;
    height: 45px;
    letter-spacing: 2px;
  }
}
.jpre{
  padding: 15px;
  resize: none;
  color: #4b4a4a;
  font-size: 14px;
  min-height: 72px;
  max-height: 450px;
}
</style>
