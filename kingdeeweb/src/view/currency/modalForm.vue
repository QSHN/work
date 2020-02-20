<template>
  <Modal
    v-model="modal"
    :title="`${type}用户组`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="币别编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" :disabled="!formData.isEdit" />
      </FormItem>

      <FormItem label="币别名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" :disabled="!formData.isEdit" />
      </FormItem>

      <FormItem label="记账汇率">
        <InputNumber :min="0" :step="0.1" v-model="formData.rate" :disabled="!formData.isEdit"></InputNumber>
      </FormItem>

      <FormItem label="折算方式">
        <RadioGroup v-model="formData.convert">
          <Radio label="multi">
            <span>原币 * 汇率 = 本位币</span>
          </Radio>
          <Radio label="divide">
            <span>原币 / 汇率 = 本位币</span>
          </Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="金额小数位数">
        <InputNumber :min="0" v-model="formData.float"></InputNumber>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { currencyUpdate } from '../../api/currency'
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
                callback(new Error('币别编码不能为空'))
              } else if (this.oldData.code !== value && this.currencyList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该币别编码，不能重复'))
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
                callback(new Error('币别名称不能为空'))
              } else if (this.oldData.name !== value && this.currencyList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该币别名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      currencyList: []
    }
  },
  methods: {
    show (type, data, currencyList, accountSetId) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : {
        accountSetId,
        code: '',
        name: '',
        rate: 1,
        convert: 'multi',
        float: 2,
        status: '启用',
        isEdit: true
      }
      if (data) this.oldData = data
      this.currencyList = currencyList
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
          currencyUpdate(this.formData).then(res => {
            this.$Notice.success({
              title: '币别',
              desc: `成功${this.type}币别：${this.formData.name}`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '币别',
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
