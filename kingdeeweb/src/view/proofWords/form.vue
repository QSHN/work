<template>
  <Modal
    v-model="modal"
    :title="`${type}凭证字`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="凭证字" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
      </FormItem>
      <FormItem label="打印标题">
        <Input v-model="formData.printTitle" style="width: 200px" />
      </FormItem>
      <FormItem label="是否默认">
        <RadioGroup v-model="formData.defaultValue" style="margin-left: 5px;">
          <Radio label="是"></Radio>
          <Radio label="否"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateProofWords } from '../../api/proofWords'
export default {
  name: 'currency',
  data () {
    return {
      modal: false,
      type: '',
      oldData: {},
      formData: {},
      formDataRule: {
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('凭证字不能为空'))
              } else if (this.oldData.name !== value && this.wordsList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该凭证字，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      wordsList: []
    }
  },
  methods: {
    show (type, data, wordsList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        name: '',
        printTitle: '记账凭证',
        defaultValue: '否'
      }, addObj)
      if (data) this.oldData = data
      this.wordsList = wordsList
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
          updateProofWords(this.formData).then(res => {
            this.$Notice.success({
              title: '凭证字',
              desc: `成功${this.type}凭证字`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '凭证字',
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
