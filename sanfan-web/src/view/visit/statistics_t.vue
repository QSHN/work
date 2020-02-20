<template>
  <Card style="width: 100%; height: 100%; overflow: auto">
    <template v-if="tabList.length">
      <Tabs v-model="tab">
        <TabPane v-for="(v, i) in tabList" :key="i" :label="v.label" :name="v.name">
          <statistic-echart :tab="v.name" :dSelectList="dSelectList" :eSelectList="eSelectList" :clientVisitingType="'TEL'" />
        </TabPane>
      </Tabs>
    </template>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDirectlyEmployee } from '@/api/employee'
import { getOrganizationTree } from '@/api/company'
import { selectData } from '@/libs/select.js'
import statisticEchart from './components/statistic-echart'
export default {
  name: 'statistics',
  components: { statisticEchart },
  data () {
    return {
      tab: '',
      tabList: [],
      dSelectList: [],
      eSelectList: []
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  methods: {
    selectData
  },
  created () {
    if (this.getUserInfo.role === 'SUPERADMIN') {
      // 超管
      this.tab = 'company'
      this.tabList = [
        {
          label: '公司',
          name: 'company'
        },
        {
          label: '部门',
          name: 'department'
        },
        {
          label: '员工',
          name: 'employ'
        }
      ]
    } else if (this.getUserInfo.role === 'DEPARTMENTADMIN') {
      // 部门管理
      this.tab = 'department'
      this.tabList = [
        {
          label: '部门',
          name: 'department'
        },
        {
          label: '员工',
          name: 'employ'
        }
      ]
    } else {
      // 普通员工
      this.tab = 'employ'
      this.tabList = [
        {
          label: '员工',
          name: 'employ'
        }
      ]
    }
    if (this.getUserInfo.role === 'EMPLOYEE') {
      this.$nextTick(() => {
        this.eSelectList = [{
          id: this.getUserInfo.id,
          name: this.getUserInfo.name
        }]
      })
    } else {
      let departmentId = this.getUserInfo.role === 'SUPERADMIN' ? '' : this.getUserInfo.departmentId
      getOrganizationTree(departmentId).then(res => {
        if (res.data.children && res.data.children.length) {
          this.dSelectList = this.selectData({
            list: Object.assign([], res.data.children),
            id: 'id',
            name: 'name',
            children: 'children'
          })
        }
        if (departmentId) {
          this.dSelectList.unshift({ id: res.data.id, name: res.data.name })
        }
      }).catch(err => {
        if (err.errorMsg) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.errorMsg
          })
        }
      })

      getDirectlyEmployee(this.getUserInfo.id).then(res => {
        this.eSelectList = res.data
        if (departmentId) {
          this.eSelectList.unshift({
            id: this.getUserInfo.id,
            name: this.getUserInfo.name
          })
        }
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
}
</script>

<style scoped>

</style>
