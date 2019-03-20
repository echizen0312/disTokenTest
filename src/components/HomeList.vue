<template>
  <div class="HomeList">
    <view-box ref="viewBox">
      <x-header slot="header" title="切换用户" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"><a @click="GoCreate" class="header_right" slot="right"></a></x-header>
      <div class="Content">
        <div v-for="(item,index) in AccountList" :key="index" class="c_card" @click="GoWallet(item.id)">
          <div>
            <span class="c_card_sa" v-text="item.name"></span>
            <span class="c_card_sb" v-text="`所在链：${item.netName}`"></span>
          </div>
          <div>
            <a href="javascript:" class="delIcon"></a>
          </div>
        </div>
      </div>
      <div class="Buttons">
        <x-button class="createuse" @click.native="OpenImport">导入账户</x-button>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { Group,ViewBox,XHeader,XButton } from 'vux'
export default {
  components: {
    Group,ViewBox,XHeader,XButton
  },
  name: 'HomeList',
  data () {
    return {}
  },
  created() {
  },
  methods: {
    OpenImport(){
      this.$router.push('/ImportAccount');
    },
    GoCreate(){
      this.$router.push('/CreateAccount');
    },
    GoWallet(id){
      const that = this;
      this.$store.commit('EosConfig/SetAccountId',id);
      this.$store.dispatch('EosConfig/UpdateNetLink',id);
      setTimeout(() => {
        that.$router.push(`/WalletHome/${id}`);
      }, 100);
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
.HomeList{
  background-color:#f7f7f7; 
  height: 100%;
  position: relative;
  .Content{
    padding-top: 46px;
    margin-bottom: 50px;
  }
}
</style>

<style lang='less' scoped>
.header_right{
  background:url(../../static/ico_13_25.png) no-repeat;
  background-size: contain;
  display: block;
  width: 20px;
  height: 20px;
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
        color: #656565;
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
