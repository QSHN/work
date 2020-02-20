<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :isRegister="isRegister"></login-form>
          <p :class="{'login_tip': true, active: tip.length}">{{tip || '欢迎登陆小牛外勤财务系统'}}</p>
        </div>

        <!--<span slot="extra" class="register_btn" @click="isRegister = !isRegister">{{isRegister ? '注册' : '登录'}}</span>-->
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
      isRegister: true
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
          let access = [user.accountType]
          this.$store.commit('setAccess', access)
          this.$store.commit('setTagNavList', [])
          this.$store.dispatch('getUserList', { companyId: user.companyId })
          if (user.useAccountSet) {
            this.$store.dispatch('getUserPermission', {
              accountSetId: user.useAccountSet,
              userId: user._id
            })
            this.$store.dispatch('getGroupList', { accountSetId: user.useAccountSet })
            this.$router.push({
              name: 'accountSetIndex'
            })
          } else {
            this.$router.push({
              name: 'accountSetIndex'
            })
          }
        })
      }).catch(err => {
        this.$Notice.error({
          title: '登录出错',
          desc: err.message
        })
      })
    },
    handleSubmit ({ userName, password }) {
      // console.log(userName, password)
      if (this.isRegister) {
        // 登录
        this.login(userName, password)
      } else {
        // 注册
        register({
          account: userName,
          password,
          accountStatus: '正常',
          accountType: '总账户',
          role: 'admin'
        }).then(res => {
          this.login(userName, password)
        }).catch(err => {
          let message = err.message.includes('dup key') ? '已存在该账户，无法注册' : err.message
          this.$Notice.error({
            title: '注册出错',
            desc: message
          })
        })
      }
    }
  }
}
</script>

<style>

</style>
