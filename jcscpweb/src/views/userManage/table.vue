<template>
  <div class="user-manage-table-container">
    <el-row style="margin-bottom: 15px;">
      <el-button size="small" @click="set(null, 'add', '新增')">创建{{ title }}</el-button>
      <el-button size="small" @click="load">刷新数据</el-button>
      <el-button size="small" type="primary" @click="editTemp">设置{{ title }}模板</el-button>
      <el-button size="small" type="primary" @click="setSystem">设置系统参数</el-button>
    </el-row>

    <el-table
      :data="getPageContent"
      size="small"
      border
      resizable
    >
      <el-table-column
        prop="account"
        label="账号"
        width="120"
        sortable
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
        sortable
      />
      <el-table-column
        prop="phone"
        label="手机号码"
        width="200"
        sortable
      />
      <el-table-column
        prop="accountStatus"
        label="账户状态"
        width="120"
        sortable
        :filters="accountStatus"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
      />
      <el-table-column
        label="最后一次登录时间"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.loginTime ? moment(scope.row.loginTime).format('YYYY-MM-DD HH:mm') : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="120"
        sortable
        :filters="gender"
        :filter-method="filterGender"
        filter-placement="bottom-end"
      />
      <template v-if="role !== 'client'">
        <el-table-column
          prop="job"
          label="职位"
          width="120"
          sortable
          :filters="jobs"
          :filter-method="filterJob"
          filter-placement="bottom-end"
        />
      </template>

      <template v-else>
        <el-table-column
          prop="infoCode"
          label="客户编码"
          width="120"
          sortable
        />
      </template>

      <el-table-column
        :label="role === 'company' ? '直属上级：' : '客户归属：'"
        width="150"
        sortable
        :filters="superior"
        :filter-method="filterSuperior"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          {{ getUserName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(v, i) in temp"
        :key="'temp' + i"
        :label="v.name"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          <template v-if="v.type !== 'img'">
            {{ getTempVal(scope.row, v.name) }}
          </template>
          <div v-else style="width: 100%; height: 32px;">
            <preview-img :image-url="getTempVal(scope.row, v.name)" style="width: 32px; height: 32px;" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="set(scope.row, 'look', '查看')">查看</el-button>
          <el-button type="text" size="small" @click.native.prevent="set(scope.row, 'edit', '修改')">编辑</el-button>
          <el-button type="text" size="small" :disabled="scope.row.accountStatus !== '禁用'" @click.native.prevent="set(scope.row, 'change', '启用')">启用</el-button>
          <el-button type="text" size="small" :disabled="scope.row.accountStatus !== '锁住'" @click.native.prevent="set(scope.row, 'change', '解锁')">解锁</el-button>
          <el-button
            type="text"
            size="small"
            :style="{
              color: judgeAccountStatus(scope.row, '禁用') ? '' : '#F56C6C'
            }"
            :disabled="judgeAccountStatus(scope.row, '禁用')"
            @click.native.prevent="set(scope.row, 'change', '禁用')"
          >禁用</el-button>
          <el-button
            type="text"
            size="small"
            :style="{
              color: judgeAccountStatus(scope.row, '禁用') ? '' : '#F56C6C'
            }"
            :disabled="judgeAccountStatus(scope.row, '删除')"
            @click.native.prevent="set(scope.row, 'change', '删除')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="20"
      :current-page.sync="currentPage"
      layout="prev, pager, next"
      :total="tableData.length"
      style="margin-top: 5px;"
    />

    <system ref="system" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import system from './system'
