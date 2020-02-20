<template>
  <div>
    <div>
      <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
        <div style="display: flex; align-items: center;">
          <Input v-model="search" placeholder="输入收入类别编号/名称" style="width: 250px" />
          <Checkbox v-model="isShowStop" style="margin: 0 5px 0 10px;" />
          <span>显示禁用收入类别</span>
        </div>
        <div>
          <Button style="margin-right: 10px;" @click="setIncomeCategory('add', {accountSetId: accountSet._id}, '新增')">新增</Button>
          <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchIncomeCategory('删除', selectList)">删除</Button>
          <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchIncomeCategory('启用', selectList)">启用</Button>
          <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchIncomeCategory('禁用', selectList)">禁用</Button>
          <Button style="margin-right: 10px;" @click="loadIncomeCategory()">刷新</Button>
        </div>
      </Row>

      <Table :width="getTableWidth" :height="getTableHeight" border :columns="incomeCategoryColumns" :data="pageContent" :loading="loading" @on-selection-change="selectTable">
        <template slot-scope="{ row }" slot="action">
          <Button size="small" style="margin-right: 5px;" @click="setIncomeCategory('edit', row, '修改')">修改</Button>
          <Button size="small" @click="batchIncomeCategory('删除', [row._id])">删除</Button>
        </template>

        <template slot-scope="{ row }" slot="status">
          <div @click="batchIncomeCategory(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
            <div style="position: absolute; left: 0; top: 0; right:0; bottom: 0; z-index: 1; cursor: pointer"></div>
            <i-switch size="small" :value="row.status === '启用'" />
          </div>
        </template>
      </Table>

      <Row type="flex" justify="end" style="margin-top: 10px;">
        <Page :current.sync="current" :total="tableData.length" :page-size="pageSize" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
      </Row>
    </div>

    <incomeCategoryForm ref="incomeCategoryForm" @load="loadIncomeCategory" :incomeCategoryList="incomeCategoryList"></incomeCategoryForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import incomeCategoryForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub_code'
import {
  updateIncomeCategory,
  queryIncomeCategory,
  deleteIncomeCategory,
  batchIncomeCategory
} from '../../api/incomeCategory'
export default {
  name: 'index',
  components: {
    leftExpand,
    incomeCategoryForm
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
      incomeCategoryColumns: [
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
          title: '收入类别编码',
          key: 'code',
          width: 200
        },
        {
          title: '收入类别名称',
          key: 'name'
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
          align: 'center'
        }
      ],
      incomeCategoryList: []
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
      let list = this.incomeCategoryList.filter(v => v.status === (this.isShowStop ? '禁用' : '启用'))
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
          this.loadIncomeCategory()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    updateIncomeCategory,
    deleteIncomeCategory,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '收入类别') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}收入类别的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadIncomeCategory () {
      this.loading = true
      queryIncomeCategory({ accountSetId: this.accountSet._id }).then(res => {
        this.incomeCategoryList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '收入类别',
          desc: err.message
        })
      })
    },
    setIncomeCategory (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id
          }
          this.$refs.incomeCategoryForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.incomeCategoryForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchIncomeCategory (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}收入类别`,
        content: `是否${action}所选收入类别`,
        onOk: () => {
          batchIncomeCategory({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选收入类别`)
            this.loadIncomeCategory()
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
