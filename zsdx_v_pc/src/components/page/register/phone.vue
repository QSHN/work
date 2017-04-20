<template>
  <div class="RP_phone">
    <div class="RP_header"><span>注册</span></div>
    <div class="RP_content">
      <transition enter-active-class="animated bounceInRight" appear>
        <div class="input_layer phone">
          <div class="error">{{phoneError}}</div>
          <input class="br2"
                 type="text"
                 placeholder="输入您的手机号"
                 @blur.stop="UpdatePhone"
                 v-model="phone" />
        </div>
      </transition>

      <transition enter-active-class="animated bounceInRight" appear>
        <div class="input_layer password">
          <div class="error">{{passwordError}}</div>
          <ul class="safety_factor f--hlc" v-show="safety != -1" v-bind:class="safetyClass">
            <li class="title">安全系数</li>
            <li class="color color1"></li>
            <li class="color color2"></li>
            <li class="color color3"></li>
            <li class="color color4"></li>
            <li class="color color5"></li>
            <li class="factor">{{safetyText}}</li>
          </ul>
          <input class="br2"
                 type="password"
                 placeholder="密码（6-16个字符组成，区分大小写）"
                 v-model="password" />
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <div class="input_layer">
          <div class="error">{{codeError}}</div>
          <input class="br2"
                 type="number"
                 placeholder="手机验证码"
                 maxlength="6"
                 @blur.stop="UpdateCode"
                 v-model="code" />
          <button class="get_code ho_6 br2"
                  v-bind:class="{ active: isGetCode }"
                  @click.stop="getCode">{{reciprocalText}}</button>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <div class="other f--hlc">
          <label class="f--hlc"
                 v-bind:class="[{animated: isCheckedAnimated}, isChecked ? 'wobble' : 'shake']">
            <input type="checkbox" ref="checkbox" />
            <p>同意<a class="ho_6" href="#">服务条款</a></p>
          </label>
          <span class="flex-1"></span>
          <router-link class="ho_6" to="/register/mail">用邮箱注册></router-link>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <button class="register_btn br2 ho_6" @click.stop="register">注册</button>
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
    name: 'RP_phone',
    Pub,
    data () {
      return {
        phone: '',
        phoneError: '',
        password: '',
        passwordError: '',
        code: '',
        codeError: '',
        safety: -1,
        safetyClass: '',
        safetyText: '',
        isChecked: false,
        isCheckedAnimated: false,
        isGetCode: false,
        reciprocalText: '点击获取'
      }
    },
    methods: {
      UpdatePhone: function () {
        if (this.phone.length === 0) {
          this.phoneError = '喵，手机号不能为空'
        } else if (!Pub.isTrueUser(this.phone, true)) {
          this.phoneError = '喵，手机格式错误'
        } else {
          this.phoneError = ''
        }
      },
      UpdateCode: function () {
        if (this.code.length === 0) {
          this.codeError = '喵，验证码不能为空'
        } else {
          this.codeError = ''
        }
      },
      UpdatePassword: function () {
        if (this.password.length === 0) {
          this.passwordError = '喵，密码不能为空'
        } else if (this.password.length < 6) {
          this.passwordError = '喵，密码不能小于六位数字'
        } else {
          this.passwordError = ''
        }
      },
      getCode: function () {
        this.UpdatePhone()
        if (this.isGetCode) return
        if (this.phone.length === 0 || !Pub.isTrueUser(this.phone, true)) return

        this.isGetCode = true
        let time = 60
        let reciprocal = setInterval(() => {
          time--
          this.reciprocalText = time + 's'
          if (time === 0) {
            this.reciprocalText = '点击获取'
            clearInterval(reciprocal)
          }
        }, 1000)
        reciprocal

        let cabFuc = (data) => {
          console.log(data)
        }
        let sendData = {
          cellphone: this.phone
        }
        Pub.sendDataFuc(this, '/sms/vcode/send.do', sendData, cabFuc)
      },
      register: function () {
        this.UpdatePhone()
        this.UpdatePassword()
        this.UpdateCode()
        if (this.phone.length === 0 || !Pub.isTrueUser(this.phone, true)) return
        if (this.password.length === 0 || this.password.length < 6) return
        if (this.code.length === 0) return

        let checked = this.$refs.checkbox.checked
        if (!checked) {
          this.isChecked = !this.isChecked
          this.isCheckedAnimated = true
          return
        }

        let cabFuc = (data) => {
          let errorTxt = ''
          switch (data.ret.retCode) {
            case '0000' :
              errorTxt = false
              this.$store.commit('USER_INFO', {type: 'set', userInfo: data.userInfo})
              this.$router.push('/index')
              break
            case '6979' :
              errorTxt = '验证码错误'
              break
            case '6985' :
              errorTxt = '账户已存在'
              break
            case '6666' :
              errorTxt = '验证码已过期'
              break
            default:
              errorTxt = data.ret.retError
          }
          if (errorTxt) {
            Pub.globalPrompt('error', errorTxt)
          }
        }
        let sendData = {
          username: this.phone,
          password: this.password,
          j_captcha: this.code
        }
        Pub.sendDataFuc(this, '/shop/user/reg.do', sendData, cabFuc)
      }
    },
    watch: {
      password: function () {
        this.safety = Pub.checkPassword(this.password)
        if (this.safety === -1) {
          this.passwordError = '喵，密码不能为空'
        } else if (this.safety === -2) {
          this.passwordError = '喵，密码不能小于六位数字'
        } else {
          this.passwordError = ''
          switch (this.safety) {
            case 1 :
              this.safetyClass = 'red'
              this.safetyText = '非常低'
              break
            case 2 :
              this.safetyClass = 'orange'
              this.safetyText = '低'
              break
            case 3 :
              this.safetyClass = 'yellow'
              this.safetyText = '中'
              break
            case 4 :
              this.safetyClass = 'blue'
              this.safetyText = '高'
              break
            case 5 :
              this.safetyClass = 'green'
              this.safetyText = '非常高'
              break
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
