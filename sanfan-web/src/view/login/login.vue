<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :isLoading="isLoading"></login-form>
          <p class="login-tip">欢迎来到三帆外勤网页端 <a @click="registerShow">注册</a></p>
        </div>
      </Card>
    </div>
    <RegisterForm v-model="register" v-if="isLoadCity"></RegisterForm>
    <div v-if="company.show" class="bg_con" @click="company.show=false"></div>
    <div v-if="company.show" class="companyList">
      <div class="title">
        请选择登陆企业
      </div>
      <div class="list_con">
        <div>
          <div v-for="(item,index) in company.list" @click="companySelect(item)" :class="{noPass:!item.status}" :key="index" class="list_item">{{item.companyName}}</div>
        </div>
        <div @click="company.select=null;company.show=false" class="close_bt">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import RegisterForm from '_c/register-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm,
    RegisterForm
  },
  data () {
    return {
      register: false,
      isLoadCity: false,
      isLoading: false,
      login: {
        userName: '',
        password: ''
      },
      company: {
        show: false,
        list: [],
        select: null
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    registerShow () {
      this.isLoadCity = true
      this.$nextTick(() => {
        this.register = true
      })
    },
    companySelect (item) {
      this.company.select = item.companyId
      this.company.show = false
      this.handleSubmit(this.login)
    },
    handleSubmit ({ userName, password }) {
      this.isLoading = true
      this.login.userName = userName
      this.login.password = password
      let companyId
      if (this.company.select) {
        companyId = this.company.select
        this.company.select = null
      }
      this.handleLogin({ userName, password, companyId }).then(res => {
        Promise.all([
          this.$store.dispatch('getUserInfo'),
          this.$store.dispatch('getCompany')
        ]).then(([userInfo, company, personal]) => {
          const access = userInfo.permissions.map(v => v.code)
          access.push(userInfo.role)
          this.$store.commit('setAccess', access)
          this.isLoading = false
          this.$router.push({
            name: this.$config.homeName
          })
        })
      }).catch(err => {
        this.isLoading = false
        if (err.errorCode === '1016') {
          this.company.list = err.arguments
          this.company.show = true
          this.$Spin.hide()
          return
        }
        if (err.errorCode) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.errorMsg
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
  .bg_con{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .companyList{
    width: 80%;
    max-width: 400px;
    height: 250px;
    z-index: 2;
    border-radius: 2px;
    background-color: white;
    overflow: hidden;
    border: 1px solid #dcdcdc;
    /*box-shadow: darkgrey 0px 0px 16px 1px ;*/
    position: absolute;
    margin: auto;
    left: 0;right: 0;top: 0;bottom: 0;
    .title{
      color: #a6a6a6;
      line-height: 49px;
      text-align: center;
      background-color: white;
      font-size: 16px;
      border-bottom: 1px solid #dcdcdc;
    }
    .list_con{
      background-color: #e6e6e6;
      height: 150px;
      overflow-y: auto;
    }
    .list_item{
      background-color: white;
      cursor: pointer;
      color: #4b4b4b;
      font-size: 17px;
      text-align: center;
      width: 100%;
      line-height: 49px;
      border-bottom: 1px solid #dcdcdc;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      position: relative;
    }
    .noPass{
      background-color: #f9f9f9;
      color: #ff4d31;
    }
    .close_bt{
      cursor: pointer;
      width: 100%;
      position: absolute;
      bottom: 0px;
      line-height: 49px;
      text-align: center;
      border-top: 1px solid #dcdcdc;
    }
  }
</style>
