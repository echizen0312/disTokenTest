<template>
  <div class="hb">
    <view-box ref="viewBox">
      <div class="content">
        <x-header slot="header" title="红包" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
        <div class="hbcontent">
          <div class="shares"></div>
          <div class="top" style="position: absolute;z-index: 999;width: 250px;height: 150px;color: #000;background: #d8baba;top: 45%;left: 50%;margin-top: -150px;margin-left: -125px;border-radius: 10px 10px 50% 50% / 10px 10px 15% 15%;box-shadow: 0px 4px 0px -1px rgba(0,0,0,0.2);"></div>
          <div class="money" style="position: absolute;width: 50px;height: 50px;z-index: 1000;background: #46ed11;border-radius: 50%;top: 45%;left: 50%;margin-top: -25px;margin-left: -25px;"></div>
          <div class="bottom" style="position: absolute;z-index: 998;width: 250px;height: 200px;color: #000;background: #f92b2b;bottom: 60%;left: 50%;margin-left: -125px;margin-bottom: -200px;border-radius: 0 0 10px 10px / 0 0 10px 10px;"></div>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import { XButton,Divider,ViewBox,XHeader } from 'vux'
  export default {
    name: 'hb',
    components: {
      XButton,Divider,ViewBox,XHeader
    },
    data () {
      return {
        nowIndex: 0
      }
    },
    created () {},
    methods: {
      GoNewPage(r){
        if(r == 'import'){
          this.$router.push('/ImportAccount');
        }else{

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.hb{
  height: 100%;
  .content{
    height: 100%;
    margin-top: 46px;
  }
  .hbcontent{
    height: 100%;
    position: relative;
  }
}
.shares{
	z-index: 997;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.7;
    filter: alpha(opacity=70);
}
.money{
   -webkit-animation: page1_circle2 0.6s linear 4s;
    animation: page1_circle2 0.6s linear 4s;
}
.top{
  -webkit-animation: tops 0.6s linear 5s;
  animation: tops 0.6s linear 5s;
}
.bottom{
  -webkit-animation: bottoms 0.6s linear 5s;
  animation: bottoms 0.6s linear 5s;
}
@keyframes page1_circle2
{
0% {
    transform: rotateY(0deg);
	-webkit-transform: rotateY(0deg); }
100%{
    transform: rotateY(360deg);
    -webkit-transform: rotateY(360deg); }
}

@-webkit-keyframes page1_circle2
{
0% {
    transform: rotateY(360deg);
	-webkit-transform: rotateY(360deg); }
100%{
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg); }
}

//////top/////////////////////////
@keyframes tops
{
0% {
    top: 30%;
  }
100%{
    top:0;  
  }
}

@-webkit-keyframes tops
{
0% {
    top: 30%;
  }
100%{
    top:0;  
  }
}

///////////////bottoms/////////////////////
@keyframes bottoms
{
0% {
    bottom: 60%;
  }
100%{
    bottom:0;  
  }
}

@-webkit-keyframes bottoms
{
0% {
    bottom: 60%;
  }
100%{
    bottom:0;  
  }
}
</style>