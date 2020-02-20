<template>
  <div class="user-manage-temp-container">
    <el-row style="margin-bottom: 10px;">
      <el-button type="text" style="color: #409EFF" @click="back">返回{{ $route.query.role === 'company' ? '员工账号' : '客户账号' }}</el-button>
      <span style="font-size: 15px;">/ {{ $route.query.userId ? '修改' : '创建' }}账号</span>

      <el-button-group v-if="$route.query.userId && !$route.query.isTurn" style="margin-left: 10px;">
        <el-button type="primary" size="small" :disabled="nowUserIndex === 0" @click="go(0)">第一位</el-button>
        <el-button type="primary" size="small" :disabled="nowUserIndex === 0" @click="go(nowUserIndex - 1)">上一位</el-button>
        <el-button type="primary" size="small" :disabled="nowUserIndex === (nowUserList.length - 1)" @click="go(nowUserIndex + 1)">下一位</el-button>
        <el-button type="primary" size="small" :disabled="nowUserIndex === (nowUserList.length - 1)" @click="go(nowUserList.length - 1)">最后一位</el-button>
      </el-button-group>
    </el-row>

    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="120px" size="small">
      <el-form-item label="登录账号：" prop="account">
        <el-input v-model="form.account" style="width: 240px" :autocomplete="'off'" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="账号密码：">
        <el-input v-model="form.password" :placeholder="`默认密码：${password}`" show-password style="width: 240px;" :autocomplete="'off'" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="form.name" style="width: 240px" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="form.phone" style="width: 240px" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="form.gender">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <template v-if="$route.query.role === 'company'">
        <el-form-item label="职位：">
          <el-select v-model="form.job" placeholder="请选择" filterable clearable style="width: 240px">
            <el-option-group
              v-for="group in jobsData.group"
              :key="group.id"
              :label="group.name"
            >
              <el-option
                v-for="(item, index) in jobsData.list.filter(v => v.groupId === group.id)"
                :key="group.id + '_' + index"
                :label="item.job"
                :value="item.job"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item label="客户编码：" prop="infoCode">
          <el-select v-model="form.infoCode" placeholder="请选择" filterable clearable style="width: 240px">
            <el-option-group
              v-for="group in clientData.group"
              :key="group.id"
              :label="group.name"
            >
              <el-option
                v-for="(item, index) in clientData.list.filter(v => v.groupId === group.id)"
                :key="group.id + '_' + index"
                :label="item.clientName"
                :value="item.clientName"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item :label="$route.query.role === 'company' ? '直属上级：' : '客户归属：'">
        <el-select :value="getSuperior" placeholder="请选择" filterable clearable style="width: 240px" @change="selectSuperior">
          <el-option-group label="默认">
            <el-option
              v-for="(item, index) in allUserList.filter(v => !v.job && v.accountStatus !== '已删除')"
              :key="index"
              :label="item.name"
              :value="item._id"
            />
          </el-option-group>
          <el-option-group
            v-for="(group, gIndex) in jobsData.list"
            :key="gIndex"
            :label="group.job"
          >
            <el-option
              v-for="(item, index) in allUserList.filter(v => v.job === group.job && v.accountStatus !== '已删除')"
              :key="group.gIndex + '_' + index"
              :label="item.name"
              :value="item._id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item v-for="(v, i) in ($route.query.role === 'company' ? form.customEmployee : form.customCustomer)" :key="i" :label="v.name + '：'">
        <temp-form :form-data="v" :which="i" :is-change-name="false" @changeForm="changeForm" />
      </el-form-item>
    </el-form>

    <el-row v-if="$route.query.type !== 'look'" style="margin-top: 30px;">
      <el-button type="success" size="small" style="width: 100px;" @click="save">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryUser } from '../../api/user'
