<template>
  <Modal
    v-model="modal"
    :title="`${type}结算方式`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" />
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
      </FormItem>
      <FormItem label="借方必有">
        <Input v-model="formData.subject" style="width: 200px" readonly />
        <Button type="default" style="margin-left: 10px;" @click="selectSubject('borrowerShall')">选择</Button>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>

    <subject ref="subject" />
  </Modal>
</template>

<script>
import { updateClearingForm } from '../../api/clearingForm'
import subject from '../../components/subject/index'
export default {
  name: 'currency',
  components: {
    subject
  },
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
              } else if (this.oldData.code !== value && this.clearList.filter(v => v.code.trim() === value.trim()).length) {
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
              } else if (this.oldData.name !== value && this.clearList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      clearList: []
    }
  },
  methods: {
    show (type, data, clearList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        subject: '',
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
      this.clearList = clearList
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
          updateClearingForm(this.formData).then(res => {
            this.$Notice.success({
              title: '结算方式',
              desc: `成功${this.type}结算方式`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '结算方式',
              desc: err.message
            })
          })
        }
      })
    },
    selectSubject () {
      this.$refs.subject.show(value => {
        this.formData.subject = value
      })
    }
  }
}
</script>

<style lang="less">

</style>
