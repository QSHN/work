<template>
  <div id="app">
    <page-header></page-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import pageHeader from './components/_modules/header/header.vue'
  export default {
    name: 'app',
    components: { pageHeader },
    data () {
      return {

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "./components/_style/index";
  #app {

  }
</style>
