<template>
  <Modal
    v-model="modal"
    :title="`${type}销售员`"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="账号" prop="account">
        <Input v-model="formData.account" style="width: 250px" />
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input type="password" v-model="formData.password" style="width: 250px" />
      </FormItem>

      <FormItem label="确认密码" prop="confirmPassword">
        <Input type="password" v-model="formData.confirmPassword" style="width: 250px" />
      </FormItem>

      <FormItem label="姓名" prop="name">
        <Input v-model="formData.name" style="width: 250px" />
      </FormItem>

      <FormItem label="邮箱">
        <Input v-model="formData.email" style="width: 250px" />
      </FormItem>

      <FormItem label="手机" prop="phone">
        <Input v-model="formData.phone" style="width: 250px" />
      </FormItem>

      <FormItem label="性别">
        <Select v-model="formData.gender" style="width: 250px">
          <Option v-for="(v, i) in ['男', '女']" :value="v" :key="i">{{ v }}</Option>
        </Select>
      </FormItem>

      <FormItem label="职位">
        <Select v-model="formData.clerkId" @on-change="selectClerk"  style="width: 250px">
          <Option v-for="(v, i) in clickList" :value="v._id" :key="i">{{ v.name }}</Option>
        </Select>
      </FormItem>

      <FormItem label="上级">
        <Select v-model="formData.parentsId"  style="width: 250px">
          <Option v-for="(v, i) in userList" :value="v._id" :key="i">{{ v.name }}</Option>
        </Select>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { register, updateUser } from '../../api/user'
export default {
  name: 'currency',
  props: {
    clickList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      formDataRule: {
        account: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('账号不能为空'))
              } else if (this.oldData.account !== value && this.userList.filter(v => v.account.trim() === value.trim()).length) {
                callback(new Error('已存在该账号，不能重复'))
              } else if (value === 'root') {
                callback(new Error('已存在该账号，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        password: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value && this.type === '修改') {
                callback()
              } else if (value.length < 6) {
                callback(new Error('密码必须大于6位'))
              } else {
                callback()
              }
            }
          }
        ],
        confirmPassword: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.formData.password && !value) {
                callback()
              } else if (this.formData.password !== value) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            }
          }
        ],
        name: [
          { required: true, trigger: 'blur', message: '姓名不能为空' }
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('手机号不能为空'))
              } else if (this.oldData.phone !== value && this.userList.filter(v => v.phone.toString() === value.trim()).length) {
                callback(new Error('已存在该手机号，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      userList: []
    }
  },
  methods: {
    show (type, data, userList) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        account: '',
        password: '',
        confirmPassword: '',
        city: '',
        name: '',
        email: '',
        phone: '',
        parentsId: null,
        clerkId: null,
        clerk: null,
        gender: '男',
        accountStatus: '正常',
        role: 'salesman'
      })
      if (data) this.oldData = data
      this.userList = userList
      this.$forceUpdate()
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.oldData = {}
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let formData = Object.assign({}, this.formData)
          delete formData.confirmPassword
          let update = this.type === '新建' ? register : updateUser
          update(formData).then(res => {
            this.$Notice.success({
              title: `${this.type}销售员`,
              desc: `成功${this.type}销售员`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: `${this.type}销售员`,
              desc: err.message
            })
          })
        }
      })
    },
    selectClerk (id) {
      let fData = this.clickList.find(f => f._id === id)
      if (fData) this.formData.clerk = fData.name
    }
  }
}
</script>

<style lang="less">

</style>
