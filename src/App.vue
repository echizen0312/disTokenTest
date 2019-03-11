<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  },
  watch: {
    '$route'(to, from) {
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang='less'>
@import '~vux/src/styles/1px.less';
  .el-message{
    top:0;
  }
  .weui-tabbar{
    position:fixed !important;
    max-width: 768px;
    background-color: #fff !important;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  position: relative;
  background: #F7F7FA;
  max-width: 768px;
  margin: 0 auto;
}
.vux-header-back{
    color: #fff !important;
  }
.sak-text {
    word-break: keep-all;
    /* 不换行 */
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
    /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis;
    /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
html *, html :after, html :before {
     box-sizing: inherit;
     margin: 0;
}
html{
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
}
body{
  -webkit-text-size-adjust: 100%!important;
}
a{
  text-decoration: none;
}
/* *, :after, :before {
    box-sizing: border-box;
} */
</style>
