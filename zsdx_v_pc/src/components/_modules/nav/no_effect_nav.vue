<template>
  <nav class="no_effect_nav f--hcc">
    <li v-for="v in navData"><a :href="v.href" class="ho_blue">{{v.name}}</a></li>
  </nav>
</template>

<script>
  export default {
    name: 'no_effect_nav',
    props: ['navData'],
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .no_effect_nav{
    width: 100%;
    height: 85px;
    border-bottom: 1px solid #b7b7b7;
    list-style: none;

    li{
      width: 154px;

      a{
        width: 100%;
        height: 85px;
        line-height: 85px;
        display: block;
        text-align: center;
        font-size: 18px;
        color: #000000;
        letter-spacing: 1px;
      }
    }
  }
</style>
