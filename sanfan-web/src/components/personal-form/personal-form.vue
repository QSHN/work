<template>
  <Modal v-model="modal" fullscreen @on-ok="ok" :loading="isCommit"  @on-cancel="close">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="personal-form-modal" v-if="formData">
      <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="120">
        <FormItem label="头像：">
          <upload-pic :avatar="formData.avatar" @changeAvatar="changeAvatar" />
        </FormItem>

        <FormItem label="姓名："  prop="name">
          <Input v-model="formData.name" :maxlength="10" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="性别：" prop="gender">
          <RadioGroup v-model="formData.gender">
            <Radio label="MALE">男</Radio>
            <Radio label="FEMALE">女</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="手机号：" prop="phone">
          <Input v-model="formData.phone" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="密码：" prop="plainPassword">
          <Input v-model="formData.plainPassword" type="password"  placeholder="不填则默认初始密码" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="部门：" prop="departmentId">
          <Select v-model="formData.departmentId" filterable style="width: 400px" v-if="organization">
            <Option v-for="item in selectData({list: organization.children, id: 'id', name: 'name', children: 'children'})"
                    :value="item.id"
                    :key="item.name">{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="考勤分组：" prop="timeCardId">
          <!--selectData({list: timeCards, id: '_id', name: 'name'})-->
          <Select v-model="formData.timeCardId" filterable style="width: 400px">
            <Option v-for="item in []"
                    :value="item.id"
                    :key="item.name">{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="职位：">
          <Input v-model="formData.job" :maxlength="10" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="邮箱：" prop="email">
          <Input v-model="formData.email" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="工号：" prop="workNumber">
          <Input v-model="formData.workNumber" :maxlength="20" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="入职时间">
            <DatePicker type="date" placeholder="请选择" v-model="formData.onBoardAt"></DatePicker>
        </FormItem>

        <FormItem label="办公地点：">
          <Input v-model="formData.location" :maxlength="30" style="width: 400px"></Input>
        </FormItem>

        <FormItem label="号码隐藏：">
          <i-switch v-model="formData.hiddenPhone" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
          <span style="line-height: 32px; font-size: 12px; color: red; padding-left: 10px">隐藏手机号码后，手机号在聊天个人资料页面和通讯录页面隐藏</span>
        </FormItem>
      </Form>

      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </Modal>
</template>

<script>
import uploadPic from '_c/upload/upload-avatar.vue'
import { mapGetters, mapActions } from 'vuex'
import { selectData } from '@/libs/select.js'
import { getEmployee, setEmployee } from '@/api/company'
export default {
  name: 'personal-form',
  components: {
    uploadPic
  },
  data () {
    return {
      modal: false,
      title: '',
      isCommit: true,
      spinShow: false,
      formData: {
        id: '',
        avatar: '',
        companyId: '',
        name: '',
        gender: 'UNKNOWN',
        phone: '',
        plainPassword: '',
        departmentId: '',
        timeCardId: '',
        job: '',
        email: '',
        workNumber: '',
        onBoardAt: '',
        hiddenPhone: false,
        status: 'ENABLED'
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
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
        ],
        plainPassword: [
          {
            required: false,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^[0-9a-zA-Z]{6,}$/.test(value)) {
                callback(new Error('请输入6位以上字母或数字的密码'))
              } else {
                callback()
              }
            }
          }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        timeCardId: [
          { required: false, message: '请选择考勤组', trigger: 'change' }
        ],
        email: [
          {
            required: false,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value))) {
                callback(new Error('请输入正确的邮箱'))
              } else {
                callback()
              }
            }
          }
        ],
        workNumber: [
          {
            required: false,
            trigger: 'blur',
            type: 'number',
            message: '请输入正确的工号',
            transform (value) { return Number(value) }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'organization'
    ])
  },
  methods: {
    ...mapActions([
      'getContacts',
      'getOrganizationTree'
    ]),
    selectData,
    // getUserInfoById,
    // setUserInfoById,
    changeAvatar (url) {
      this.formData.avatar = url
    },
    changeStatus () {
      this.isCommit = false
      this.$nextTick(() => { this.isCommit = true })
    },
    show (data, isAdd) {
      this.title = isAdd ? '添加员工' : '编辑员工'
      if (!isAdd) {
        this.spinShow = true
        getEmployee(data.uid).then(res => {
          for (let key in this.formData) {
            if (res.data[key] !== undefined) {
              this.formData[key] = res.data[key]
            }
          }
          console.log(this.formData)
          this.$forceUpdate()
          this.spinShow = false
        }).catch((err) => {
          if (err.errorMsg) {
            this.$Notice.error({
              title: '错误提示',
              desc: err.errorMsg
            })
          }
        })
      } else {
        if (data) this.formData.departmentId = data.id
      }
      // this.formData = data
      this.modal = true
    },
    ok () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.formData)
          setEmployee(data).then((res) => {
            this.getOrganizationTree()
            this.getContacts()
            this.close()
          }).catch((err) => {
            console.error('setEmployee', err)
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
            }
            this.changeStatus()
          })
        } else {
          this.changeStatus()
        }
      })
    },
    close () {
      this.modal = false
      this.formData = {
        id: '',
        avatar: '',
        name: '',
        gender: 'UNKNOWN',
        phone: '',
        plainPassword: '',
        departmentId: '',
        timeCardId: '',
        job: '',
        email: '',
        workNumber: '',
        onBoardAt: '',
        companyId: '',
        hiddenPhone: false,
        status: 'ENABLED'
      }
      this.$refs.formValidate.resetFields()
      this.changeStatus()
    }
  }
}
</script>

<style lang="less">
.personal-form-modal {
  width: 660px;
  margin: 0 auto;
  .ivu-form-item-label {
    font-size: 16px;
  }

}
</style>
