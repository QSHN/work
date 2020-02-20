<template lang="pug">
  .page_header(:class="$route.name === 'index' ? 'active' : ''")
    .container
      .ph_c
        .left
          img.logo(src="~/assets/image/public/logo_sanfan_small@2x.png" @click="$router.push('/')")

        .right
          nav
            router-link(name="index" to="/" :class="{'active': $route.name == 'index'}") 首页
            <!--a(target="_blank" href="http://admin.sanfanerp.com") 客户管理后台-->
            <!--router-link(name="manual" to="/manual") 功能手册下载-->
            router-link(name="manual1" to="/manual1") 三帆外勤功能说明
            router-link(name="manual2" to="/manual2") 超级管理员手册
            router-link(name="manual3" to="/manual3") 管理层手册
            router-link(name="manual4" to="/manual4") 财务员工手册
            router-link(name="manual5" to="/manual5") 行政员工手册
            router-link(name="manual6" to="/manual6") 基层员工手册
            router-link(name="about" to="/about") 关于我们
            a(target="_blank" href="http://webhawk.sanfanerp.com") 三帆外勤电脑端-进入
</template>

<script>
export default {
  name: 'PageHeader',
  data() {
    return {}
  },
  methods: {
    // toWeb() {
    //   this.$notify({
    //     title: '提示',
    //     message: '该功能已经在开发中了，请敬请期待！',
    //     type: 'success'
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
@import './header';
</style>
