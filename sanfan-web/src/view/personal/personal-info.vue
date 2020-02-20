<template>
  <Card style="width: 100%; height: 100%; overflow: auto;" :title="'个人信息'">
    <div class="personal-info" v-if="formData">
      <div style="width: 1100px">
        <div style="width: 600px;float: left">
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
          <Button type="success" @click="ok" style="width: 80px; margin-left: 120px;margin-bottom: 30px">保存</Button>
        </div>
        <div style="margin-top: 90px; width: 450px;float: right">
          <Table border :columns="columns" :data="tableData"></Table>
        </div>
      </div>

      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </Card>
</template>

<script>
import uploadPic from '_c/upload/upload-avatar.vue'
import { mapGetters, mapActions } from 'vuex'
import { selectData } from '@/libs/select.js'
import { setEmployee } from '@/api/company'
export default {
  name: 'personal_info',
  components: {
    uploadPic
  },
  data () {
    return {
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
      },
      columns: [
        {
          title: '使用手册',
          key: 'name'
        },
        {
          title: '查看/下载',
          key: 'action',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    window.open(`https://hawk-book.oss-cn-shenzhen.aliyuncs.com/${params.row.name}.pdf`)
                  }
                }
              }, '下载')
            ])
          }
        }
      ],
      tableData: [
        {
          name: '三帆外勤功能说明'
        },
        {
          name: '三帆外勤用户使用手册-部门管理员(管理层)'
        },
        {
          name: '三帆外勤用户使用手册-财务员工'
        },
        {
          name: '三帆外勤用户使用手册-超级管理员(老板)'
        },
        {
          name: '三帆外勤用户使用手册-行政员工'
        },
        {
          name: '三帆外勤用户使用手册-基层员工'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'organization',
      'getUserInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getOrganizationTree'
    ]),
    selectData,
    changeAvatar (url) {
      this.formData.avatar = url
    },
    show (data) {
      this.spinShow = true
      for (let key in this.formData) {
        if (data[key] !== undefined) {
          this.formData[key] = data[key]
        }
      }
      console.log(this.formData)
      this.$forceUpdate()
      this.spinShow = false
    },
    ok () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.formData)
          setEmployee(data).then((res) => {
            this.getOrganizationTree()
            this.$Notice.success({
              title: '更新个人信息',
              desc: '保存成功'
            })
          }).catch((err) => {
            console.error('setEmployee', err)
            if (err.errorMsg) {
              this.$Notice.error({
                title: '错误提示',
                desc: err.errorMsg
              })
            }
          })
        }
      })
    }
  },
  mounted () {
    this.show(this.getUserInfo)
    if (!this.organization) this.getOrganizationTree()
  }
}
</script>

<style scoped>

</style>
