<template>
  <div>
    <div>
      <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
        <div style="display: flex; align-items: center;">
          <Input v-model="search" placeholder="输入支出类别编号/名称" style="width: 250px" />
          <Checkbox v-model="isShowStop" style="margin: 0 5px 0 10px;" />
          <span>显示禁用支出类别</span>
        </div>
        <div>
          <Button style="margin-right: 10px;" @click="setSpendingCategory('add', {accountSetId: accountSet._id}, '新增')">新增</Button>
          <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchSpendingCategory('删除', selectList)">删除</Button>
          <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchSpendingCategory('启用', selectList)">启用</Button>
          <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchSpendingCategory('禁用', selectList)">禁用</Button>
          <Button style="margin-right: 10px;" @click="loadSpendingCategory()">刷新</Button>
        </div>
      </Row>

      <Table :width="getTableWidth" :height="getTableHeight" border :columns="spendingCategoryColumns" :data="pageContent" :loading="loading" @on-selection-change="selectTable">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px;" @click="setSpendingCategory('edit', row, '修改')">修改</Button>
          <Button size="small" @click="batchSpendingCategory('删除', [row._id])">删除</Button>
        </template>

        <template slot-scope="{ row }" slot="status">
          <div @click="batchSpendingCategory(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
            <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
            <i-switch size="small" :value="row.status === '启用'" />
          </div>
        </template>
      </Table>

      <Row type="flex" justify="end" style="margin-top: 10px;">
        <Page :current.sync="current" :total="tableData.length" :page-size="pageSize" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
      </Row>
    </div>

    <spendingCategoryForm ref="spendingCategoryForm" @load="loadSpendingCategory" :spendingCategoryList="spendingCategoryList"></spendingCategoryForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import spendingCategoryForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub_code'
import {
  updateSpendingCategory,
  querySpendingCategory,
  deleteSpendingCategory,
  batchSpendingCategory
} from '../../api/spendingCategory'
export default {
  name: 'index',
  components: {
    leftExpand,
    spendingCategoryForm
  },
  data () {
    return {
      current: 1,
      pageSize: 50,
      pageSizeOpts: [50, 100],
      search: null,
      isShowStop: false,
      isExpand: true,
      selectList: [],
      loading: true,
      spendingCategoryColumns: [
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
          title: '支出类别编码',
          key: 'code',
          width: 200
        },
        {
          title: '支出类别名称',
          key: 'name'
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
          align: 'center'
        }
      ],
      spendingCategoryList: [],
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
      let list = this.spendingCategoryList.filter(v => v.status === (this.isShowStop ? '禁用' : '启用'))
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
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadSpendingCategory()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    updateSpendingCategory,
    deleteSpendingCategory,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '支出类别') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}支出类别的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadSpendingCategory () {
      this.loading = true
      querySpendingCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.spendingCategoryList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '支出类别',
          desc: err.message
        })
      })
    },
    setSpendingCategory (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id
          }
          this.$refs.spendingCategoryForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.spendingCategoryForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchSpendingCategory (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}支出类别`,
        content: `是否${action}所选支出类别`,
        onOk: () => {
          batchSpendingCategory({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选支出类别`)
            this.loadSpendingCategory()
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
</style>
