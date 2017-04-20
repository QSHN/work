<template>
  <div class="RP_mail">
    <div class="RP_header"><span>注册</span></div>
    <div class="RP_content">
      <transition enter-active-class="animated bounceInRight" appear>
        <div class="input_layer">
          <div class="error">{{mailError}}</div>
          <input class="br2" type="text" ref="mail" placeholder="填写常用邮箱" />
        </div>
      </transition>

      <transition enter-active-class="animated bounceInRight" appear>
        <router-link class="page_link ho_6" to="/register/phone">用手机注册></router-link>
      </transition>

      <transition enter-active-class="animated bounceInRight" appear>
        <div class="code f--hlc">
          <div class="error">{{codeError}}</div>
          <input class="code br2" ref="code" type="text" placeholder="验证码" />
          <canvas id="code_canvas" width="112" height="32"></canvas>
          <span class="ho_6" v-on:click.stop="updateCode">换一张</span>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <div class="other f--hlc">
          <label class="f--hlc"
                 v-bind:class="[{animated: isCheckedAnimated}, isChecked ? 'wobble' : 'shake']">
            <input type="checkbox" ref="checkbox" />
            <p>同意<a class="ho_6" href="#" target="_blank">服务条款</a></p>
          </label>
          <span class="flex-1"></span>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <button class="register_btn br2 ho_6" @click.stop="register">发送验证邮件</button>
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
        vCode: null,
        mailError: '',
        codeError: '',
        isChecked: false,
        isCheckedAnimated: false
      }
    },
    methods: {
      updateCode: function () {
        // 更新验证码
        this.vCode = Pub.createCode()
        console.log(this.vCode)
      },
      register: function () {
        let mail = this.$refs.mail.value
        let code = this.$refs.code.value.toUpperCase()
        let ischecked = this.$refs.checkbox.checked
        let isM = false
        let isC = false

        // 检查邮箱
        if (mail.length === 0) {
          this.mailError = '喵，邮箱不能为空'
        } else if (!Pub.isTrueUser(mail, false)) {
          this.mailError = '喵，邮箱格式不对'
        } else {
          this.mailError = ''
          isM = true
        }

        // 检查验证码
        if (code.length === 0) {
          this.codeError = '喵，验证码不能为空'
        } else if (code !== this.vCode) {
          this.codeError = '喵，验证码不对'
        } else {
          this.codeError = ''
          isC = true
        }

        // 有没有同意协议
        if (!ischecked) {
          this.isChecked = !this.isChecked
          this.isCheckedAnimated = true
        }

        if (isM && isC && ischecked) {
          Pub.globalPrompt('error', '暂不开放邮箱注册')
        }
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
