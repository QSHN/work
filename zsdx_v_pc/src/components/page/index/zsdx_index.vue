<template>
  <div class="zsdx_index_page" v-bind:style="{ minHeight: height+'px'}">
    77778
  </div>
</template>

<script>
  export default {
    name: 'zsdx_index_page',
    data () {
      return {
        height: window.innerHeight - 69 - 292
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
