<template>
  <Modal
    v-model="modal"
    :title="`${type}费用`"
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

      <FormItem label="费用类型" prop="costType">
        <Select v-model="formData.costType" filterable style="width: 200px;">
          <Option v-for="item in costTypeList" :value="item.name" :key="item.code">{{ item.code }}（{{item.name}}）</Option>
        </Select>

        <Button type="default" style="margin-left: 10px;" @click="setInfo">管理</Button>
      </FormItem>

      <FormItem label="计量单位">
        <Input v-model="formData.unit" style="width: 200px" />
      </FormItem>

      <FormItem label="备注">
        <Input v-model="formData.des"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 200px" />
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>

    <selectInfo ref="selectInfo" />
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateCost } from '../../api/cost'
import selectInfo from '../../components/selectInfo/index'
export default {
  name: 'currency',
  components: {
    selectInfo
  },
  data () {
    return {
      modal: false,
      type: '',
      costTypeList: [],
      oldData: {},
      formData: {},
      formDataRule: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('编码不能为空'))
              } else if (this.oldData.code !== value && this.costList.filter(v => v.code.trim() === value.trim()).length) {
                callback(new Error('已存在该编码，不能重复'))
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
                callback(new Error('名称不能为空'))
              } else if (this.oldData.name !== value && this.costList.filter(v => v.name.trim() === value.trim()).length) {
                callback(new Error('已存在该名称，不能重复'))
              } else {
                callback()
              }
            }
          }
        ],
        costType: [
          { required: true, message: '费用类型不能为空', trigger: 'blur' }
        ]
      },
      costList: [],
      fullName: ''
    }
  },
  computed: {
    ...mapGetters([
      'selectInfoList'
    ])
  },
  watch: {
    selectInfoList: {
      handler () {
        if (this.selectInfoList) {
          this.costTypeList = this.selectInfoList.filter(v => v.category === 'FYLX')
        }
      },
      immediate: true,
      deep: true
    },
    'formData.costType': {
      handler () {
        if (this.formData.costType) {
          this.formData.costTypeId = this.costTypeList.find(v => v.name === this.formData.costType)._id
        }
      },
      deep: true
    }
  },
  methods: {
    show (type, data, costList, addObj) {
      this.modal = true
      this.type = type
      this.formData = data ? Object.assign({}, data) : Object.assign({
        code: '',
        name: '',
        costType: '运费',
        costTypeId: '',
        unit: '',
        des: '',
        status: '启用'
      }, addObj)
      if (data) this.oldData = data
      this.costList = costList
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
          updateCost(this.formData).then(res => {
            this.$Notice.success({
              title: '费用',
              desc: `成功${this.type}费用`
            })
            this.$emit('load')
            this.cancel()
          }).catch(err => {
            this.$Notice.error({
              title: '费用',
              desc: err.message
            })
          })
        }
      })
    },
    setInfo () {
      this.$refs.selectInfo.show('费用类型', 'FYLX', this.costTypeList)
    }
  }
}
</script>

<style lang="less">

</style>
