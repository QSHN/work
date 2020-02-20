<template lang="pug">
  nav.float_module
    li
      .li_c
    a(href="http://wpa.qq.com/msgrd?v=3&uin=3256028001&site=qq&menu=yes" target="_blank")
    li
    li(:class="isShow ? 'active' : ''" @click.stop="scrollTop")
    li

</template>

<script>
export default {
  name: 'FloatModule',
  data() {
    return {
      isShow: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.isShow = scrollTop > window.innerHeight
    },
    scrollTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'floatModule';
</style>
