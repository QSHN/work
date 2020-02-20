<template>
  <div>
    <div style="display: flex">
      <leftExpand ref="leftExpand"
                  :title="'仓库类别'"
                  :groupList="groupList"
                  :list="warehouseList"
                  :selectGroup="selectGroup"
                  :updateFun="updateWarehouseGroup"
                  :deleteFun="deleteWarehouseGroup"
                  @load="loadGroup"
                  @selectGroup="(id) => { selectGroup = id }"
                  @updateExpand="(bool) => { isExpand = bool }"/>

      <div class="measure_c">
        <div>
          <Row type="flex" justify="space-between" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <Input v-model="search" placeholder="输入仓库编号/名称/联系人/联系手机查询" style="width: 250px" />
              <Checkbox v-model="isShowStop" style="margin: 0 5px 0 10px;" />
              <span>显示禁用仓库</span>
            </div>
            <div>
              <Button style="margin-right: 10px;" @click="setWarehouse('add', {groupId: selectGroup, accountSetId: accountSet._id}, '新增')">新增</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchWarehouse('删除', selectList)">删除</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchWarehouse('启用', selectList)">启用</Button>
              <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="batchWarehouse('禁用', selectList)">禁用</Button>
              <Button style="margin-right: 10px;" @click="loadGroup(), loadWarehouse()">刷新</Button>
            </div>
          </Row>

          <Table :width="getTableWidth" :height="getTableHeight" border :columns="warehouseColumns" :data="pageContent" :loading="loading" @on-selection-change="selectTable">
            <template slot-scope="{ row }" slot="action">
              <Button size="small" style="margin-right: 5px;" @click="setWarehouse('edit', row, '修改')">修改</Button>
              <Button size="small" @click="batchWarehouse('删除', [row._id])">删除</Button>
            </template>

            <template slot-scope="{ row }" slot="group">
              {{ row.groupId ? groupList.find(f => f._id === row.groupId).name : ''}}
            </template>

            <template slot-scope="{ row }" slot="addressList">
              {{ getAddress(row.addressList) }}
            </template>

            <template slot-scope="{ row }" slot="status">
              <div @click="batchWarehouse(row.status === '启用' ? '禁用' : '启用', [row._id])" style="position: relative;">
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

    <warehouseForm ref="warehouseForm" @load="loadWarehouse" :warehouseList="warehouseList" :groupList="groupList"></warehouseForm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import warehouseForm from './form'
import moment from 'moment'
import leftExpand from '../../components/leftExpand/index_sub'
import { city } from '../../libs/province'
import {
  queryWarehouse,
  batchWarehouse,
  updateWarehouseGroup,
  queryWarehouseGroup,
  deleteWarehouseGroup
} from '../../api/warehouse'
export default {
  name: 'index',
  components: {
    leftExpand,
    warehouseForm
  },
  data () {
    return {
      city,
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
      warehouseColumns: [
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
          title: '仓库编码',
          key: 'code',
          width: 100
        },
        {
          title: '仓库名称',
          key: 'name',
          width: 200
        },
        {
          title: '仓库类别',
          slot: 'group',
          width: 100
        },
        {
          title: '联系人',
          key: 'contact',
          width: 150
        },
        {
          title: '联系电话',
          key: 'tel',
          width: 150
        },
        {
          title: '联系手机',
          key: 'phone',
          width: 150
        },
        {
          title: '仓库地址',
          slot: 'addressList',
          width: 200
        },
        {
          title: '详细地址',
          key: 'address',
          width: 200
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
      warehouseList: []
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
      let list = this.warehouseList.filter(v => v.status === (this.isShowStop ? '禁用' : '启用'))
      let parentIds = this.selectGroup ? this.groupList.filter(v => v.parentIds.includes(this.selectGroup)).map(m => m._id) : []
      if (this.selectGroup) {
        list = list.filter(v => v.groupId === this.selectGroup || parentIds.includes(v.groupId))
      }
      if (this.search) {
        list = list.filter(v => (
          v.code.includes(this.search) ||
          v.name.includes(this.search) ||
          (v.contact && v.contact.includes(this.search)) ||
          (v.phone && v.phone.toString().includes(this.search))
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
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    updateWarehouseGroup,
    deleteWarehouseGroup,
    judge (action) {
      let bool = false
      if (this.myPermission && this.myPermission.length) {
        this.myPermission.forEach(f => {
          if (f.title === '仓库') {
            let fData = f.operation.find(f => f.action === action)
            if (fData) {
              bool = fData.val
              if (!bool) this.$Message.error(`您没有${action}仓库的权力，请联系管理员`)
            }
          }
        })
      }
      return bool
    },
    loadGroup () {
      queryWarehouseGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.groupList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '仓库组',
          desc: err.message
        })
      })
    },
    loadWarehouse () {
      this.loading = true
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '仓库',
          desc: err.message
        })
      })
    },
    setWarehouse (type, item, title) {
      if (!this.judge(title)) return
      let formData = item ? Object.assign({}, item) : {}
      switch (type) {
        case 'add':
          formData = {
            accountSetId: this.accountSet._id,
            creator: this.myUser._id,
            groupId: item ? item.groupId : this.selectGroup
          }
          this.$refs.warehouseForm.show('新建', null, formData)
          break
        case 'edit':
          this.$refs.warehouseForm.show('修改', formData)
          break
      }
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    },
    batchWarehouse (action, list) {
      if (!this.judge(action)) return
      this.$Modal.confirm({
        title: `${action}仓库`,
        content: `是否${action}所选仓库`,
        onOk: () => {
          batchWarehouse({
            ids: list,
            action: action
          }).then(res => {
            this.$Message.success(`成功${action}所选仓库`)
            this.loadWarehouse()
          }).catch(err => {
            this.$Message.error(err.message)
          })
        }
      })
    },
    getAddress (list) {
      let val = ''
      let length = list.length
      let i = 0
      let p = (index, city) => {
        let fData = city.find(f => f.value === list[index])
        val += fData.label
        if (i < list.length - 1) {
          i++
          p(i, fData.children)
        }
      }
      if (length > 0) p(i, this.city)
      return val
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
