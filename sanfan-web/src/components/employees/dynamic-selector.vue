<template>
  <div>
    <Row type="flex"
         justify="space-between">
      <Col :span="multiple?19:24">
      <Select :value="selectList"
              :placeholder="placeholder"
              :multiple="multiple"
              :range="range"
              :clearable="clearable"
              :disabled="disabled"
              filterable
              :loading="loading"
              @on-change="handleChange"
              @on-query-change="searchFun">
        <Option v-for="item in  multiple ? ( searchList.length ? searchList : employeesList ) : employeesList "
                :value="item.id"
                :label="item.name"
                :key="item.id">
          <span class="empolyee-name">
            {{item.name}}
          </span>
          <span class="empolyee-filter">
            {{item.departmentName}}
          </span>
          <span class="empolyee-filter">
            {{item.job}}
          </span>
        </Option>
      </Select>
      </Col>
      <Col :span="multiple?4:0">
      <Button type="primary"
              v-if="multiple"
              @click="selectFun(isSelectAll)"
              :disabled="disabled">{{isSelectAll ? '清除' : '全选'}}</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { getAllByDepartmentId, getAllEmployee, getByDepartmentId, getDirectlyAdmin, getDirectlyEmployee } from '../../api/employee'

export default {
  name: 'EmployeeDynamicSelector',
  model: {
    'prop': 'selectList',
    'event': 'change'
  },
  props: {
    // 用户ID
    'userID': {
      default: () => ''
    },
    // 用户信息。不要同时传入用户信息与用户ID
    'userInfo': {
      default: () => null
    },
    // 默认值
    'selectList': {
      default: () => null
    },
    // 范围
    'range': {
      type: String,
      default: () => 'default'
    },
    // 意义不大，暂保留
    'list': {
      type: Array,
      default: null
    },
    // 多选
    'multiple': {
      type: Boolean,
      default: () => false
    },
    // 可清除
    'clearable': {
      type: Boolean,
      default: () => true
    },
    'placeholder': {
      type: String,
      default: () => '输入员工的姓名/部门/职位'
    },
    // 查看状态，无法改变
    'disabled': {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      user: null,
      employeesList: [],
      searchList: [],
      isSelectAll: false
    }
  },
  mounted () {
    // this.updateEmployee()
    if (!this.contacts || !this.contacts.length) {
      this.updateDynamic({
        key: 'contacts',
        callback: () => {
          this.getContacts()
        }
      })
    }
    if (this.list) this.employeesList = this.list
  },
  watch: {
    userID (id) {
      if (id) {
        this.user = this.contacts.find(p => p.id === id)
        if (this.user) this.updateEmployee()
      }
    },
    userInfo (val) {
      if (val && val.id) {
        this.user = val
        this.updateEmployee()
      }
    },
    range (newRange) {
      this.updateEmployee()
    },
    list (val) {
      this.employeesList = val
    }
  },
  methods: {
    ...mapActions(['getContacts', 'updateDynamic']),

    updateEmployee () {
      if (!this.range || !this.user || !this.user.id) return
      console.log('Dynamic Selector Range', this.range)
      switch (this.range) {
        case 'allDepartmentEmployee': // 根据部门ID获取所有员工（包括子部门）
          this.load(getAllByDepartmentId(this.user.departmentId), 'allDepartmentEmployee')
          break
        case 'departmentEmployee': // 根据部门ID获取员工列表
          this.load(getByDepartmentId(this.user.departmentId), 'departmentEmployee')
          break
        case 'directlyAdmin':
          if (this.user.role === 'SUPERADMIN') {
            this.employeesList = [this.user]
          } else {
            this.load(getDirectlyAdmin(this.user.id), 'directlyAdmin')
          }
          break
        case 'directlyEmployee': // 获取员工直属下属
          if (this.user.role === 'SUPERADMIN') {
            this.load(getAllEmployee(), 'allEmployee')
          } else if (this.user.role === 'DEPARTMENTADMIN') {
            this.load(getDirectlyEmployee(this.user.id), 'directlyEmployee')
          } else {
            this.employeesList = [this.user]
          }
          break
      }
    },
    load (api, key) {
      this.loading = true
      return api.then(res => {
        this.loading = false
        this.employeesList = res.data
      })
    },
    handleChange (value) {
      console.log('chang', value)
      this.$emit('change', value || (Array.isArray(this.selectList) ? [] : ''))
    },
    searchFun (val) {
      // console.log(this.employeesList)
      if (val) {
        this.searchList = this.employeesList.filter(v =>
          v.name.includes(val) ||
          (v.job && v.job.includes(val)) ||
          (v.departmentName && v.departmentName.includes(val))
        )
      } else {
        this.searchList = []
      }
    },
    selectFun (isSelectAll) {
      this.isSelectAll = !isSelectAll
      let list = this.isSelectAll ? this.employeesList.map(v => v.id) : []
      this.$emit('change', list)
    }
  },
  computed: {
    ...mapGetters([
      'contacts',
      'isDynamicLoading'
    ])
  }
}
</script>
<style lang="less" scoped>
.empolyee-name {
  font-weight: 700;
}
.empolyee-filter {
  color: #999;
  font-size: smaller;
}
</style>
