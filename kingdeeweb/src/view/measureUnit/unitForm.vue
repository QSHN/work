<template>
  <Modal
    v-model="modal"
    :title="`${type}计量单位`"
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

      <FormItem label="单位组" prop="groupId">
        <Select v-model="formData.groupId" filterable style="width: 200px;">
          <Option v-for="item in groupList" :value="item._id" :key="item._id">{{ item.name }}</Option>
        </Select>
      </FormItem>

      <FormItem label="换算率" prop="equation">
        <InputNumber :min="0" :step="0.1" v-model="formData.equation"></InputNumber>
      </FormItem>

      <FormItem label="换算方式" prop="conversion">
        <RadioGroup v-model="formData.conversion">
          <Radio label="固定换算">
            <span>固定换算</span>
          </Radio>
          <Radio label="浮动换算">
            <span>浮动换算</span>
          </Radio>
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
import { updateMeasureUnit } from '../../api/measureUnit'
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
                callback(new Error('计量单位编码不能为空'))
              } else if (this.oldData.code !== value && this.unitList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该计量单位编码，不能重复'))
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
                callback(new Error('计量单位名称不能为空'))
              } else if (this.oldData.name !== value && this.unitList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该计量单位名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        groupId: [
          { required: true, message: '单位组不能为空', trigger: 'change' }
        ],
        equation: [
          { required: true, message: '换算率不能为空', type: 'number', trigger: 'blur' }
        ],
        conversion: [
          { required: true, message: '换算方式不能为空', trigger: 'blur' }
        ]
      },
      unitList: []
    }
  },
  methods: {
    show (type, data, unitList, unitAddObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        equation: 1,
        conversion: '固定换算',
        status: '启用'
      }, unitAddObj)
      if (data) this.oldData = data
      this.unitList = unitList
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
          updateMeasureUnit(this.formData).then(res => {
            this.$Notice.success({
              title: '计量单位',
              desc: `成功${this.type}计量单位`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '计量单位',
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
