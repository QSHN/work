<template>
  <div class="page_header f--h">
    <nav class="header_nav f--hlc">
      <a class="logo ho_6" href="/"><img src="../../_img/icon/logo_green_w150.png"/></a>
      <a class="text ho_6" href="/">课程</a>
      <a class="text ho_6" href="/">学院</a>
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
        <div class="search_box br2" v-show="!isSearch">
          <div class="close_btn_icon"></div>
          <input type="text">
          <div class="clear_btn_icon"></div>
        </div>
      </transition>
    </div>

    <div class="header_right">
      <div class="login" v-if="isLogin">45145</div>
      <div class="logout" v-else>
        <div class="box_layer">
          <p>登录/注册</p>
          <ul>
            <li>登录</li>
            <li>创建帐户</li>
          </ul>
        </div>
        <button>我要开课</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page_header',
    data () {
      return {
        isSearch: true,
        isLogin: false
      }
    },
    methods: {
      ToggleSearchBox: function () {
        this.isSearch = !this.isSearch
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .page_header{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: 69px;
    padding-left: 8.4375%;

    .header_nav{
      height: 69px;

      a{
        display: block;
      }

      img{
        width: 150px;
        height: 37px;
      }

      .logo{
        width: 150px;
        height: 37px;
        margin-right: 15px;
      }

      .text{
        font-size: 18px;
        font-weight: bold;
        color: #000;
        padding: 0 15px;
      }
    }

    .search_layer{
      margin-left: 15px;
      overflow: hidden;

      .open_btn_icon{
        width: 16px;
        height: 16px;
        background: url("../../_img/icon/seach_black_w16.png") no-repeat;
        cursor: pointer;
      }

      .search_box{
        width: 453px;
        height: 38px;
        border: 1px solid #8d8b94;
      }
    }
  }
</style>
