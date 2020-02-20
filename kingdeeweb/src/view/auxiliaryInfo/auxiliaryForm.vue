<template>
  <Modal
    v-model="modal"
    :title="`${type}辅助资料`"
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

      <FormItem label="辅助资料组" prop="groupId">
        <Select v-model="formData.groupId" filterable style="width: 200px;">
          <Option v-for="item in groupList" :value="item._id" :key="item._id">{{ item.name }}</Option>
        </Select>
      </FormItem>

      <FormItem label="备注">
        <Input v-model="formData.des" style="width: 200px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateAuxiliaryInfo } from '../../api/auxiliaryInfo'
export default {
  name: 'currency',
  props: {
    groupList: Array
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
                callback(new Error('辅助资料编码不能为空'))
              } else if (this.oldData.code !== value && this.auxiliaryList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该辅助资料编码，不能重复'))
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
                callback(new Error('辅助资料名称不能为空'))
              } else if (this.oldData.name !== value && this.auxiliaryList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该辅助资料名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        groupId: [
          { required: true, message: '辅助资料组不能为空', trigger: 'change' }
        ]
      },
      auxiliaryList: []
    }
  },
  methods: {
    show (type, data, auxiliaryList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
      this.auxiliaryList = auxiliaryList
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
          updateAuxiliaryInfo(this.formData).then(res => {
            this.$Notice.success({
              title: '辅助资料',
              desc: `成功${this.type}辅助资料`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '辅助资料',
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
