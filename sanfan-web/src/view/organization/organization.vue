<template>
  <Card shadow style="height: 100%;width: 100%;overflow:auto">
    <Tabs v-model="tab">
      <TabPane label="公司组织构架" name="company">
        <div class="company_layer">
          <div class="department-outer">
            <div class="tip-box">
              <Alert type="warning" show-icon>鼠标右键点击部门可以查看部门，编辑部门，删除部门，添加部门等操作</Alert>
            </div>
            <div class="zoom-box">
              <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
            </div>
            <div class="view-box">
              <org-view
                v-if="organization"
                :data="organization"
                :zoom-handled="zoomHandled"
                @on-menu-click="handleMenuClick"
              ></org-view>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane label="员工列表" name="personal">
        <person-list />
      </TabPane>
    </Tabs>

    <edit-d ref="editD" />
    <modal-del ref="modalDel" :content="'确定真的要删除该部门吗'" :del="delDepart" />
    <employees ref="employees" />
  </Card>
</template>

<script>
import OrgView from './components/org-view.vue'
import ZoomController from './components/zoom-controller.vue'
import editD from './components/editD'
import personList from './components/personList'
import modalDel from '_c/modal-del/modal-del.vue'
import employees from '_c/employees/employees.vue'
import { mapGetters, mapActions } from 'vuex'
import { deleteDepartment } from '@/api/company'
export default {
  name: 'organization',
  components: {
    OrgView,
    ZoomController,
    editD,
    modalDel,
    employees,
    personList
  },
  data () {
    return {
      zoom: 100,
      tab: 'company'
    }
  },
  computed: {
    ...mapGetters([
      'organization'
    ]),
    zoomHandled () {
      return this.zoom / 100
    }
  },
  methods: {
    ...mapActions([
      'getOrganizationTree'
    ]),
    edit (data) {
      this.$refs.editD.open(data, false)
    },
    detail (data) {
      this.$refs.employees.open(data)
    },
    new (data) {
      this.$refs.editD.open(data, true)
    },
    delete (data) {
      this.$refs.modalDel.open(data)
    },
    delDepart (data) {
      if (!data.employees.length && (!data.children || (data.children && !data.children.length))) {
        deleteDepartment(data.id).then(res => {
          this.getOrganizationTree()
          this.$refs.modalDel.success('删除成功')
        }).catch((err) => {
          if (err.errorMsg) {
            this.$Notice.error({
              title: '错误提示',
              desc: err.errorMsg
            })
          }
        })
      } else {
        this.$refs.modalDel.error('该部门还有子部门或者员工，无法直接删除')
      }
    },
    handleMenuClick ({ data, key }) {
      // edit 编辑部门 detail 查看部门 new 新增子部门 delete 删除部门
      this[key](data)
    }
  },
  created () {
    this.getOrganizationTree()
  }
}
</script>

<style lang="less">
  @import "./organization.less";
</style>
