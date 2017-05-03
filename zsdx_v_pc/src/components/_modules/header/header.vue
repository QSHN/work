<template>
  <div class="page_header f--h">
    <nav class="header_nav f--hlc">
      <router-link class="logo ho_6" to="/"><img src="../../../img/icon/logo_green_w150.png"/></router-link>
      <router-link class="text ho_6" to="/">课程</router-link>
      <router-link class="text ho_6" to="/college">学院</router-link>
    </nav>

    <div class="search_layer f--hlc flex-1">
      <transition
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutLeft">
        <div class="open_btn_icon ho_6" v-show="isSearch"
             v-on:click.stop="ToggleSearchBox">
        </div>
      </transition>

      <transition
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutLeft">
        <div class="search_box br4 f--h" v-show="!isSearch">
          <div class="close_btn_icon ho_6" v-on:click.stop="ToggleSearchBox"></div>
          <input class="flex-1" type="text" placeholder="课程/教师/机构/院系/...">
          <div class="clear_btn_icon ho_6" v-on:click.stop="ToggleSearchBox"></div>
        </div>
      </transition>
    </div>

    <div class="header_right">
      <transition
        enter-active-class="animated bounceInRight"
        leave-active-class="animated bounceOutRight">
        <div class="login f--hlc" v-if="userInfo">
          <div class="icon message_icon f--hlc ho_6"><span>100</span></div>
          <div class="icon shop_icon f--hlc ho_6">
            <span>{{userInfo.carNum ? userInfo.carNum : ''}}</span>
          </div>
          <div class="menu">
            <p class="f--hlc">
              {{userInfo.nickName}}
              <span v-bind:class="[userInfo.identity == '01'
                      ? 's_icon' : userInfo.identity == '02' ? 't_icon' :'icon']">
              </span>
            </p>
            <div class="box_layer">
              <ul>
                <li>个人中心</li>
                <li>我的订单</li>
                <li>账户管理</li>
                <li v-on:click.stop="LoginToggle($event)">退出</li>
              </ul>
            </div>
            <span class="triangle"></span>
          </div>
          <button>我要开课</button>
        </div>
      </transition>

      <transition
        enter-active-class="animated bounceInRight"
        leave-active-class="animated bounceOutRight">
        <div class="logout f--hlc" v-if="!userInfo">
          <div class="menu">
            <p>登录/注册</p>
            <div class="box_layer">
              <ul>
                <li v-on:click.stop="RememberUrl">登录</li>
                <li><router-link to="/register/phone">创建帐户</router-link></li>
              </ul>
            </div>
          </div>
          <button>我要开课</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page_header',
    data () {
      this.$store.commit('USER_INFO', {type: 'get'})
      return {
        isSearch: true
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.Public.userInfo
      }
    },
    methods: {
      ToggleSearchBox: function () {
        this.isSearch = !this.isSearch
      },
      RememberUrl: function () {
        this.$store.commit('REMEMBER_URL', this.$route.path)
        this.$router.push('/login')
      }
    },
    mounted: function () {
      this.userInfo = this.$store.state.Public.userInfo
//      console.log(this.userInfo)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../style/page/_modules/header";
</style>
