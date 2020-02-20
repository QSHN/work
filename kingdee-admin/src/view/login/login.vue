<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p :class="{'login_tip': true, active: tip.length}">{{tip || '欢迎登陆小牛外勤财务系统'}}</p>
        </div>

        <span slot="extra" class="register_btn" v-if="isRegister" @click="handleSubmit">注册</span>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LoginForm from '_c/login-form'
import { register } from '@/api/user'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      tip: '',
      isRegister: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    login (userName, password) {
      this.handleLogin({ userName, password }).then(res => {
        Promise.all([
          this.$store.dispatch('getUser')
        ]).then(([user]) => {
          let access = [user.role]
          this.$store.commit('setAccess', access)
          this.$router.push({
            name: 'home'
          })
        })
      }).catch(err => {
        this.$Notice.error({
          title: '登录出错',
          desc: err.message
        })
      })
    },
    handleSubmit ({ userName, password }) {
      if (this.isRegister) {
        register({
          account: 'root',
          password: 'root',
          name: 'root',
          accountStatus: '正常',
          role: 'admin'
        }).then(res => {
          this.login('root', 'root')
        }).catch(err => {
          let message = err.message.includes('dup key') ? '已存在该账户，无法注册' : err.message
          this.$Notice.error({
            title: '注册出错',
            desc: message
          })
        })
      } else {
        this.login(userName, password)
      }
    }
  }
}
</script>

<style>

</style>
