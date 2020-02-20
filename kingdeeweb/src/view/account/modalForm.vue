<template>
  <Modal
    v-model="modal"
    :title="`${type}用户`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="userForm" :model="formData" :rules="userFormRule" :label-width="100" style="margin-top: 10px;">
      <FormItem label="登录账号" prop="account">
        <Input v-model="formData.account" placeholder="仅限手机号" style="width: 300px"/>
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input v-model="formData.password" placeholder="默认初始密码：123456" type="password" style="width: 300px"/>
      </FormItem>

      <FormItem label="姓名" prop="name">
        <Input v-model="formData.name" style="width: 300px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { register } from '../../api/user'
export default {
  name: 'modalForm',
  data () {
    return {
      modal: false,
      type: '新建',
      formData: {},
      userFormRule: {
        account: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value || !/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'))
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
              if (!value) {
                callback()
              } else if (value && value.length < 6) {
                callback(new Error('密码必须大于6位'))
              } else {
                callback()
              }
            }
          }
        ],
        name: [
          { required: true, message: '姓名必填', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'myUser'
    ])
  },
  watch: {
  },
  methods: {
    show (type, data = null) {
      this.type = type
      this.formData = data ? Object.assign({}, data) : {
        account: '',
        password: '',
        name: '',
        accountStatus: '正常',
        accountType: '套账账户',
        role: 'accountSet',
        companyId: this.myUser.companyId
      }
      this.$refs.userForm.resetFields()
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    sure () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          register(this.formData).then(res => {
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '用户管理',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.accountant,
.accountant_table {
  height: 280px;
  overflow: auto;
  border: 1px solid #ccc;
  margin-top: 10px;
  list-style: none;

  li {
    height: 26px;
    line-height: 26px;
    line-height: 26px;
    padding-left: 10px;
    cursor: pointer;

    &:hover {
      background: #f8f8f8;
    }
    &.active {
      color: #2d8cf0;
    }
  }
}
.accountant_table {
  li {
    display: flex;
    flex-direction: row;
    padding-left: 0;

    &:nth-child(1) {
      background: #f8f8f8;
    }
    &:hover {
      background: none;
    }

    span {
      text-align: center;

      &:nth-child(1) {
        width: 40%;
        background: #f8f8f8;
      }
      &:nth-child(2) {
        flex-grow: 1;
      }
    }
  }
}
</style>
