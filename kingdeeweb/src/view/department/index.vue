<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'部门'"
                  :groupList="departmentList"
                  :list="clerkList"
                  :selectGroup="selectGroup"
                  :updateFun="updateDepartment"
                  :deleteFun="deleteDepartment"
                  @load="loadDepartment"
                  @selectGroup="(id) => { selectGroup = id }"
                  @updateExpand="(bool) => { isExpand = bool }"/>

      <div class="measure_c">
        <div>
          <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <Input v-model="search" placeholder="输入部门编号/名称" style="width: 250px" />
              <Checkbox v-model="isShowStop" style="margin: 0 5px 0 10px;" />
              <span>显示禁用部门</span>
            </div>
            <div>
              <Button style="margin-right: 10px;" @click="setDepartment('add', {accountSetId: accountSet._id}, '新增')">新增</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchDepartment('删除', selectList)">删除</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchDepartment('启用', selectList)">启用</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchDepartment('禁用', selectList)">禁用</Button>
              <Button style="margin-right: 10px;" @click="loadDepartment()">刷新</Button>
            </div>
          </Row>

          <Table :width="getTableWidth" :height="getTableHeight" border :columns="departmentColumns" :data="pageContent" :loading="loading" @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setDepartment('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchDepartment('删除', [row._id])">删除</Button>
            </template>

            <template slot-scope="{ row }" slot="parentIds">
              {{ row.parentIds && row.parentIds.length ? row.parentIds.reduce((total, id) => (total = (total ? '-' : '') + departmentList.find(f => f._id === id).name), '') : ''}}
            </template>

            <template slot-scope="{ row }" slot="status">
              <div @click="batchDepartment(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
                <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
                <i-switch size="small" :value="row.status === '启用'" />
              </div>
            </template>
          </Table>

          <Row type="flex" justify="end" style="margin-top: 10px;">
            <Page :current.sync="current" :total="tableData.length" :page-size="pageSize" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
          </Row>
        </div>
      </div>
    </div>

    <departmentForm ref="departmentForm" @load="loadDepartment" :departmentList="departmentList"></departmentForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import departmentForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub_code'
import {
  updateDepartment,
  queryDepartment,
  deleteDepartment,
  batchDepartment
} from '../../api/department'
import { queryClerk } from '../../api/clerk'
export default {
  name: 'index',
  components: {
    leftExpand,
    departmentForm
  },
  data () {
    return {
      current: 1,
      pageSize: 50,
      pageSizeOpts: [50, 100],
      search: null,
      isShowStop: false,
      isExpand: true,
      selectGroup: null,
      selectList: [],
      loading: true,
      departmentColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        },
        {
          title: '部门编码',
          key: 'code',
          width: 100
        },
        {
          title: '部门名称',
          key: 'name'
        },
        {
          title: '上级部门',
          slot: 'parentIds'
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
          align: 'center'
        }
      ],
      departmentList: [],
      clerkList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList',
      'userList'
    ]),
    tableData () {
      let list = this.departmentList.filter(v => v.status === (this.isShowStop ? '禁用' : '启用'))
      if (this.selectGroup) {
        list = list.filter(v => v.parentIds.includes(this.selectGroup) || v._id === this.selectGroup)
      }
      if (this.search) {
        list = list.filter(v => (
          v.code.includes(this.search) ||
          v.name.includes(this.search)
        ))
      }
      if (this.selectList.length) {
        list.forEach(f => {
          if (this.selectList.includes(f._id)) {
            f._checked = true
          }
        })
      }
      return list
    },
    pageContent () {
      return this.tableData.slice((this.current - 1) * this.pageSize, this.current * this.pageSize)
    },
    getTableHeight () {
      return window.innerHeight - 230
    },
    getTableWidth () {
      return window.innerWidth - 110 - (this.isExpand ? 230 : 10)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadDepartment()
          this.loadClerk()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    updateDepartment,
    deleteDepartment,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '部门') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}部门的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadDepartment () {
      this.loading = true
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadClerk () {
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    setDepartment (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id,
            parentIds: item.parentIds ? item.parentIds : this.selectGroup ? Object.assign([this.selectGroup], this.departmentList.find(f => f._id === this.selectGroup).parentIds) : []
          }
          this.$refs.departmentForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.departmentForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchDepartment (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}部门`,
        content: `是否${action}所选部门`,
        onOk: () => {
          batchDepartment({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选部门`)
            this.loadDepartment()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .measure_c {
    display: flex;
    flex-grow: 1;
    background: #fff;
    padding: 10px;
    overflow: hidden;
  }
</style>
