<template>
  <div class="guide">
    <div class="imgs">
      <img src="../../static/logo.png" />
      <divider><span style="display: block;height: 4px;width: 21px;background-color: #2fa1df;"></span></divider>
    </div>
    <div class="Buttons">
      <x-button class="importaccount" @click.native="GoNewPage('import')">导入账户</x-button>
      <x-button class="createuse" @click.native="GoNewPage('create')">新建用户</x-button>
    </div>
  </div>
</template>

<script>
import { XButton,Divider } from 'vux'
  export default {
    name: 'guide',
    components: {
      XButton,Divider
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
          this.$router.push('/CreateAccount');
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.guide{
  .imgs{
    padding: 120px 35px 0 35px;
    img{
      width: 200px;
    }
    .vux-divider{
      padding: 0;
      margin-top: 10px;
      &:after {
        background-position: left 0 top 28%;
      }
      &:before {
        background-position: right 0 top 28%;
      }
    }
  }
  .Buttons{
    padding: 0 35px;
    .importaccount{
      color: #26D9DB;
      background-color: #FFFFFF;
      &:after {
        border: 1px solid #26D9DB;
      }
    }
    .createuse{
      color: #FFFFFF;
      background-color: #14D5A4;
    }
    button{
      margin-top: 20px;
      height: 45px;
      letter-spacing: 2px;
    }
  }
}
</style>
