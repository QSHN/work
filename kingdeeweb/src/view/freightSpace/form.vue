<template>
  <Modal
    v-model="modal"
    :title="`${type}仓位`"
    :mask-closable="false"
    width="500"
    height="1200"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="仓位编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" />
      </FormItem>

      <FormItem label="仓位名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
      </FormItem>

      <FormItem label="全名">
        <Input :value="groupName + '_' + formData.name" readonly style="width: 200px" />
      </FormItem>

      <FormItem label="备注">
        <Input v-model="formData.des"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 200px" />
      </FormItem>

      <FormItem label="默认仓位">
        <Checkbox v-model="formData.isDefault"></Checkbox>
      </FormItem>

      <FormItem label="包含子仓位">
        <Checkbox v-model="formData.isChild"></Checkbox>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { updateFreightSpace } from '../../api/freightSpace'
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
                callback(new Error('仓位编码不能为空'))
              } else if (this.oldData.code !== value && this.freightList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该仓位编码，不能重复'))
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
                callback(new Error('仓位名称不能为空'))
              } else if (this.oldData.name !== value && this.freightList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该仓位名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      freightList: [],
      groupName: ''
    }
  },
  methods: {
    show (type, data, freightList, groupName, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        isDefault: false,
        isChild: false,
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
      this.freightList = freightList
      this.groupName = groupName
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
          updateFreightSpace(this.formData).then(res => {
            this.$Notice.success({
              title: '仓位',
              desc: `成功${this.type}仓位`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '仓位',
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
