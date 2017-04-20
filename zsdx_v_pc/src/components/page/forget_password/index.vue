<template>
  <div class="forget_password_page">
    <cross-animation></cross-animation>

    <nav class="second_nav f--hlc">
      <li @click.stop="ToggleContent(0)"
          :class="{active : !nowContent}">通过绑定的手机找回密码</li>
      <li @click.stop="ToggleContent(1)"
          :class="{active : nowContent}">通过绑定的邮箱找回密码</li>
      <li class="flex-1"></li>
    </nav>

    <div class="FPP_content_layer f--hlc">
      <transition
        enter-active-class="animated bounceInRight"
        leave-active-class="animated bounceOutLeft">
        <forget-content :type="nowContent" v-if="!nowContent"></forget-content>
      </transition>

      <transition
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutRight">
        <forget-content :type="nowContent" v-if="nowContent"></forget-content>
      </transition>
    </div>
  </div>
</template>

<script>
  import crossAnimation from '../../_modules/cross_animation/cross_animation.vue'
  import forgetContent from './_form.vue'
  export default {
    name: 'forget_password_page',
    components: { crossAnimation, forgetContent },
    props: [],
    data () {
      return {
        nowContent: 0
      }
    },
    methods: {
      ToggleContent: function (now) {
        this.nowContent = now
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
  @import "../../../style/page/page/forget_password";
</style>
