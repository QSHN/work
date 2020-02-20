<template>
  <Modal
    v-model="modal"
    :title="`${type}银行账号`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="500"
    height="1250"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="账户编码" prop="code">
        <Input v-model="formData.code" style="width: 250px" />
      </FormItem>

      <FormItem label="账户名称" prop="name">
        <Input v-model="formData.name" style="width: 250px" />
      </FormItem>

      <FormItem label="开户名" style="margin-bottom: 10px">
        <Input v-model="formData.accountName" style="width: 250px" />
      </FormItem>

      <FormItem label="银行账号" style="margin-bottom: 10px">
        <Input v-model="formData.bankAccount" style="width: 250px" />
      </FormItem>

      <FormItem label="币别" style="margin-bottom: 10px">
        <Select v-model="formData.currency" style="width: 250px">
          <Option v-for="(v, i) in currencyList" :key="i" :value="v.name">{{v.name}}</Option>
        </Select>
      </FormItem>

      <FormItem label="开户行" style="margin-bottom: 10px">
        <Input v-model="formData.openingBank" style="width: 250px" />
      </FormItem>

      <FormItem label="备注" style="margin-bottom: 10px">
        <Input v-model="formData.des" style="width: 250px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure" v-if="!(type === '修改' && formData.isEdit)">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateBankAccount } from '../../api/bankAccount'
import { currencyQuery } from '../../api/currency'
export default {
  name: 'currency',
  data () {
    return {
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('账户编码不能为空'))
              } else if (this.oldData.code !== value && this.bankAccountList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该账户编码，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('账户名称不能为空'))
              } else if (this.oldData.name !== value && this.bankAccountList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该账户名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      bankAccountList: [],
      currencyList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCurrency()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    },
    show (type, data, bankAccountList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: null,
        name: null,
        accountName: null,
        bankAccount: null,
        currency: '人民币',
        openingBank: null,
        des: null,
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
      this.bankAccountList = bankAccountList
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
          updateBankAccount(this.formData).then(res => {
            this.$Notice.success({
              title: '银行账号',
              desc: `成功${this.type}银行账号`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '银行账号',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