import { querySystemSet } from '../../api/systemSet'
import { queryUserTemp, register, updateUser } from '../../api/user'
import tempForm from './tempForm'
export default {
  name: 'UserManageTemp',
  components: {
    tempForm
  },
  data() {
    return {
      form: {
        account: null,
        phone: null,
        password: null,
        accountStatus: '正常',
        role: 'company',
        name: null,
        job: null,
        infoCode: null,
        gender: '男',
        customerBelongs: [],
        employeeSuperior: [],
        customCustomer: [],
        customEmployee: []
      },
      readonly: true,
      password: null,
      rules: {
        account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        infoCode: [
          { required: true, message: '请选择客户编码', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'allUserList',
      'basicInfo',
      'myInfo'
    ]),
    jobsData() {
      const group = this.basicInfo.job ? this.basicInfo.job.group : []
      const list = this.basicInfo.job ? this.basicInfo.job.list : []
      return { group, list }
    },
    clientData() {
      const group = this.basicInfo.client ? this.basicInfo.client.group : []
      const list = this.basicInfo.client ? this.basicInfo.client.list : []
      return { group, list }
    },
    getSuperior() {
      const type = this.$route.query.role === 'company' ? 'employeeSuperior' : 'customerBelongs'
      const length = this.form[type].length
      return length > 0 ? this.form[type][length - 1] : null
    },
    nowUserIndex() {
      let index = 0
      this.nowUserList.forEach((f, i) => {
        if (f._id === this.$route.query.userId) index = i
      })
      return index
    },
    nowUserList() {
      const list = this.allUserList.filter(f => f.role === this.$route.query.role && f.accountStatus !== '已删除')
      if (this.myInfo && this.myInfo.role === 'admin' && this.$route.query.role === 'company') {
        list.unshift(this.myInfo)
      }
      return list
    }
  },
  watch: {
    '$route.query': {
      handler() {
        if (this.$route.query.userId) this.load()
        if (this.$route.query.role) this.form.role = this.$route.query.role
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadSystem()
    this.loadTemp()
    this.$refs.ruleForm.resetFields()
  },
  methods: {
    load() {
      queryUser({ _id: this.$route.query.userId }).then(res => {
        this.form = res[0]
      })
    },
    loadSystem() {
      querySystemSet().then(res => {
        if (res) {
          this.password = this.$route.query.role === 'company' ? res.customerHash : res.employeeHash
          setTimeout(() => {
            this.readonly = this.$route.type === 'look'
          }, 300)
        }
      })
    },
    loadTemp() {
      if (!this.$route.query.userId) {
        queryUserTemp().then(res => {
          const { customCustomer, customEmployee } = res
          if (this.$route.query.role === 'company') {
            this.form.customEmployee = customEmployee
          } else {
            this.form.customCustomer = customCustomer
          }
        })
      }
    },
    back() {
      this.$router.push({
        name: this.$route.query.role === 'company' ? 'UserManageCompany' : 'UserManageClient'
      })
    },
    save() {
      if (!this.judgeAuthority()) {
        this.$message.error(`对不起，您没有修改个人资料的权限，请联系管理员`)
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.$route.query.userId) {
            updateUser(this.form).then(res => {
              this.$message.success('账号信息已更新')
              this.$store.dispatch('user/queryAllUser')
              this.$store.dispatch('user/getInfo')
            })
          } else {
            const ajaxData = JSON.parse(JSON.stringify(this.form))
            if (!ajaxData.password.trim()) ajaxData.password = this.password
            register(ajaxData).then(res => {
              this.$confirm('成功创建新账号，是否继续创建?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '返回',
                type: 'warning'
              }).then(() => {
                location.reload()
              }).catch(() => {
                this.$store.dispatch('user/queryAllUser')
                this.$store.dispatch('user/getInfo')
                this.back()
              })
            })
          }
        }
      })
    },
    selectSuperior(id) {
      const type = this.$route.query.role === 'company' ? 'employeeSuperior' : 'customerBelongs'
      const superior = this.allUserList.find(v => v._id === id)[type]
      superior.push(id)
      this.form[type] = superior
    },
    changeForm(item, which) {
      this.form[this.$route.query.role === 'company' ? 'customEmployee' : 'customCustomer'][which] = item
      this.$forceUpdate()
    },
    go(index) {
      const query = Object.assign({}, this.$route.query)
      query.userId = this.nowUserList[index]._id
      this.$router.push({
        name: 'UserManageAccount',
        query: query
      })
    },
    judgeAuthority() {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin' && this.$route.query.isTurn) {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === '个人资料') {
              const look = list[i].children[0]
              bool = !!checked.find(id => look.id.substr(0, id.length) === id)
              return
            } else if (list[i].children && list[i].children.length) {
              findFun(list[i].children)
            }
          }
        }
        findFun(pList)
      } else {
        bool = true
      }
      return bool
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-manage-temp {
    &-container {
      margin: 10px 30px;
    }
  }
</style>
