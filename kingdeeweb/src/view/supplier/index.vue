<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'供应商类别'"
                  :groupList="groupList"
                  :list="supplierList"
                  :selectGroup="selectGroup"
                  :updateFun="updateSupplierGroup"
                  :deleteFun="deleteSupplierGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id }"
                  @updateExpand="(bool) => { isExpand = bool }"/>

      <div class="measure_c">
        <div>
          <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <Input v-model="search" placeholder="输入供应商编号/名称/联系人/电话查询" style="width: 250px" />
              <Checkbox v-model="isShowStop" style="margin: 0 5px 0 10px;" />
              <span>显示禁用供应商</span>
            </div>
            <div>
              <Button style="margin-right: 10px;" @click="setSupplier('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchSupplier('删除', selectList)">删除</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchSupplier('启用', selectList)">启用</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchSupplier('禁用', selectList)">禁用</Button>
              <Button style="margin-right: 10px;" @click="loadGroup(), loadSupplier()">刷新</Button>
            </div>
          </Row>

          <Table :width="getTableWidth" :height="getTableHeight" border :columns="supplierColumns" :data="pageContent" :loading="loading" @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setSupplier('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchSupplier('删除', [row._id])">删除</Button>
            </template>

            <template slot-scope="{ row }" slot="group">
              {{ row.groupId ? groupList.find(f => f._id === row.groupId).name : ''}}
            </template>

            <template slot-scope="{ row }" slot="listName">
              {{ getListVal(row.list, 'name')}}
            </template>

            <template slot-scope="{ row }" slot="listPhone">
              {{ getListVal(row.list, 'phone')}}
            </template>

            <template slot-scope="{ row }" slot="listTel">
              {{ getListVal(row.list, 'tel')}}
            </template>

            <template slot-scope="{ row }" slot="listOther">
              {{ getListVal(row.list, 'other')}}
            </template>

            <template slot-scope="{ row }" slot="listAddress">
              {{ getListVal(row.list, 'address')}}
            </template>

            <template slot-scope="{ row }" slot="balance">
              {{ getBalance(row, 'balance')}}
            </template>

            <template slot-scope="{ row }" slot="status">
              <div @click="batchSupplier(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
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

    <supplierForm ref="supplierForm" @load="loadSupplier" :supplierList="supplierList" :groupList="groupList"></supplierForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import supplierForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub'
import NP from 'number-precision'
import {
  querySupplier,
  batchSupplier,
  updateSupplierGroup,
  querySupplierGroup,
  deleteSupplierGroup
} from '../../api/supplier'
export default {
  name: 'index',
  components: {
    leftExpand,
    supplierForm
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
      supplierColumns: [
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
          title: '供应商类别',
          slot: 'group',
          width: 100
        },
        {
          title: '供应商编码',
          key: 'code',
          width: 100
        },
        {
          title: '供应商名称',
          key: 'name',
          width: 200
        },
        {
          title: '联系人',
          slot: 'listName',
          width: 100
        },
        {
          title: '手机',
          slot: 'listPhone',
          width: 150
        },
        {
          title: '座机',
          slot: 'listTel',
          width: 150
        },
        {
          title: 'QQ/微信/Email',
          slot: 'listOther',
          width: 150
        },
        {
          title: '联系地址',
          slot: 'listAddress',
          width: 100
        },
        {
          title: '应收款余额',
          slot: 'balance',
          width: 100
        },
        {
          title: '备注',
          key: 'des',
          width: 200
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
          align: 'center'
        }
      ],
      supplierList: []
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
      let list = this.supplierList.filter(v => v.status === (this.isShowStop ? '禁用' : '启用'))
      let parentIds = this.selectGroup ? this.groupList.filter(v => v.parentIds.includes(this.selectGroup)).map(m => m._id) : []
      if (this.selectGroup) {
        list = list.filter(v => v.groupId === this.selectGroup || parentIds.includes(v.groupId))
      }
      if (this.search) {
        list = list.filter(v => (
          v.code.includes(this.search) ||
          v.name.includes(this.search) ||
          v.list.find(f => (f.name && f.name.includes(this.search)) || (f.phone && f.phone.toString().includes(this.search)))
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
          this.loadSupplier()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    updateSupplierGroup,
    deleteSupplierGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '供应商') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}供应商的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      querySupplierGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.groupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商组',
          desc: err.message
        })
      })
    },
    loadSupplier () {
      this.loading = true
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
          desc: err.message
        })
      })
    },
    getListVal (list, type) {
      let fData = list.find(f => f.isMain)
      let val = ''
      if (!fData) {
        fData = list.find(f => f.name)
      }
      val = fData[type]
      return val
    },
    getBalance (item, type) {
      let val = 0
      if (type === 'balance') {
        val = NP.minus(item.receivable || 0, item.payments || 0)
      }
      return val !== 0 ? val : ''
    },
    setSupplier (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id,
            groupId: item ? item.groupId : this.selectGroup
          }
          this.$refs.supplierForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.supplierForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchSupplier (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}供应商`,
        content: `是否${action}所选供应商`,
        onOk: () => {
          batchSupplier({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选供应商`)
            this.loadSupplier()
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
