<template>
  <div class="selectAccount">
    <view-box ref="viewBox">
      <x-header slot="header" title="选择收款币种" style="width:100%;position:fixed;height: 46px;left:0;top:0;z-index:100;background: #05a8f5;"></x-header>
      <div class="kccontainer">
        <div class="content_list">
          <div class="Content">
            <div v-for="(item,index) in TokenList" :key="index" class="c_card" @click="Gocoin(item)">
              <div>
                <span class="c_card_sa" v-text="item.symbol"></span>
                <span class="c_card_sb" v-text="`${item.code}`"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import { ViewBox,XHeader } from 'vux'
export default {
  components: {
    ViewBox,XHeader
  },
  name: 'selectAccount',
  data () {
    return {
      id: '',
      netName: '',
      name: '',
      aesR: '',
      privateKey: '',
      pops: true
    }
  },
  created() {
    this.id = this.$route.params.id;
    for(let key of this.AccountList){
      if(key.id == this.id){
        this.netName = key.netName;
        this.name = key.name;
        this.aesR = key.aesR;
        this.$store.dispatch('EosConfig/getTokenList',key.name);
      }
    }
  },
  methods: {
    Gocoin(item){
      this.$router.push(`/PayeeQrcode/${this.id}/${item.code}/${item.symbol}`);
    }
  },
  computed: {
    ...mapState('EosConfig', {
      AccountList: 'AccountList',
      TokenList: 'TokenList'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.selectAccount{
  background-color:#f7f7f7; 
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>

<style lang='less' scoped>
.kccontainer{
  padding-top:50px;
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
        color: #FF9900;
      }
      .c_card_sb{
        display:block;
        font-size: 13px;
        color: #999999;
      }
    }
  }
}
</style>
