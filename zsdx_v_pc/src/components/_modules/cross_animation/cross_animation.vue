<template>
  <div class="cross_animation"></div>
</template>

<script>
  export default {
    name: 'cross_animation',
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../_style/mixin/index";
  .cross_animation{
    position: relative;
    width: 100%;
    height: 106px;
    background: url("../../../img/icon/login_top_bg.png") no-repeat center;
    overflow: hidden;

    &:before{
      position: relative;
      z-index: -1;
      content: "";
      width: 100%;
      height: 86px;
      background: #00a0d8;
      display: block;
    }

    &:after{
      @include position(absolute,1,0,-146px,false,false);
      width: 146px;
      height: 106px;
      content: "";
      display: block;
      background: url("../../../img/icon/login_top_bg_animation.png") no-repeat;
      animation: cross 30s infinite linear;
    }
  }
</style>
