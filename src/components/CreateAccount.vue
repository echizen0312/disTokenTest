<template>
  <div class="CreateAccount">
    <view-box ref="viewBox">
      <div class="content">
        <x-header slot="header" title="新建账户" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
        <div class="req">
          <group label-width="4.5em" label-margin-right="2em" label-align="right">
            <x-input title="账户名" v-model="form.accountname" placeholder="账户名（12位，只包含a-z和1-5）" :show-clear="false"></x-input>
            <selector ref="valueMapRef" v-model="form.netId" :value-map="['netId', 'netName']" title="目标链" placeholder="选择目标链" :options="configLists" @on-change="updateEosApi"></selector>
          </group>
        </div>
        <div class="Buttons">
          <x-button class="createuse" @click.native="Continue">继续</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import { Group,XButton,XHeader,XInput,Selector,ViewBox } from 'vux'
export default {
  components: {
    Group,XButton,XHeader,XInput,Selector,ViewBox
  },
  name: 'CreateAccount',
  data () {
    return {
      form: {
        netId: '',
        accountname: ''
      }
    }
  },
  created() {
  },
  methods: {
    /* UpdateEos(v){
      this.$store.commit('EosConfig/updateEosApi', v);
    }, */
    Continue(){
      const that = this;
      let reg = /^[a-z1-5]{12}$/
      if(!reg.test(that.form.accountname)){
        that.$message({message: '账户名格式不对',type: 'warning',center: true});
      }else if(that.form.netId == ''){
        that.$message({message: '必须选择目标链',type: 'warning',center: true});
      }else{
        that.$store.dispatch('EosConfig/getKeys',function(e){
          if(e == 'success'){
            /* that.$store.dispatch('EosConfig/createAccount',{accountName: that.form.accountname,function(e){
              console.log(e);
            }}); */
            that.$store.dispatch('EosConfig/createAccount',[{accountName: that.form.accountname},
            function(e){
              if(e){
                that.$router.push('/CopyPrKey');
              }
            }]);
          }
        });
      }
    },
    ...mapMutations({
      'updateEosApi': 'EosConfig/updateEosApi'
    })
  },
  computed: {
    ...mapState('EosConfig', {
      EosForm: 'form',
      configLists: 'configList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.CreateAccount{
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
      padding-top: 0;
    }
    .weui-cell_select{
      padding-top:10px;
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
