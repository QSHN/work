<template>
  <Card style="width: 100%; height: 100%; overflow: auto">
    <Tabs v-model="tab">
      <TabPane label="我的拜访" name="executor">
        <visit-table :tab="'executor'" @show="show" ref="executor" @look="look" :clientVisitingType="'TEL'" />
      </TabPane>

      <TabPane label="我的派发" name="creator" v-if="getUserInfo.role === 'SUPERADMIN' || getUserInfo.role === 'DEPARTMENTADMIN'">
        <visit-table :tab="'creator'" @show="show" ref="creator"  @look="look" :clientVisitingType="'TEL'" />
      </TabPane>
    </Tabs>
    <visit-create-modal ref="visitCreateModal" @update="load" :clientVisitingType="'TEL'" />
    <visit-detail ref="visitDetail" />
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDirectlyEmployee } from '@/api/employee'
import { getOrganizationTree } from '@/api/company'
import { selectData } from '@/libs/select.js'
import visitTable from './components/visit-table'
import visitCreateModal from './components/visit-create-modal'
import visitDetail from './components/visit-detail'
export default {
  name: 'visitList',
  components: {
    visitTable,
    visitCreateModal,
    visitDetail
  },
  data () {
    return {
      tab: 'executor',
      dSelectList: [],
      eSelectList: []
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    dSelectList () {
      this.loadClient()
    },
    eSelectList () {
      this.loadClient()
    }
  },
  methods: {
    selectData,
    show (type) {
      this.$refs.visitCreateModal.show(type)
    },
    load () {
      this.$refs.executor.load()
      this.$refs.creator.load()
    },
    look (data) {
      this.$refs.visitDetail.show(data)
    },
    loadClient () {
      if (this.dSelectList.length && this.eSelectList.length) {
        let list = [].concat(this.dSelectList).concat(this.eSelectList)
        this.$refs.visitCreateModal.getClient(list)
      }
    }
  },
  created () {
    if (this.getUserInfo.role === 'EMPLOYEE') {
      this.dSelectList = [this.getUserInfo.departmentId]
      this.eSelectList = [this.getUserInfo.id]
    } else {
      let departmentId = this.getUserInfo.role === 'SUPERADMIN' ? '' : this.getUserInfo.departmentId
      getOrganizationTree(departmentId).then(res => {
        let list = []
        if (res.data.children && res.data.children.length) {
          list = this.selectData({
            list: Object.assign([], res.data.children),
            id: 'id',
            name: 'name',
            children: 'children'
          })
        }
        list.unshift({ id: res.data.id, name: res.data.name })
        this.dSelectList = list.map(v => v.id)
      }).catch(err => {
        if (err.errorMsg) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.errorMsg
          })
        }
      })

      getDirectlyEmployee(this.getUserInfo.id).then(res => {
        let list = res.data
        list.unshift({
          id: this.getUserInfo.id,
          name: this.getUserInfo.name
        })
        this.eSelectList = list.map(v => v.id)
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
