<template>
  <div class="zsdx_index_page" v-bind:style="{ minHeight: height+'px'}">
    <banner :bannerData="bannerData"></banner>
    77778
  </div>
</template>

<script>
  import banner from '../../_modules/banner/index.vue'
  export default {
    name: 'zsdx_index_page',
    components: { banner },
    data () {
      return {
        height: window.innerHeight - 69 - 292,
        bannerData: {
          width: '100',
          height: '600px',
          picWidth: '1920px',
          noLink: true,
          picList: ['1.jpg', '2.jpg', '3.jpg']
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .zsdx_index_page{
    padding-top: 69px;
  }
</style>
