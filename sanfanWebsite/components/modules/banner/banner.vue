<template lang="pug">
  div
    .banner
      .container
        .banner_left
          .logo
            img(src="~/assets/image/index/logo_sanfan_big@2x.png")

          .left_c
            .code
              img(src="~/assets/image/index/qr_core_green@2x.png")

            .list_layer
              .list
              .list
                a.qq_btn(href="http://wpa.qq.com/msgrd?v=3&uin=3256028001&site=qq&menu=yes" target="_blank")
                .weixin_btn

          p
            |注册登录后，在手机APP设置页面有
            em 使用手册
            |，可按照使用手册设置功能，根据不同的职位来设置，操作简单方便

        .banner_right

    .sub_nav
      .container
        nav
          router-link(name="office" to="/office") 企业办公OA专用版
          router-link(name="sale" to="/sale") 快销行业专用版
          li(@click="tipFun") 房产中介专用版
          li(@click="tipFun")  工厂专用版

</template>

<script>
export default {
  name: 'Banner',
  methods: {
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
@import './banner';
</style>
