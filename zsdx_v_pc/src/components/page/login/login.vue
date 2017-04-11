<template>
  <div class="login_page">
    <cross-animation></cross-animation>
    <div class="LP_content">
      <div class="LP_header"><span>登录</span></div>
      <div class="LP_main f--h">
        <transition enter-active-class="animated bounceInLeft" appear>
          <div class="left flex-1">
            <div class="phone">
              <img src="../../../img/icon/code_animation.gif" />
            </div>
            <div class="code">
              <img src="../../../img/icon/code.png" />
            </div>
            <span>扫描二维码登录</span>
            <p>请使用<em>微信扫描</em></p>
          </div>
        </transition>
        <span class="line"></span>
        <transition enter-active-class="animated bounceInRight" appear>
          <div class="right flex-1">
            <div class="input_layer">
              <div class="error">{{accountError}}</div>
              <input class="phone br2" ref="account" type="text" placeholder="您的手机号/邮箱" />
            </div>
            <div class="input_layer">
              <div class="error">{{passwordError}}</div>
              <input class="password br2" ref="password" type="password" placeholder="密码" />
            </div>
            <div class="forget"><a class="ho_6">忘记密码?></a></div>
            <div class="code f--hlc">
              <div class="error">{{codeError}}</div>
              <input class="code br2" ref="code" type="text" placeholder="验证码" />
              <canvas id="code_canvas" width="112" height="32"></canvas>
              <span class="ho_6" v-on:click.stop="updateCode">换一张</span>
            </div>
            <label class="f--hlc">
              <input type="checkbox" ref="checkbox" />
              <p>记住我</p>
              <span>不是自己的电脑不要勾选此项</span>
            </label>
            <div class="btn_group f--hlc">
              <button class="br2 ho_6" v-on:click.stop="login">登录</button>
              <button class="br2 ho_6">注册</button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import crossAnimation from '../../_modules/cross_animation/cross_animation.vue'
  import Pub from '../../../js/public'
  export default {
    name: 'login_page',
    components: { crossAnimation },
    Pub,
    data () {
      return {
        vCode: null,
        accountError: '',
        passwordError: '',
        codeError: ''
      }
    },
    methods: {
      updateCode: function () {
        // 更新验证码
        this.vCode = Pub.createCode()
        console.log(this.vCode)
      },
      updateError: function (account, password, codeError) {
        if (account) this.accountError = account
        if (password) this.passwordError = password
        if (codeError) this.codeError = codeError
      },
      login: function () {
        // 登录功能
        let sendData = {
          username: this.$refs.account.value,
          password: this.$refs.password.value,
          remember_me: this.$refs.checkbox.checked
        }
        let code = this.$refs.code.value.toUpperCase()
        let isU = false
        let isP = false
        let isC = false

        // 判断账户
        if (sendData.username.length === 0) {
          isU = false
          this.updateError('请输入注册时用的邮箱或者手机号呀', false, false)
        } else if (!Pub.isTrueUser(sendData.username)) {
          isU = false
          this.updateError('喵，账户格式错误哦', false, false)
        } else {
          isU = true
          this.updateError(' ', false, false)
        }

        // 判断密码
        if (sendData.password.length === 0) {
          isP = false
          this.updateError(false, '喵，你没输入密码么？', false)
        } else {
          isP = true
          this.updateError(false, ' ', false)
        }

        // 验证码
        if (code.length === 0) {
          isC = false
          this.updateError(false, false, '喵，你没输入验证码么？')
        } else if (code !== this.vCode) {
          isC = false
          this.updateError(false, false, '喵，验证码不正确哦')
        } else {
          isC = true
          this.updateError(false, false, ' ')
        }

        if (isC && isP && isU) {
          let _self = this
          let errorTxt = ''
          let cabFuc = (data) => {
            switch (data.ret.retCode) {
              case '0000' :
                _self.updateError(' ', false, false)
                errorTxt = false
                break
              case '6978' :
                errorTxt = '账户或者密码错误'
                break
              case '6974' :
                errorTxt = '账户没激活，请前往邮箱激活账户'
                break
              case '6960' :
                errorTxt = '账户不存在'
                break
              default:
                errorTxt = data.ret.retError
            }
            if (errorTxt) {
              _self.updateError(errorTxt, false, false)
              Pub.globalPrompt('error', errorTxt)
            }
          }
          Pub.sendDataFuc(this, '/shop/user/toLogin.do', sendData, cabFuc)
        }
        // console.log(sendData, code, this.vCode)
      }
    },
    mounted: function () {
      this.updateCode()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/page/login";
</style>
