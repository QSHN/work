<template lang="pug">
  div
    .flow_chart
      .pic_layer
        img(:src="getImgSrc('function_all')")
        nav(v-if="$route.name !== 'index'")
          router-link(name="office" to="/office" :class="{active: $route.name === 'office'}") 企业办公OA专用版
          router-link(name="sale" to="/sale" :class="{active: $route.name === 'sale'}") 快销行业专用版
          li(@click="tipFun") 房产中介专用版
          li(@click="tipFun")  工厂专用版

    .footer
      p 咨询热线：400-688-1280
      p Copyright &#169 2014-2019 www.sanfanerp.com 三帆软件
        a(href='http://www.beian.miit.gov.cn' target='_blank') 粤ICP备18158124号

</template>

<script>
export default {
  name: 'FlowChart',
  data() {
    return {}
  },
  methods: {
    getImgSrc(src) {
      const img = require(`~/assets/image/index/${src}${
        this.$route.name === 'office' ? '' : '1'
      }@2x.png`)
      return img
    },
    tipFun() {
      this.$alert('该版本正在制作中，敬请期待', '温馨提示', {
        confirmButtonText: '确定',
        lockScroll: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './flowChart';
</style>