import { queryUserTemp, updateUser } from '../../api/user'
import previewImg from '../../components/Upload/previewImg'
export default {
  name: 'UserManage',
  components: {
    system,
    previewImg
  },
  props: {
    title: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1,
      accountStatus: [
        { text: '正常', value: '正常' },
        { text: '禁用', value: '禁用' },
        { text: '锁住', value: '锁住' }
      ],
      gender: [
        { text: '男', value: '男' },
        { text: '女', value: '女' }
      ],
      temp: []
    }
  },
  computed: {
    ...mapGetters([
      'myInfo',
      'allUserList',
      'basicInfo'
    ]),
    tableData() {
      const list = this.allUserList.filter(f => f.role === this.role && f.accountStatus !== '已删除')
      if (this.myInfo && this.myInfo.role === 'admin' && this.role === 'company') {
        list.unshift(this.myInfo)
      }
      return list
    },
    getPageContent() {
      return this.tableData.slice((this.currentPage - 1) * 20, this.currentPage * 20)
    },
    jobs() {
      let list = this.basicInfo.job ? this.basicInfo.job.list : []
      list = list.map(v => {
        return {
          text: v.job,
          value: v.job
        }
      })
      return list
    },
    superior() {
      const type = this.role === 'company' ? 'employeeSuperior' : 'customerBelongs'
      const ids = new Set()
      this.allUserList.map(v => {
        v[type].forEach(id => {
          ids.add(id)
        })
      })
      let list = Array.from(ids)
      list = list.map(id => {
        const name = this.allUserList.find(f => f._id === id).name
        return {
          text: name,
          value: id
        }
      })
      return list
    }
  },
  created() {
    this.loadTemp()
  },
  methods: {
    moment,
    set(row, type, status) {
      if (!this.judgeAuthority(this.role === 'company' ? '员工账号' : '客户账号', status === '查看' ? 1 : 0, status)) {
        this.$message.error(`对不起，您没有${status}${this.role === 'company' ? '员工账号' : '客户账号'}的权限，请联系管理员`)
        return
      }
      switch (type) {
        case 'add':
          this.goAccount(null, 'add')
          break
        case 'look':
          this.goAccount(row._id, 'look')
          break
        case 'edit':
          this.goAccount(row._id, 'edit')
          break
        case 'change':
          this.$confirm(`您确定要${status}该账号，账号:${row.account}，姓名：${row.name}${status === '删除' ? '，一旦删除就无法恢复' : ''}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '返回',
            type: 'warning'
          }).then(() => {
            const ajaxData = JSON.parse(JSON.stringify(row))
            if (status === '禁用') {
              ajaxData.accountStatus = '禁用'
            } else if (status === '删除') {
              ajaxData.accountStatus = '已删除'
              ajaxData.account += '_delete' + (Math.floor(Math.random() * 900) + 100)
            } else {
              ajaxData.accountStatus = '正常'
            }
            updateUser(ajaxData).then(res => {
              this.$store.dispatch('user/queryAllUser')
              if (ajaxData._id === this.myInfo._id) this.$store.dispatch('user/getInfo')
            })
          })
          break
      }
    },
    goAccount(userId, type) {
      const query = {
        role: this.role
      }
      if (userId) query.userId = userId
      if (type) query.type = type
      this.$router.push({
        name: 'UserManageAccount',
        query: query
      })
    },
    editTemp() {
      if (!this.judgeAuthority(this.role === 'company' ? '员工账号' : '客户账号', 0, '自定义')) {
        this.$message.error(`对不起，您没有自定义${this.role === 'company' ? '员工账号' : '客户账号'}模板的权限，请联系管理员`)
        return
      }
      this.$router.push({
        name: 'UserManageTemp',
        query: {
          role: this.role
        }
      })
    },
    setSystem() {
      if (!this.judgeAuthority('系统参数', 1)) {
        this.$message.error(`对不起，您没有查看系统参数的权限，请联系管理员`)
        return
      }
      this.$refs.system.show()
    },
    load() {
      this.$store.dispatch('user/queryAllUser')
    },
    filterStatus(value, row) {
      return row.accountStatus === value
    },
    filterGender(value, row) {
      return row.gender === value
    },
    filterJob(value, row) {
      return row.job === value
    },
    filterSuperior(value, row) {
      const type = this.role === 'company' ? 'employeeSuperior' : 'customerBelongs'
      const length = row[type].length
      const id = length > 0 ? row[type][length - 1] : null
      return id === value
    },
    getUserName(row) {
      const type = this.role === 'company' ? 'employeeSuperior' : 'customerBelongs'
      const length = row[type].length
      const id = length > 0 ? row[type][length - 1] : null
      return id ? this.allUserList.find(f => f._id === id).name : ''
    },
    loadTemp() {
      queryUserTemp().then(res => {
        const { customCustomer, customEmployee } = res
        this.temp = this.role === 'company' ? customEmployee : customCustomer
      })
    },
    getTempVal(row, name) {
      const list = row[this.role === 'company' ? 'customEmployee' : 'customCustomer']
      return list.length ? list.find(v => v.name === name).val : null
    },
    judgeAccountStatus(row, target) {
      if (row.role === 'admin') return true
      if (target === '禁用') return row.accountStatus !== '正常'
      return false
    },
    judgeAuthority(title, index, action) {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === title) {
              const look = index === 0 ? list[i].children[0].children.find(f => f.label === action) : list[i].children[index]
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
  .user-manage-table-container {
  }
</style>
