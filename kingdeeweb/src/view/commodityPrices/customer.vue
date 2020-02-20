<template>
  <Modal
    v-model="modal"
    :title="`${type}客户价格策略`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="价格策略代码" prop="code">
        <Input v-model="formData.code" style="width: 250px" />
      </FormItem>

      <FormItem label="价格策略名称" prop="name">
        <Input v-model="formData.name" style="width: 250px" />
      </FormItem>

      <FormItem label="客户价格策略组" prop="type">
        <Select v-model="formData.type" filterable style="width: 250px;">
          <Option value="按客户设置">按客户设置</Option>
          <Option value="按客户等级设置" :disabled="true">按客户等级设置</Option>
          <Option value="按客户类别设置" :disabled="true">按客户类别设置</Option>
        </Select>
      </FormItem>

      <FormItem label="备注">
        <Input v-model="formData.des" style="width: 250px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { customerPricesUpdate } from '../../api/commodityPrices'
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
                callback(new Error('价格策略编码不能为空'))
              } else if (this.oldData.code !== value && this.customerList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该价格策略编码，不能重复'))
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
                callback(new Error('价格策略名称不能为空'))
              } else if (this.oldData.name !== value && this.customerList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该价格策略名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        type: [
          { required: true, message: '客户分组方式不能为空', trigger: 'blur' }
        ]
      },
      customerList: []
    }
  },
  methods: {
    show (type, data, customerList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: null,
        name: null,
        type: '按客户设置',
        status: '禁用',
        des: null,
        useUser: [],
        prices: {
          commodity: [],
          category: []
        },
        endTime: null,
        startTime: null
      }, addObj)
      if (data) this.oldData = data
      this.customerList = customerList
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
          customerPricesUpdate(this.formData).then(res => {
            this.$Notice.success({
              title: '客户价格策略',
              desc: `成功${this.type}客户价格策略`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '客户价格策略',
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
