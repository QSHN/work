<template>
  <Modal
    v-model="modal"
    :title="`${type}APP`"
    :mask-closable="false"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="版本号" prop="code">
        <Input v-model="formData.code" style="width: 250px" />
      </FormItem>

      <FormItem label="内部版本号" prop="internalCode">
        <InputNumber v-model="formData.internalCode" style="width: 250px" />
      </FormItem>

      <FormItem label="版本内容" prop="content">
        <Input v-model="formData.content" style="width: 250px" />
      </FormItem>

      <FormItem label="发布时间" prop="time">
        <DatePicker type="date" v-model="formData.time" :start-date="new Date()" style="width: 250px"></DatePicker>
      </FormItem>

      <FormItem label="强制更新">
        <i-switch v-model="formData.isUpdate" />
      </FormItem>

      <FormItem label="启用">
        <i-switch v-model="formData.status" />
      </FormItem>

      <FormItem label="下载链接" prop="down">
        <Input v-model="formData.down" style="width: 250px" />
      </FormItem>

      <FormItem label="md5" prop="md5">
        <Input v-model="formData.md5" style="width: 250px" />
      </FormItem>

      <FormItem label="APP大小" prop="size">
        <InputNumber :step="0.1" v-model="formData.size" style="width: 250px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateApp } from '../../api/user'
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
                callback(new Error('版本号不能为空'))
              } else if (this.oldData.code !== value && this.appList.filter(v => v.code === value.trim()).length) {
                callback(new Error('已存在该版本号，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        internalCode: [
          {
            required: true,
            trigger: 'blur',
            type: 'number',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('内部版本号不能为空'))
              } else if (this.oldData.internalCode !== value && this.appList.filter(v => v.internalCode === value).length) {
                callback(new Error('已存在该内部版本号，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        content: [
          { required: true, trigger: 'blur', message: '版本内容不能为空' }
        ],
        time: [
          { required: true, type: 'date', trigger: 'change', message: '发布时间不能为空' }
        ],
        down: [
          { required: true, trigger: 'blur', message: '下载链接不能为空' }
        ],
        md5: [
          { required: true, trigger: 'blur', message: 'md5不能为空' }
        ],
        size: [
          { required: true, type: 'number', trigger: 'blur', message: 'app大小不能为空' }
        ]
      },
      appList: []
    }
  },
  methods: {
    show (type, data, appList) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        internalCode: null,
        content: '',
        time: null,
        isUpdate: false,
        status: false,
        down: null,
        md5: '',
        size: null
      })
      if (data) this.oldData = data
      this.appList = appList
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
          updateApp(formData).then(res => {
            this.$Notice.success({
              title: `${this.type}APP`,
              desc: `成功${this.type}APP`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: `${this.type}APP`,
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
