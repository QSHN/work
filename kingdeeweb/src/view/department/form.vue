<template>
  <Modal
    v-model="modal"
    :title="`${type}部门`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="500"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="120" style="margin-top: 10px;">
      <FormItem label="编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" />
      </FormItem>

      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
      </FormItem>

      <FormItem label="上级分类">
        <Cascader v-model="formData.parentIds" :data="getSelectList" style="width: 200px" change-on-select></Cascader>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateDepartment } from '../../api/department'
export default {
  name: 'currency',
  props: {
    departmentList: Array
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
                callback(new Error('部门编码不能为空'))
              } else if (this.oldData.code !== value && this.departmentList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该部门编码，不能重复'))
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
                callback(new Error('部门名称不能为空'))
              } else if (this.oldData.name !== value && this.departmentList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该部门名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSelectList () {
      let result = []
      let add = (list, child) => {
        list.forEach(v => {
          let subList = this.departmentList.filter(g => g.parentIds.length && g.parentIds[g.parentIds.length - 1] === v._id)
          let children = []
          if (subList.length) add(subList, children)
          let addObj = {
            value: v._id,
            label: v.name
          }
          if (children.length) addObj.children = children
          if (!this.formData._id || (this.formData._id && this.formData._id !== v._id)) child.push(addObj)
        })
      }
      add(this.departmentList.filter(f => f.parentIds.length === 0), result)
      return result
    }
  },
  methods: {
    show (type, data, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        name: '',
        code: '',
        status: '启用'
      }, addObj)
      console.log(this.formData)
      if (data) this.oldData = data
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
          updateDepartment(this.formData).then(res => {
            this.$Notice.success({
              title: '部门',
              desc: `成功${this.type}部门`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '部门',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>
