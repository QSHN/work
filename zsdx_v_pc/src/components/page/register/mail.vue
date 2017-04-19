<template>
  <div class="RP_mail">
    <div class="RP_header"><span>注册</span></div>
    <div class="RP_content">
      <transition enter-active-class="animated bounceInRight" appear>
        <div class="input_layer">
          <div class="error">多少集啊放开手</div>
          <input class="br2" type="text" placeholder="填写常用邮箱" />
        </div>
      </transition>

      <transition enter-active-class="animated bounceInRight" appear>
        <router-link class="page_link ho_6" to="/register/phone">用手机注册></router-link>
      </transition>

      <transition enter-active-class="animated bounceInRight" appear>
        <div class="code f--hlc">
          <div class="error">多少集啊放开手</div>
          <input class="code br2" ref="code" type="text" placeholder="验证码" />
          <canvas id="code_canvas" width="112" height="32"></canvas>
          <span class="ho_6" v-on:click.stop="updateCode">换一张</span>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <div class="other f--hlc">
          <label class="f--hlc">
            <input type="checkbox" ref="checkbox" />
            <p>同意<a class="ho_6" href="#" target="_blank">服务条款</a></p>
          </label>
          <span class="flex-1"></span>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <button class="register_btn br2 ho_6">发送验证邮件</button>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <router-link class="page_link ho_6" to="/login">已有账号，直接登录></router-link>
      </transition>
    </div>
  </div>
</template>

<script>
  import Pub from '../../../js/public'
  export default {
    name: 'RP_mail',
    Pub,
    data () {
      return {
        vCode: null
      }
    },
    methods: {
      updateCode: function () {
        // 更新验证码
        this.vCode = Pub.createCode()
        console.log(this.vCode)
      }
    },
    mounted: function () {
      this.updateCode()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
