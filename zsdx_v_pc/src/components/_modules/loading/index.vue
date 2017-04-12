<template>
  <transition enter-active-class="animated zoomIn"
              leave-active-class="animated zoomOut">
  <div class="loading_layer f--hcc" v-if="show">
    <ul class="loading f--h">
      <li v-for="i in 10"></li>
    </ul>
  </div>
  </transition>
</template>

<script>
  export default {
    name: 'loading',
    data () {
      return {
        PublicStore: this.$store.state.Public
      }
    },
    computed: {
      show () {
        return this.PublicStore.isLoading
      }
    },
    mounted: function () {
//      console.log(this.PublicStore.isLoading)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/mixin/index";
  .loading_layer{
    @include position(fixed,99,0,0,0,0);
    background: rgba(0,0,0,0.6);

    &.animated{
      -webkit-animation-duration: 300ms !important;
      animation-duration: 300ms !important;
    }

    .loading{
      li{
        width: 8px;
        height: 50px;
        margin-right:5px;
        background-color: #FFF;
        animation: long_short_show 1s infinite;

        &:nth-child(10){
          -webkit-animation-delay: 0.9s;
          animation-delay: 0.9s;
          margin-right: 0;
        }
        &:nth-child(9){
          -webkit-animation-delay: 0.8s;
          animation-delay: 0.8s;
        }
        &:nth-child(8){
          -webkit-animation-delay: 0.7s;
          animation-delay: 0.7s;
        }
        &:nth-child(7){
          -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
        }
        &:nth-child(6){
          -webkit-animation-delay: 0.5s;
          animation-delay: 0.5s;
        }
        &:nth-child(5){
          -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s;
        }
        &:nth-child(4){
          -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
        }
        &:nth-child(3){
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }
        &:nth-child(2){
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
      }
    }
  }
</style>
