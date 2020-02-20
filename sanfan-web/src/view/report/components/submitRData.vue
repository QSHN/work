<template>
  <Modal v-model="modal"
         width="500"
         title="提交汇报"
         :loading="isCommit"
         @on-ok="ok"
         @on-cancel="cancel">
    <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="150">
      <template v-if="reportTemplate && reportTemplate.items">
        <FormItem v-for="(v, i) in reportTemplate.items" :key="i" :label="`${v.name}（${v.unit}）：`" :prop="'report' + i">
          <Input v-model="formData['report' + i]" style="width: 200px"></Input>
        </FormItem>
      </template>
      <template v-else>请联系部门管理员添加部门数据汇报模板</template>
    </Form>
  </Modal>
</template>

<script>
import { submitReport } from '@/api/report.js'
import { mapGetters } from 'vuex'
export default {
  name: 'submitRData',
  props: {
    reportTemplate: {
      type: Object
    }
  },
  data () {
    return {
      modal: false,
      isCommit: true,
      formData: {},
      ruleValidate: {},
      isInit: true
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  methods: {
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    show (data) {
      if (this.reportTemplate && this.reportTemplate.items) {
        this.formData = {}
        this.ruleValidate = {}
        this.reportTemplate.items.forEach((v, i) => {
          this.formData['report' + i] = data ? data.items[i].value : ''
          this.ruleValidate['report' + i] = [
            {
              required: true,
              message: '请输入正确的数据，仅限数字',
              trigger: 'blur',
              type: 'number',
              transform (value) { return Number(value) },
              validator: (rule, value, callback) => {
                if (!/[0-9]/.test(this.formData['report' + i]) && !this.isInit) {
                  callback(new Error('请输入正确的数据，仅限数字'))
                } else {
                  callback()
                }
              }
            }
          ]
        })
        if (data) this.formData.id = data.id
        this.$forceUpdate()
      }
      this.modal = true
      this.$nextTick(() => { this.isInit = false })
    },
    ok () {
      if (!this.reportTemplate || !this.reportTemplate.items.length) {
        this.cancel()
        return
      }
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // console.log(this.formData)
          let sendData = {
            templateId: this.reportTemplate.id
          }
          if (this.formData.id) sendData.id = this.formData.id
          let items = []
          this.reportTemplate.items.map((v, i) => {
            items.push({
              templateItemId: v.id,
              value: this.formData['report' + i]
            })
          })
          sendData.items = items
          submitReport(sendData).then((res) => {
            console.log('submitReport', res.data)
            this.$emit('update')
            this.cancel()
          }).catch((err) => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
              this.changeStatus()
            }
          })
        } else {
          this.changeStatus()
        }
      })
    },
    cancel () {
      this.$refs.formValidate.resetFields()
      this.changeStatus()
      this.formData = {}
      this.ruleValidate = {}
      this.modal = false
      this.isInit = true
    }
  }
}
</script>

<style scoped>

</style>
