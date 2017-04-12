<template>
  <div id="app">
    <page-header></page-header>
    <router-view></router-view>
    <page-footer></page-footer>
    <!--弹窗/弹出层-->
    <loading-layer></loading-layer>
  </div>
</template>

<script>
  import pageHeader from './components/_modules/header/header.vue'
  import pageFooter from './components/_modules/footer/footer.vue'
  import loadingLayer from './components/_modules/loading/index.vue'
  export default {
    name: 'app',
    components: {
      pageHeader,
      pageFooter,
      loadingLayer
    },
    data () {
      return {

      }
    },
    mounted: function () {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "./style/index";
  #app {

  }
</style>
