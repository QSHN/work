<template>
  <Modal
    v-model="modal"
    :title="title"
    :loading="isCommit"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="formData" :rules="formRule" ref="formValidate" :label-width="100">
      <FormItem label="部门名称："  prop="name">
        <Input v-model="formData.name"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex'
import { setDepartment } from '@/api/company'
export default {
  name: 'editD',
  data () {
    return {
      title: '编辑部门',
      modal: false,
      popData: null,
      formData: {
        name: ''
      },
      formRule: {
        name: [
          { required: true, message: '请填写部门名字', trigger: 'blur' }
        ]
      },
      isCommit: true,
      isAdd: false
    }
  },
  methods: {
    ...mapActions([
      'getOrganizationTree'
    ]),
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    open (data, isAdd) {
      this.formData.name = isAdd ? '' : data.name
      this.title = isAdd ? '添加子部门' : '编辑部门'
      this.isAdd = isAdd
      this.popData = data
      this.modal = true
    },
    ok () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          setDepartment({
            name: this.formData.name,
            [this.isAdd ? 'parentId' : 'id']: this.popData.id
          }).then(res => {
            // console.log(res)
            this.getOrganizationTree()
            this.cancel()
            this.$Notice.success({
              title: '成功提示',
              desc: `你已成功${this.isAdd ? '添加新部门' : '修改部门名字'}`
            })
          }).catch(err => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
            }
          })
        } else {
          this.changeStatus()
        }
      })
    },
    cancel () {
      this.modal = false
      this.changeStatus()
      this.$refs.formValidate.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
