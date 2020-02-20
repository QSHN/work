<template>
  <Modal
    v-model="modal"
    :title="`${type}汇率`"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="币别编码" prop="code">
        <Select v-model="formData.code" filterable @on-change="selectCode" style="width: 200px;">
          <Option v-for="item in getCurrencyList" :value="item.code" :key="item.code">{{ item.code }}（{{item.name}}）</Option>
        </Select>
      </FormItem>

      <FormItem label="汇率" prop="rate">
        <InputNumber :min="0" :step="0.1"
                     v-model="formData.rate"
                     style="width: 200px"></InputNumber>
      </FormItem>

      <FormItem label="生效日期" prop="effectiveDate">
        <DatePicker type="date" v-model="formData.effectiveDate" :options="options" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem label="失效日期" prop="expiryDate">
        <DatePicker type="date"
                    v-model="formData.expiryDate"
                    :options="expiryDate"
                    :placement="'top'"
                    :disabled="!formData.effectiveDate"
                    style="width: 200px"></DatePicker>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateExchangeRate } from '../../api/exchangeRate'
import moment from 'moment'
export default {
  name: 'currency',
  props: {
    rateList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modal: false,
      type: '',
      rate: 6,
      formData: {},
      formDataRule: {
        code: [
          { required: true, message: '币别编码不能为空', trigger: 'blur' }
        ],
        rate: [
          { required: true, message: '汇率不能为空', type: 'number', trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: '生效日期不能为空', type: 'date', trigger: 'blur' }
        ],
        expiryDate: [
          { required: true, message: '失效日期不能为空', type: 'date', trigger: 'blur' }
        ]
      },
      expiryDate: {},
      currencyList: [],
      options: {}
    }
  },
  computed: {
    getCurrencyList () {
      let list = this.currencyList.filter(v => {
        let fList = this.rateList.filter(f => f.typeId === this.formData.typeId)
        return !fList.find(f => f.currencyId === v._id && f.currencyId !== this.formData.currencyId)
      })
      return list
    }
  },
  watch: {
    formData: {
      handler () {
        if (this.moment(this.formData.expiryDate).isBefore(this.formData.effectiveDate)) {
          this.formData.expiryDate = this.formData.effectiveDate
          let self = this
          this.expiryDate = {
            disabledDate (date) {
              return self.moment(date.valueOf()).isBefore(self.formData.effectiveDate)
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    moment,
    show (type, data, rate, currencyList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        currencyId: '',
        rate: 1,
        effectiveDate: moment().format('YYYY-MM-DD'),
        expiryDate: moment().format('YYYY-MM-DD'),
        auditId: null,
        status: '启用'
      }, addObj)
      this.rate = rate
      this.currencyList = currencyList
      if (data) {
        this.formData.effectiveDate = moment(this.formData.effectiveDate).format('YYYY-MM-DD')
        this.formData.expiryDate = moment(this.formData.expiryDate).format('YYYY-MM-DD')
        let expiryDate = moment(this.formData.expiryDate).valueOf()
        this.options = {
          disabledDate (date) {
            return date && date.valueOf() < expiryDate + 86400000
          }
        }
      } else {
        this.options = {
          disabledDate () {
            return false
          }
        }
      }
      this.$forceUpdate()
    },
    cancel () {
      this.modal = false
      this.type = ''
      this.rate = 6
      this.$refs.formData.resetFields()
    },
    sure () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          updateExchangeRate(this.formData).then(res => {
            this.$Notice.success({
              title: '汇率',
              desc: `成功${this.type}汇率`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '汇率',
              desc: err.message
            })
          })
        }
      })
    },
    selectCode (value) {
      if (value) {
        let cData = this.currencyList.find(v => v.code === value)
        this.formData.currencyId = cData ? cData._id : null
      }
    }
  }
}
</script>

<style lang="less">

</style>
