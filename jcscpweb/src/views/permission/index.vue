<template>
  <div class="permission-container">
    <el-row>
      <el-button type="primary" size="small" @click="setGroup('employee')">员工组管理</el-button>
      <el-button type="primary" size="small" @click="setGroup('customer')">客户组管理</el-button>
    </el-row>

    <el-row v-if="group" type="flex" style="margin-top: 20px;">
      <ul class="group_list">
        <li class="li_h" style="background: #f5f7fa;">用户组</li>
        <li :class="{'li_t': true, active: whichGroup === '员工组'}" @click="whichGroup = '员工组'">员工组</li>
        <li v-for="(v, i) in group.employee" :key="'employee' + i" :class="{'li_c': true, active: whichGroup === v.name}" @click="whichGroup = v.name">
          {{ v.name }}
        </li>
        <li :class="{'li_t': true, active: whichGroup === '客户组'}" @click="whichGroup = '客户组'">客户组</li>
        <li v-for="(v, i) in group.customer" :key="'customer' + i" :class="{'li_c': true, active: whichGroup === v.name}" @click="whichGroup = v.name">
          {{ v.name }}
        </li>
      </ul>

      <div style="width: 1052px">
        <el-table
          :data="tableData"
          size="small"
          border
          resizable
        >
          <el-table-column
            prop="account"
            label="账号"
            width="200"
            sortable
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="200"
            sortable
          />
          <el-table-column
            prop="phone"
            label="手机号码"
            width="200"
            sortable
          />
          <el-table-column
            label="账号类型"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.role === 'company' ? '公司员工' : '客户' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="setPermission(scope.row._id, null)">权限管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <group-form ref="groupForm" :group="group" @loadGroup="loadGroup" @setPermission="setPermission" />
    <permission-form ref="permissionForm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryUserGroup } from '../../api/user'
import groupForm from './group'
import permissionForm from './permission'
export default {
  name: 'Permission',
  components: {
    groupForm,
    permissionForm
  },
  data() {
    return {
      group: null,
      whichGroup: '员工组'
    }
  },
  computed: {
    ...mapGetters([
      'myInfo',
      'allUserList',
      'basicInfo'
    ]),
    tableData() {
      let list = this.allUserList.filter(f => f.role !== 'admin' && f.accountStatus !== '已删除')
      if (this.whichGroup === '员工组') {
        list = list.filter(f => f.role === 'company')
      } else if (this.whichGroup === '客户组') {
        list = list.filter(f => f.role === 'client')
      } else {
        const gInfo = this.group.customer.find(f => f.name === this.whichGroup) || this.group.employee.find(f => f.name === this.whichGroup)
        if (gInfo.userList.length) {
          list = list.filter(f => gInfo.userList.includes(f._id))
        } else {
          list = []
        }
      }
      return list
    }
  },
  created() {
    this.loadGroup()
  },
  methods: {
    loadGroup() {
      queryUserGroup().then(res => {
        this.group = res
      })
    },
    setGroup(type) {
      if (!this.judgeAuthority()) {
        this.$message.error(`对不起，您没有修改权限管理的权限，请联系管理员`)
        return
      }
      this.$refs.groupForm.show(type)
    },
    setPermission(userId, groupId) {
      if (!this.judgeAuthority()) {
        this.$message.error(`对不起，您没有修改权限管理的权限，请联系管理员`)
        return
      }
      this.$refs.permissionForm.show(userId, groupId)
    },
    judgeAuthority() {
      let bool = false
      // && this.myInfo.role !== 'admin'
      if (this.myInfo && this.myInfo.role !== 'admin') {
        const pList = this.myInfo.permission.permission
        const checked = this.myInfo.permission.checked
        const findFun = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].label === '权限管理') {
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
.permission {
  &-container {
    margin: 30px;

    .group_list {
      list-style: none;
      width: 200px;
      margin: 0 10px 0 0;
      padding: 0;
      border: 1px solid #EBEEF5;

      li {
        height: 48px;
        line-height: 48px;
        padding: 0 10px;
        border-bottom: 1px solid #EBEEF5;
        font-size: 14px;

        &:last-child {
          border-bottom: none;
        }

        &.li_c {
          padding-left: 30px;
        }

        &.li_c,
        &.li_t {
          cursor: pointer;
        }

        &.active {
          background: rgba(#409EFF, .1);
        }
      }
    }
  }
}
</style>
