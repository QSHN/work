<template>
  <Modal
      v-model="modal"
      width="500"
      title="创建拜访任务"
      :loading="isCommit"
      :mask-closable="false"
      @on-ok="ok"
      @on-cancel="cancel">
    <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="120">
      <FormItem :label="`拜访${type === 'CLIENT' ? '客户' : '商家'}：`" prop="clientId">
        <Select v-model="formData.clientId" filterable style="width: 240px" @on-change="selectClient">
          <Option v-for="item in clientList.filter(v => v.clientGroup === type)"  :value="item.id" :label="item.name" :key="item.id"></Option>
        </Select>
      </FormItem>

      <FormItem :label="`${type === 'CLIENT' ? '客户' : '商家'}联系人：`" prop="clientLinkmanId">
        <Select v-model="formData.clientLinkmanId" filterable style="width: 240px" @on-open-change="isSelectContact">
          <Option v-for="item in contacts" :value="item.id" :label="item.name" :key="item.id"></Option>
        </Select>
      </FormItem>

      <FormItem :label="`${type === 'CLIENT' ? '客户' : '商家'}类型：`">
        <span style="display: inline-block">{{clientType || `请选择拜访${type === 'CLIENT' ? '客户' : '商家'}`}}</span>
      </FormItem>

      <FormItem label="拜访方式">
        <span style="display: inline-block">{{clientVisitingType === 'TEL' ? '电话拜访' : '走访拜访'}}</span>
      </FormItem>

      <FormItem label="截止时间：" prop="deadline">
        <DatePicker type="datetime"
                    placeholder="请选择截止时间"
                    :value="formData.deadline"
                    format="yyyy-MM-dd HH:mm"
                    :options="dateOption"
                    @on-change="val => formData.deadline = val"
                    style="width: 240px">
        </DatePicker>
      </FormItem>

      <FormItem label="拜访人：" prop="visitors">
        <div style="width:240px;">
          <employee-selector :multiple="false"
                             :range="'directlyEmployee'"
                             v-model="formData.visitors" />
        </div>
      </FormItem>

      <FormItem label="拜访内容："  prop="content">
        <Input v-model="formData.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width: 240px" placeholder="请填写拜访内容">
        </Input>
      </FormItem>

      <FormItem label="图片：" style="margin-bottom: 5px">
        <upload-pic v-model="formData.visitingPhotos" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { getClient, getVisitSetting, addVisiting } from '@/api/client'
import { mapGetters } from 'vuex'
import EmployeeSelector from '_c/employees/selector.vue'
import uploadPic from '_c/upload/upload-pic.vue'
export default {
  name: 'visit-create-modal',
  components: {
    EmployeeSelector,
    uploadPic
  },
  props: {
    clientVisitingType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      isCommit: true,
      type: 'CLIENT',
      clientList: [],
      contacts: [],
      clientType: '',
      setting: {},
      formData: {
        clientGroup: '',
        clientId: '',
        clientLinkmanId: '',
        clientVisitingType: '',
        content: '',
        deadline: '',
        visitingPhotos: [],
        visitors: ''
      },
      ruleValidate: {
        clientId: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formData.clientId.length) {
                callback()
              } else {
                callback(new Error(`请选择拜访${this.type === 'CLIENT' ? '客户' : '商家'}`))
              }
            }
          }
        ],
        clientLinkmanId: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formData.clientLinkmanId.length) {
                callback()
              } else {
                callback(new Error(`请选择${this.type === 'CLIENT' ? '客户' : '商家'}联系人`))
              }
            }
          }
        ],
        visitors: [
          {
            required: true,
            trigger: 'change',
            type: Array,
            validator: (rule, value, callback) => {
              if (this.formData.visitors.length) {
                callback()
              } else {
                callback(new Error(`请选择拜访人`))
              }
            }
          }
        ],
        deadline: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (this.formData.deadline) {
                callback()
              } else {
                callback(new Error('请选择拜访截止时间'))
              }
            }
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let count = this.setting.visitingContentLong || 100
              if (this.formData.content.length < count) {
                callback(new Error(`拜访内容不能少于${count}字`))
              } else {
                callback()
              }
            }
          }
        ]
      },
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  methods: {
    selectClient (id) {
      this.formData.clientLinkmanId = ''
      this.clientList.forEach(v => {
        if (v.id === id) {
          this.contacts = v.clientLinkmanDTOList
          this.clientType = v.typeName
        }
      })
      // console.log('contacts', this.contacts, this.clientList)
    },
    isSelectContact (status) {
      if (status && this.contacts.length === 0) {
        this.$Notice.error({
          title: `请选择${this.type === 'CLIENT' ? '客户' : '商家'}联系人`,
          desc: `请先选择拜访${this.type === 'CLIENT' ? '客户' : '商家'}`
        })
      }
    },
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    show (type) {
      this.type = type
      this.formData.clientGroup = type
      this.formData.clientVisitingType = this.clientVisitingType
      this.modal = true
    },
    ok () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.formData)
          data.visitors = [data.visitors]
          console.log(data)
          addVisiting(data).then(res => {
            console.log('createVisit', res.data)
            this.$emit('update')
            this.cancel()
          }).catch((err) => {
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
              this.cancel()
            }
          })
        } else {
          this.changeStatus()
        }
      })
    },
    cancel () {
      this.changeStatus()
      this.contacts = []
      this.clientType = []
      this.$refs.formValidate.resetFields()
      this.formData = {
        clientGroup: '',
        clientId: '',
        clientLinkmanId: '',
        clientVisitingType: '',
        content: '',
        deadline: '',
        visitingPhotos: [],
        visitors: ''
      }
      setTimeout(() => {
        this.$refs.formValidate.resetFields()
      }, 500)
      this.modal = false
    },
    getClient (list) {
      getClient({ belongToWhoIDList: list }).then(res => {
        this.clientList = res.data || []
      }).catch(err => {
        if (err.errorMsg) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.errorMsg
          })
        }
      })
    }
  },
  created () {
    getVisitSetting().then(res => {
      console.log('getVisitSetting', res.data)
      this.setting = res.data
    }).catch(err => {
      if (err.errorMsg) {
        this.$Notice.error({
          title: '错误提示',
          desc: err.errorMsg
        })
      }
    })
  }
}
</script>

<style scoped>

</style>
