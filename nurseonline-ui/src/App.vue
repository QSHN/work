<template>
  <div id="app" style="position: relative">
    <router-view/>
    <div style="width:300px; padding:20px 0;position: absolute;bottom: 0px; left: 50%;margin-left: -150px">
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602006765" style="display:inline-block;text-decoration:none;"><img src="/img/beian.png" style="float:left;margin-top: 10px;"/><p style="float:left;height:40px;line-height:40px;margin: 0px 0px 0px 5px; color:#999;">粤公网安备 44010602006765号</p ></a>
    </div>
  </div>
</template>

<script>
  //测试提交
  export default {
    name: 'app',
    data() {
      return {}
    },
    watch: {},
    created() {
    },
    methods: {},
    computed: {}
  }
</script>
<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .avue-crud__dialog--overflow {
    max-height: 520px !important;
    overflow-x: hidden;
    overflow-y: auto;
  }

</style>
