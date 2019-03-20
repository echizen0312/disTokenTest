<template>
  <div class="CopyPrKey">
    <view-box ref="viewBox">
      <x-header slot="header" title="导入账户" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
      <div class="content">
        <group>
          <div style="margin: 20px;word-break: break-all;text-align: right;">
            <div style="margin-bottom: 5px;text-align: left;">私钥</div>
            <div style="color:#c7c7c7;font-size: 16px;text-align: left;letter-spacing: 2px;line-height: 1.5;" v-text="form.privateKey"></div>
            <input style="position: absolute;top: -9999px;left: -9999px;" id="ewalletAddress" class="share_urltext_android" v-model="form.privateKey" />
            <button class='wa' @click='copyewalletAddress' data-clipboard-target="#ewalletAddress"></button>
          </div>
        </group>
        <div style="padding: 40px;color: #cecece;font-size: 14px;">
          请谨慎保存私钥，避免在不安全的联机环境下暴露私钥，丢失后将无法找回
        </div>
        <div class="Buttons">
          <x-button class="createuse" @click.native="Continue">完成并导入账户</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Group,XButton,XHeader,ViewBox } from 'vux'
import Clipboard from 'clipboard'
export default {
  components: {
    Group,XButton,XHeader,ViewBox
  },
  name: 'CopyPrKey',
  data () {
    return {
      /* privateKey: '5JFrtRG6vJeSysbsiseYG4mSdDbQPMhCg2bSuP4KJuezxssRSCh' */
    }
  },
  created() {
  },
  methods: {
    copyewalletAddress(){
      const that = this;
      let clipboard = new Clipboard('.wa')
      clipboard.on('success', e => {
        that.$message({message: '复制成功',type: 'success',center: true});
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        that.$message({message: '浏览器不兼容，请手动长按复制',type: 'warning',center: true});
        clipboard.destroy()
      })
    },
    Continue(){
      this.$router.push('/ImportAccount');
    }
  },
  computed: {
    ...mapState('EosConfig', {
      form: 'form'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.CopyPrKey{
  background-color: #f7f7f7;
  height: 100%;
  .content{
    margin-top: 46px;
    .wa{
      border: none;
      width: 60px;
      height: 22px;
      background:url(../../static/ico_15.png) no-repeat;
      background-size: contain;
      /* border: none;
      color: #fff;
      width: 45px;
      height: 22px;
      background:#cccccc;
      border-radius: 5px;
      margin-top: 10px;
      outline: none; */
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
