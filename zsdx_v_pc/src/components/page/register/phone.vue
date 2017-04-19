<template>
  <div class="RP_phone">
    <div class="RP_header"><span>注册</span></div>
    <div class="RP_content">
      <transition enter-active-class="animated bounceInRight" appear>
        <div class="input_layer phone">
          <div class="error">多少集啊放开手</div>
          <input class="br2" type="text" placeholder="输入您的手机号" />
        </div>
      </transition>

      <transition enter-active-class="animated bounceInRight" appear>
        <div class="input_layer password">
          <div class="error">多少集啊放开手</div>
          <ul class="safety_factor f--hlc">
            <li class="title">安全系数</li>
            <li class="color red"></li>
            <li class="color orange"></li>
            <li class="color yellow"></li>
            <li class="color blue"></li>
            <li class="color green"></li>
            <li class="factor green">安全</li>
          </ul>
          <input class="br2" type="password" placeholder="密码（6-16个字符组成，区分大小写）" />
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <div class="input_layer">
          <div class="error">多少集啊放开手</div>
          <input class="br2" type="number" placeholder="手机验证码" maxlength="6" />
          <button class="get_code active ho_6 br2">点击获取</button>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <div class="other f--hlc">
          <label class="f--hlc">
            <input type="checkbox" ref="checkbox" />
            <p>同意<a class="ho_6" href="#" target="_blank">服务条款</a></p>
          </label>
          <span class="flex-1"></span>
          <router-link class="ho_6" to="/register/mail">用邮箱注册></router-link>
        </div>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <button class="register_btn br2 ho_6">注册</button>
      </transition>

      <transition enter-active-class="animated bounceInLeft" appear>
        <router-link class="page_link ho_6" to="/login">已有账号，直接登录></router-link>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RP_phone',
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
