<template>
  <Modal
    v-model="modal"
    :title="`${type}支出类别`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1082"
    @on-cancel="cancel">
    <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="200" style="margin-top: 10px;">
      <FormItem label="编码" prop="code">
        <Input v-model="formData.code" style="width: 200px" />
      </FormItem>

      <FormItem label="名称" prop="name">
        <Input v-model="formData.name" style="width: 200px" />
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
import { updateSpendingCategory } from '../../api/spendingCategory'
export default {
  name: 'currency',
  props: {
    spendingCategoryList: Array
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
                callback(new Error('支出类别编码不能为空'))
              } else if (this.oldData.code !== value && this.spendingCategoryList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该支出类别编码，不能重复'))
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
                callback(new Error('支出类别名称不能为空'))
              } else if (this.oldData.name !== value && this.spendingCategoryList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该支出类别名称，不能重复'))
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
    ])
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
          updateSpendingCategory(this.formData).then(res => {
            this.$Notice.success({
              title: '支出类别',
              desc: `成功${this.type}支出类别`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '支出类别',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>
