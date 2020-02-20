<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'职员类别'"
                  :groupList="groupList"
                  :list="clerkList"
                  :selectGroup="selectGroup"
                  :updateFun="updateDepartment"
                  :deleteFun="deleteDepartment"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id }"
                  @updateExpand="(bool) => { isExpand = bool }"/>

      <div class="measure_c">
        <div>
          <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <Input v-model="search" placeholder="输入职员编号/职员名称/手机/部门查询" style="width: 250px" />
              <Checkbox v-model="isShowStop" style="margin: 0 5px 0 10px;" />
              <span>显示禁用职员</span>
            </div>
            <div>
              <Button style="margin-right: 10px;" @click="setClerk('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchClerk('删除', selectList)">删除</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchClerk('启用', selectList)">启用</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchClerk('禁用', selectList)">禁用</Button>
              <Button style="margin-right: 10px;" @click="loadGroup(), loadClerk()">刷新</Button>
            </div>
          </Row>

          <Table :width="getTableWidth" :height="getTableHeight" border :columns="clerkColumns" :data="pageContent" :loading="loading" @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setClerk('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchClerk('删除', [row._id])">删除</Button>
            </template>

            <template slot-scope="{ row }" slot="group">
              {{ row.groupId ? groupList.find(f => f._id === row.groupId).name : ''}}
            </template>

            <template slot-scope="{ row }" slot="status">
              <div @click="batchClerk(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
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

    <clerkForm ref="clerkForm" @load="loadClerk" :clerkList="clerkList" :groupList="groupList"></clerkForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clerkForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub_code'
import {
  queryClerk,
  batchClerk
} from '../../api/clerk'
import {
  queryDepartment,
  updateDepartment,
  deleteDepartment
} from '../../api/department'
export default {
  name: 'index',
  components: {
    leftExpand,
    clerkForm
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
      groupList: [],
      selectList: [],
      loading: true,
      clerkColumns: [
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
          title: '职员编码',
          key: 'code',
          width: 100
        },
        {
          title: '职员名称',
          key: 'name'
        },
        {
          title: '手机号码',
          key: 'phone',
          width: 200
        },
        {
          title: '部门',
          slot: 'group'
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
          align: 'center'
        }
      ],
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
      let list = this.clerkList.filter(v => v.status === (this.isShowStop ? '禁用' : '启用'))
      let parentIds = this.selectGroup ? this.groupList.filter(v => v.parentIds.includes(this.selectGroup)).map(m => m._id) : []
      if (this.selectGroup) {
        list = list.filter(v => v.groupId === this.selectGroup || parentIds.includes(v.groupId))
      }
      if (this.search) {
        list = list.filter(v => (
          v.code.includes(this.search) ||
          v.name.includes(this.search) ||
          v.phone.toString().includes(this.search) ||
          list.filter(f => f.groupId === v.groupId).name.includes(this.search)
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
          this.loadGroup()
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
          if (f.title === '职员') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}职员的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.groupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadClerk () {
      this.loading = true
      queryClerk({ accountSetId: this.accountSet._id }).then(res => {
        this.clerkList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '职员',
          desc: err.message
        })
      })
    },
    setClerk (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id,
            groupId: item ? item.groupId : this.selectGroup
          }
          this.$refs.clerkForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.clerkForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchClerk (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}职员`,
        content: `是否${action}所选职员`,
        onOk: () => {
          batchClerk({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选职员`)
            this.loadClerk()
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
