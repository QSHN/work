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
import { getAllByDepartmentId, getAllEmployee, getByDepartmentId, getDirectlyAdmin, getDirectlyEmployee, getFinancialEmployee, getAdministrativeEmployee, getAllManager } from '../../api/employee'

export default {
  name: 'EmployeeSelector',
  model: {
    'prop': 'selectList',
    'event': 'change'
  },
  props: {
    // 默认值
    'selectList': {
      default: () => null
    },
    // 范围
    'range': {
      type: String,
      default: () => 'default'
    },
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
    // 展示的根目录,不定义不生效
    'department': {
      type: Object,
      default: () => null
    },
    // 查看状态，无法改变
    'disabled': {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      employeesList: [],
      searchList: [],
      isSelectAll: false
    }
  },
  mounted () {
    this.updateEmployee()
    if (this.list) this.employeesList = this.list
  },
  watch: {
    range (newRange) {
      // this.updateEmployee()
    },
    list (val) {
      this.employeesList = val
    }
  },
  methods: {
    ...mapActions([
      'updateSelectList',
      'updateLoading'
    ]),
    updateEmployee () {
      if (!this.range) return
      let key = this.range
      if (this.isSelectCache(key)) {
        this.employeesList = this.getSelectCache(key)
        return
      }
      console.log(key)
      switch (key) {
        case 'allDepartmentEmployee': // 根据部门ID获取所有员工（包括子部门）
          this.load(() => getAllByDepartmentId(this.getUserInfo.departmentId), 'allDepartmentEmployee')
          break
        case 'allEmployee': // 获取所有公司员工
          this.load(() => getAllEmployee(), 'allEmployee')
          break
        case 'departmentEmployee': // 根据部门ID获取员工列表
          this.load(() => getByDepartmentId(this.getUserInfo.departmentId), 'departmentEmployee')
          break
        case 'directlyAdmin':
          if (this.getUserInfo.role === 'SUPERADMIN') {
            this.employeesList = [this.getUserInfo]
          } else {
            this.load(() => getDirectlyAdmin(this.myUserId), 'directlyAdmin')
          }
          break
        case 'directlyEmployee': // 获取员工直属下属
          if (this.getUserInfo.role === 'SUPERADMIN') {
            this.load(() => getAllEmployee(), 'allEmployee')
          } else if (this.getUserInfo.role === 'DEPARTMENTADMIN') {
            this.load(() => getDirectlyEmployee(this.myUserId), 'directlyEmployee')
          } else {
            this.employeesList = [this.getUserInfo]
          }
          break
        case 'financialEmployee': // 获取财务人员列表
          this.load(() => getFinancialEmployee(), 'financialEmployee')
          break
        case 'administrativeEmployee': // 获取行政人员列表
          this.load(() => getAdministrativeEmployee(), 'administrativeEmployee')
          break
        case 'allManager': // 获取所有管理者(超级管理员、管理员、财务、行政)
          this.load(() => getAllManager(), 'allManager')
          break
        case 'createTask': // 创建任务【办理人】选择框，比较麻烦
          if (this.getUserInfo.role === 'SUPERADMIN') {
            this.load(() => getAllEmployee(), 'allEmployee').then(() => {
              // 管理员没有给自己发任务的选项
              this.employeesList = this.employeesList.filter(p => p.role !== 'SUPERADMIN')
            })
          } else if (this.getUserInfo.role === 'DEPARTMENTADMIN') {
            this.load(() => getDirectlyEmployee(this.myUserId), 'directlyEmployee').then(() => {
              this.employeesList.unshift(this.getUserInfo) // 需要添加自己
            })
          } else {
            this.employeesList = [this.getUserInfo]
          }
          break
      }
    },
    async load (api, key) {
      // debugger
      this.updateLoading({
        key,
        callback: () => {
          api().then(res => {
            this.employeesList = res.data
            this.updateSelectList({ key, value: res.data })
          })
        }
      }).then(() => {
        // 延时3秒加载
        // 如果请求超过3秒则无法加载
        setTimeout(() => {
          console.log('Delay Load : ', key, this.getSelectCache(key))
          this.employeesList = this.getSelectCache(key)
        }, 3000)
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
      'getUserInfo',
      'myUserId',
      'getSelectCache',
      'isSelectCache'
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
