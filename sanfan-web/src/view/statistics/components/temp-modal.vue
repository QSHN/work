<template>
  <Modal
    v-model="modal"
    width="350"
    :title="title"
    :loading="isCommit"
    :mask-closable="false"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="100">
      <FormItem label="数据名称：" prop="name">
        <Input v-model="formData.name" style="width: 180px" placeholder="请填写数据名称"></Input>
      </FormItem>
      <FormItem label="数据单位：" prop="unit">
        <Input v-model="formData.unit" style="width: 180px" placeholder="请填写数据单位"></Input>
      </FormItem>
      <FormItem label="达标值：" prop="target">
        <Input v-model="formData.target" style="width: 180px" placeholder="请输入达标值"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: 'temp-modal',
  data () {
    return {
      title: '',
      modal: false,
      isCommit: true,
      formData: {
        name: '',
        unit: '',
        target: '',
        ratingSettings: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写数据名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请填写数据单位', trigger: 'blur' }
        ],
        target: [
          {
            required: true,
            trigger: 'blur',
            type: 'number',
            transform (value) { return Number(value) },
            validator: (rule, value, callback) => {
              if (!value || (value && value <= 0)) {
                callback(new Error('请输入正确达标值'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      updateFun: null
    }
  },
  methods: {
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    show (data, cb) {
      if (data) {
        this.formData = Object.assign({}, data)
        this.title = '修改数据项目'
      } else {
        this.title = '添加数据项目'
      }
      if (cb) this.updateFun = cb
      this.$forceUpdate()
      this.modal = true
    },
    ok () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          if (this.updateFun) this.updateFun(Object.assign({}, this.formData))
          this.cancel()
        } else {
          this.changeStatus()
        }
      })
    },
    cancel () {
      this.formData = {
        name: '',
        unit: '',
        target: '',
        ratingSettings: []
      }
      this.$refs.formValidate.resetFields()
      this.modal = false
      this.changeStatus()
    }
  }
}
</script>

<style scoped>

</style>
