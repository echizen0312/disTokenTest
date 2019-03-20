<template>
  <div class="ImportAccount">
    <view-box ref="viewBox">
      <div class="content">
        <x-header slot="header" title="导入账户" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
        <div class="req">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <selector ref="valueMapRef" v-model="form.netId" :value-map="['netId', 'netName']" title="目标链" placeholder="选择目标链" :options="configLists" @on-change="updateEosApi"></selector>
            <x-textarea ref="fuckwxa" @on-blur="fuckWchart(1)" title="私钥地址" v-model="form.privateKey" name="description" placeholder='输入明文私钥'></x-textarea>
            <!--<group-title slot="title">目标链</group-title>-->
            <!-- <x-input title="设置密码" placeholder="请设置您的密码" v-model="value1"></x-input> -->
          </group>
        </div>
        <div class="noreq">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <group-title slot="title" style="text-align: left;">设置密码</group-title>
            <x-input ref="fuckwxb" @on-blur="fuckWchart(1)" title="设置密码" v-model="form.aesKey" placeholder="请设置您的密码"></x-input>
            <x-input ref="fuckwxc" @on-blur="fuckWchart(1)" title="确认密码" v-model="form.confirmaesKey" placeholder="重复输入密码"></x-input>
            <x-input ref="fuckwxd" @on-blur="fuckWchart(1)" title="提示信息" v-model="form.Remarks" placeholder="（选填）"></x-input>
          </group>
          <!-- <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <x-input title="提示信息" placeholder="（选填）"></x-input>
          </group> -->
        </div>
        <div class="Buttons">
          <x-button class="createuse" @click.native="OpenImport">开始导入</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import { Group, XTextarea,XButton,XHeader,XInput,Selector,GroupTitle,ViewBox } from 'vux'
export default {
  components: {
    Group,XTextarea,XButton,XHeader,XInput,Selector,GroupTitle,ViewBox
  },
  name: 'ImportAccount',
  data () {
    return {
      'isFocus': false,
      form: {
        netId: '',
        privateKey: '',
        aesKey: '',
        confirmaesKey: '',
        Remarks: ''
      }
    }
  },
  created() {
    //console.log(this.configLists);
  },
  methods: {
    fuckWchart(){
      const that =this;
      setTimeout(() => {
        if(that.$refs.fuckwxa.isFocus || that.$refs.fuckwxb.isFocus || that.$refs.fuckwxc.isFocus || that.$refs.fuckwxd.isFocus) return;
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 100);
    },
    /* UpdateEos(v){
      this.$store.commit('EosConfig/updateEosApi', v);
    }, */
    OpenImport(){
      const that = this;
      if(that.form.netId != '' && that.form.privateKey != '' && that.form.aesKey != '' && that.form.confirmaesKey != ''){
        if(that.form.aesKey != that.form.confirmaesKey){
          that.$message({message: '两次密码不一致',type: 'warning',center: true});
          return;
        }
        //this.$store.dispatch('EosConfig/ImportAccount', that.form);
        this.$store.dispatch('EosConfig/ImportAccount', [that.form,
          function(e){
            if(e){
              that.$router.push('/HomeList');
            }
          }
        ]);
      }else{
        that.$message({message: '必填项不能为空',type: 'warning',center: true});
        //&& that.aesKey == that.confirmaesKey
      }
    },
    ...mapMutations({
      'updateEosApi': 'EosConfig/updateEosApi'
    })
  },
  computed: {
    ...mapState('EosConfig', {
      configLists: 'configList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.ImportAccount{
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
    }
  }
  .noreq{
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
