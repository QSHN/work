<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" :placeholder="isRegister ? '请输入用户名' : '请输入手机号码'">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>{{isRegister ? '登录' : '注册'}}</Button>
    </FormItem>
  </Form>
</template>
<script>
import { validatePassCheck, validatePhoneCheck } from '../../libs/validate'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    phoneRules: {
      type: Array,
      default: () => {
        return [
          { validator: validatePhoneCheck, trigger: 'blur' }
        ]
      }
    },
    passwordRegisterRules: {
      type: Array,
      default: () => {
        return [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    },
    passwordLoginRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    isRegister: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: !this.isRegister ? this.phoneRules : this.userNameRules,
        password: !this.isRegister ? this.passwordRegisterRules : this.passwordLoginRules
      }
    }
  },
  watch: {
    isRegister () {
      this.form = {
        userName: '',
        password: ''
      }
      this.$refs.loginForm.resetFields()
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
        }
      })
    }
  }
}
</script>
