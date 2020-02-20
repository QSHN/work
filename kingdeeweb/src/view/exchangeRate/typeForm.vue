<template>
  <Modal
    v-model="modal"
    :title="`${type}汇率类型`"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" />
      </FormItem>

      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
      </FormItem>

      <FormItem label="汇率精度" prop="rate">
        <InputNumber :min="0" v-model="formData.rate"></InputNumber>
      </FormItem>

      <FormItem label="备注">
        <Input v-model="formData.des"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 200px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateExchangeRateType } from '../../api/exchangeRate'
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
                callback(new Error('编码不能为空'))
              } else if (this.oldData.code !== value && this.typeList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该编码，不能重复'))
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
                callback(new Error('名称不能为空'))
              } else if (this.oldData.name !== value && this.typeList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        rate: [
          { required: true, message: '汇率精度不能为空', type: 'number', trigger: 'blur' }
        ]
      },
      typeList: []
    }
  },
  methods: {
    show (type, data, typeList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        rate: 6,
        des: ''
      }, addObj)
      if (data) this.oldData = data
      this.typeList = typeList
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
          updateExchangeRateType(this.formData).then(res => {
            this.$Notice.success({
              title: '汇率类型',
              desc: `成功${this.type}汇率类型`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '汇率类型',
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
