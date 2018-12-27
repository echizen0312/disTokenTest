<template>
  <div>
    <mu-bottom-nav class="mu_bottom_nav" @change="Gotabbar" :value="nowIndex">
      <mu-bottom-nav-item title="钱包" icon="credit_card"></mu-bottom-nav-item>
      <mu-bottom-nav-item title="游戏" icon="videogame_asset"></mu-bottom-nav-item>
      <mu-bottom-nav-item title="买币" icon="store"></mu-bottom-nav-item>
      <mu-bottom-nav-item title="创建" icon="person_add"></mu-bottom-nav-item>
      <mu-bottom-nav-item title="测试" icon="block"></mu-bottom-nav-item>
    </mu-bottom-nav>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        nowIndex: 0
      }
    },
    watch: {
      '$route' (to, from) {
        this.setNowIndex(this.$route.path)
      }
    },
    created () {
      this.setNowIndex(this.$route.path)
    },
    methods: {
      Gotabbar (index) {
        const that = this
        that.nowIndex = index
        console.log(index)
        switch (index) {
          case 0:
            that.$router.push('/IndexHome')
            break
          case '1':
            console.log(123)
            that.$router.push('/RankingList')
            break
          case 2:
            that.$router.push('/PerCenter')
            break
          case 3:
            that.$router.push('/PerCenter')
            break
          case 4:
            that.$router.push('/EOSTest')
            break
        }
      },
      setNowIndex (path) {
        const that = this
        if (path.includes('AccountList')) {
          that.nowIndex = 0
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .mu_bottom_nav {
    width: 100%;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #e0e0e0;
  }
</style>
