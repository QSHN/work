<template>
  <Modal
    v-model="modal"
    :title="`${type}银行联行号`"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="银行">
        <Select v-model="formData.bankId" filterable style="width: 250px;">
          <OptionGroup v-for="(v, i) in bankGroup" :label="v.name" :key="i">
            <Option v-for="item in v.children" :value="item.id" :key="item.id">{{ item.id }}（{{item.name}}）</Option>
          </OptionGroup>
        </Select>
      </FormItem>
      <FormItem label="省">
        <Select v-model="formData.province" filterable style="width: 250px;">
          <Option v-for="item in province" :value="item.title" :key="item.code">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="县/市">
        <Select v-model="formData.city" filterable style="width: 250px;" :disabled="!formData.province">
          <Option v-for="item in cityList" :value="item.city" :key="item.code">{{ item.city }}</Option>
        </Select>
      </FormItem>
      <FormItem label="联行号" prop="linkNumber">
        <Input v-model="formData.linkNumber" style="width: 250px" />
      </FormItem>

      <FormItem label="开户行" prop="bankDeposit">
        <Input v-model="formData.bankDeposit" style="width: 250px" />
      </FormItem>

      <FormItem label="地址">
        <Input v-model="formData.address" style="width: 250px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateBank } from '../../api/bank'
import { bankGroup } from '../../libs/bank'
// import { province, city } from '../../libs/province'
export default {
  name: 'currency',
  data () {
    return {
      bankGroup,
      province: [],
      city: [],
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      formDataRule: {
        linkNumber: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('联行号不能为空'))
              } else if (this.oldData.linkNumber !== value && this.bankList.filter(v => v.linkNumber.trim() === value.trim()).length) {
                callback(new Error('已存在该联行号，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        bankDeposit: [
          { required: true, message: '开户行不能为空', trigger: 'blur' }
        ]
      },
      bankList: []
    }
  },
  computed: {
    cityList () {
      let list
      if (this.formData.province) {
        list = this.city.filter(v => v.pCity === this.formData.province)
      } else {
        list = this.city
      }
      return list
    }
  },
  methods: {
    show (type, data, bankList, accountSetId) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        bankId: '',
        bank: '',
        province: '',
        city: '',
        linkNumber: '',
        bankDeposit: '',
        address: '',
        status: '启用'
      }, accountSetId)
      if (data) this.oldData = data
      this.bankList = bankList
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
          let data = Object.assign({}, this.formData)
          this.bankGroup.forEach(v => {
            if (v.id === data.bankId) {
              data.bank = v.name
            }
            if (v.children) {
              v.children.forEach(v1 => {
                if (v1.id === data.bankId) {
                  data.bank = v1.name
                }
              })
            }
          })
          if (!data.city) data.city = ''
          updateBank(data).then(res => {
            this.$Notice.success({
              title: '银行联行号',
              desc: `成功${this.type}银行联行号`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '银行联行号',
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
