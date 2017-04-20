<template>
  <div class="FPP_content">
    <div class="input_layer phone">
      <div class="error">asdasda</div>
      <input class="account br2"
             ref="account"
             type="text"
             :placeholder="[type ? '请输入邮箱' : '请输入手机' ]" />
    </div>

    <div class="code_layer f--hlc">
      <div class="error">asdasda</div>
      <input class="code br2" ref="code" type="text" placeholder="验证码" />
      <canvas id="code_canvas" width="112" height="32"></canvas>
      <span class="ho_6" v-on:click.stop="updateCode">换一张</span>
    </div>

    <button class="register_btn br2 ho_6"
            @click.stop="register">
      {{type ? '发送到验证邮箱' : '发送到手机'}}
    </button>

    <router-link class="page_link ho_6" to="/login">返回登录></router-link>
  </div>
</template>

<script>
  import Pub from '../../../js/public'
  export default {
    name: 'FPP_content',
    props: ['type'],
    data () {
      return {}
    },
    methods: {
      updateCode: function () {
        // 更新验证码
        this.vCode = Pub.createCode()
        console.log(this.vCode)
      }
    },
    mounted: function () {
      let delay = setTimeout(() => {
        this.updateCode()
        clearTimeout(delay)
      }, 1100)
      delay
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
