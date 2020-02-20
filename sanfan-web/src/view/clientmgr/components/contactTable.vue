<template>
  <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="100">
    <Row>
      <Col span="12">
        <FormItem label="姓名："  prop="name">
          <Input v-model="formData.name" :maxlength="10" style="width: 150px" placeholder="姓名"></Input>
        </FormItem>

        <FormItem label="主要联系人：">
          <i-switch v-model="formData.major" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>

        <FormItem label="部门：">
          <Input v-model="formData.department" style="width: 150px"></Input>
        </FormItem>

        <FormItem label="电子邮箱：">
          <Input v-model="formData.email" style="width: 150px"></Input>
        </FormItem>

        <FormItem label="QQ号：">
          <Input v-model="formData.qq" style="width: 150px"></Input>
        </FormItem>

        <FormItem label="生日：">
          <Input v-model="formData.birth" style="width: 150px"></Input>
        </FormItem>
      </Col>

      <Col span="12">
        <FormItem label="手机号：" prop="tel">
          <Input v-model="formData.tel" style="width: 150px" placeholder="请输入手机号"></Input>
        </FormItem>

        <FormItem label="性别：">
          <RadioGroup v-model="formData.gender">
            <Radio label="MALE">男</Radio>
            <Radio label="FEMALE">女</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="职务：">
          <Input v-model="formData.duty" style="width: 150px"></Input>
        </FormItem>

        <FormItem label="微信：">
          <Input v-model="formData.weChat" style="width: 150px"></Input>
        </FormItem>

        <FormItem label="传真：">
          <Input v-model="formData.fax" style="width: 150px"></Input>
        </FormItem>

        <FormItem label="备注：">
          <Input v-model="formData.note" style="width: 150px"></Input>
        </FormItem>

        <div style="text-align: right; padding-right: 6px">
          <Button type="success" @click="add">{{isEdit ? '编辑' : '创建'}}联系人</Button>
          <Button type="warning" style="margin-left: 2px" @click="clear">清空</Button>
        </div>
      </Col>
    </Row>
  </Form>
</template>

<script>
export default {
  name: 'contactTable',
  data () {
    return {
      isEdit: false,
      formData: {
        name: '',
        tel: '',
        major: false,
        gender: 'MALE',
        department: '',
        email: '',
        weChat: '',
        qq: '',
        fax: '',
        birth: '',
        note: '',
        duty: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tel: [
          {
            required: true,
            message: '请输入正确的手机号',
            trigger: 'blur',
            type: 'number',
            transform (value) { return Number(value) },
            validator: (rule, value, callback) => {
              if (!/[0-9]{11}/.test(value)) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    select (data) {
      this.$refs.formValidate.resetFields()
      this.formData = Object.assign({}, data)
      if (data) this.isEdit = true
    },
    add () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$emit('add', Object.assign({}, this.formData))
          this.clear()
        }
      })
    },
    clear () {
      this.$refs.formValidate.resetFields()
      this.formData = {
        name: '',
        tel: '',
        major: false,
        gender: 'MALE',
        department: '',
        email: '',
        weChat: '',
        qq: '',
        fax: '',
        birth: '',
        note: '',
        duty: ''
      }
      this.isEdit = false
    }
  }
}
</script>

<style scoped>

</style>
