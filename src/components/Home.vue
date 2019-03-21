<template>
  <div class="UHomeMain">
    <tabbar :value="nowIndex">
      <tabbar-item @on-item-click="Gotabbar">
        <img v-show="nowIndex==0" slot="icon" src="../../static/ico_08_b.png">
        <img v-show="nowIndex!=0" slot="icon" src="../../static/ico_08_g.png">
        <span slot="label">钱包</span>
      </tabbar-item>
      <tabbar-item @on-item-click="Gotabbar">
        <img v-show="nowIndex==1" slot="icon" src="../../static/ico_09_b.png">
        <img v-show="nowIndex!=1" slot="icon" src="../../static/ico_09_g.png">
        <span slot="label">游戏</span>
      </tabbar-item>
      <tabbar-item @on-item-click="Gotabbar">
        <img v-show="nowIndex==2" slot="icon" src="../../static/ico_10_b.png">
        <img v-show="nowIndex!=2" slot="icon" src="../../static/ico_10_g.png">
        <span slot="label">买币</span>
      </tabbar-item>
    </tabbar>
    <router-view/>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import {mapState} from 'vuex';
  export default {
    components: {
    Tabbar,
    TabbarItem
  },
    name: 'home',
    data () {
      return {
        nowIndex: null
      }
    },
    watch: {
      '$route' (to, from) {
        this.setNowIndex(this.$route.path)
      }
    },
    created () {
      if(this.$route.path==='/') return;
      this.setNowIndex(this.$route.path);
    },
    methods: {
      Gotabbar (index) {
        const that = this;
        that.nowIndex = index;
        switch (index) {
          case 0:
          if(that.AccountId == ''){
            that.$router.push('/HomeList');
          }else{
            that.$router.push(`/WalletHome/${that.AccountId}`);
          }
            break
          case 1:
            that.$router.push('/GameList')
            break
          case 2:
            location.href = 'http://c2c.naturetoken.io/'
            //that.$router.push('/PerCenter')
            break
        }
      },
      setNowIndex (path) {
        const that = this
        if (path.includes('HomeList') || path.includes('CreateAccount') || path.includes('ImportAccount') || path.includes('WalletHome') || path.includes('Coindetails') || path.includes('AllTransferList') || path.includes('Transfer') || path.includes('Crosslinktransfer') || path.includes('RequestTransaction')) {
          that.nowIndex = 0;
        }
        if(path.includes('GameList')){
          that.nowIndex = 1;
        }
        if(path.includes('RequestTransfer')){
          that.nowIndex = 2;
        }
      }
    },
    computed: {
      ...mapState('EosConfig', {
        AccountId: 'AccountId'
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
  color:#0ca3ef !important;
}
</style>
<style scoped>
.UHomeMain{
  height: 100%;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  text-decoration: none;
}
</style>