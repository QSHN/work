<template>
  <div class="zsdx_index_page" v-bind:style="{ minHeight: height+'px'}">
    <banner :bannerData="bannerData"></banner>
    <page-nav :navData="navData"></page-nav>
    77778
  </div>
</template>

<script>
  import banner from '../../_modules/banner/index.vue'
  import pageNav from '../../_modules/nav/3dnav.vue'

  export default {
    name: 'zsdx_index_page',
    components: { banner, pageNav },
    data () {
      return {
        height: window.innerHeight - 69 - 292,
        bannerData: {
          noLink: true,
          picList: ['1.jpg', '2.jpg', '3.jpg']
        },
        navData: [
          { href: '#', name: '热门' },
          { href: '#', name: 'Java开发工程师' },
          { href: '#', name: '营养师' },
          { href: '#', name: '导师' },
          { href: '#', name: '交互设计师' }
        ]
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
