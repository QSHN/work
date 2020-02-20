<template>
  <Modal
    v-model="modal"
    :title="`${type}职员`"
    :mask-closable="false"
    :styles="{top: '20px'}"
    width="1082"
    @on-cancel="cancel">
    <Row type="flex" style="margin-bottom: 10px;">
      <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="200" style="margin-top: 10px;">
        <FormItem label="职员编码" prop="code">
          <Input v-model="formData.code" style="width: 250px" />
        </FormItem>

        <FormItem label="职员名称" prop="name">
          <Input v-model="formData.name" style="width: 250px" />
        </FormItem>

        <FormItem label="部门" style="margin-bottom: 10px;">
          <Select v-model="formData.groupId" style="width: 250px">
            <Option v-for="(v, i) in groupList" :value="v._id" :key="i">{{ v.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="手机" style="margin-bottom: 10px;">
          <Input v-model.number="formData.phone" />
        </FormItem>

        <FormItem label="性别" style="margin-bottom: 10px;">
          <RadioGroup v-model="formData.gender">
            <Radio label="男"></Radio>
            <Radio label="女"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Row>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateClerk } from '../../api/clerk'
export default {
  name: 'currency',
  props: {
    groupList: Array,
    clerkList: Array
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
                callback(new Error('职员编码不能为空'))
              } else if (this.oldData.code !== value && this.clerkList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该职员编码，不能重复'))
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
                callback(new Error('职员名称不能为空'))
              } else if (this.oldData.name !== value && this.clerkList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该职员名称，不能重复'))
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
        code: null,
        name: null,
        phone: null,
        gender: null,
        status: '启用'
      }, addObj)
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
          updateClerk(this.formData).then(res => {
            this.$Notice.success({
              title: '职员',
              desc: `成功${this.type}职员`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '职员',
              desc: err.message
            })
          })
        }
      })
    }
  }
}
</script>
