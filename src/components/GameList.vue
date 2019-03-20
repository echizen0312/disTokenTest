<template>
  <div class="GameList">
    <view-box ref="viewBox">
      <x-header slot="header" title="DisToken" :left-options="{showBack: false}" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
      <div class="Content">
        <div v-for="(item,index) in GameList" :key="index" class="c_card" @click="GoGame(item)">
          <div class="dir" :style="{backgroundColor: item.netColor}"></div>
          <div class="net_title">
            <div class="net_icon" :style="{backgroundColor: item.netColor}" v-text="item.netName.substring(0,1)"></div>
            <span style="font-size:12px;">仅支持<span style="color: rgb(230, 81, 0);margin-left: 5px;margin-right: 5px;" v-text="item.netName"></span>链</span>
          </div>
          <div class="net_content">
            <img :src="item.logo" />
            <span v-text="item.name"></span>
          </div>
        </div>
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
  name: 'GameList',
  data () {
    return {
      GameList: []
    }
  },
  created() {
    for(const key of games){
      for(const c of this.configLists){
        if(key.netId == c.netId){
          key.netColor = c.netColor;
        }
      }
    }
    this.GameList = games;
  },
  methods: {
    GoCreate(){
      this.$router.push('/CreateAccount');
    },
    GoGame(item){
      const that = this;
      if(that.AccountId == ''){
        that.$message({message: `请选择链`,type: 'warning',center: true});
        return;
      }
      if(item.netId != that.configobj.netId){
        that.$message({message: `您当前的链${that.configobj.netName}不支持这条链`,type: 'warning',center: true});
      }else{
        for(const key of that.AccountList){
          if(key.id == that.AccountId){
            window.location.href = `${item.address}?netId=${item.netId}&accName=${key.name}`
          }
        }
      }
    }
  },
  computed: {
    ...mapState('EosConfig', {
      configLists: 'configList',
      configobj: 'configobj',
      AccountId: 'AccountId',
      AccountList: 'AccountList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.GameList{
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
      margin: 12px;
      padding: 10px;
      background: #fff;
      text-align: left;
      font-family: sans-serif;
      position: relative;
      .dir{
        height: 5px;
        background: #ccc;
        position: absolute;
        top: 0;
        width: 100%;
        left: 0;
      }
      .net_title{
        padding-top: 10px;
        .net_icon{
          background-color: rgb(0, 150, 136);
          width: 22px;
          height: 22px;
          color: #FFFFFF;
          text-align: center;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bolder;
          margin-right: 10px;display: inline-block;
        }
      }
      .net_content{
        display: flex;
        align-items: center;
        margin-top: 15px;
        img{
          width: 48px;
          height: 48px;
          border-radius: 5px;
        }
        span{
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 2px;
          padding-left: 20px;
        }
      }
    }
  }
</style>
