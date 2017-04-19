<template>
  <div class="register_page">
    <cross-animation></cross-animation>

    <router-view></router-view>
  </div>
</template>

<script>
  import crossAnimation from '../../_modules/cross_animation/cross_animation.vue'
  export default {
    name: 'register_page',
    components: { crossAnimation },
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
  @import "../../../style/page/page/register";
</style>
