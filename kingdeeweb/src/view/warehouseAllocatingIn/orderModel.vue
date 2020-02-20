<template>
  <Modal
    v-model="modal"
    title="调拨出库单"
    :mask-closable="false"
    width="1200"
    :styles="{top: '20px'}"
    @on-cancel="cancel">
    <div style="display: flex; align-items: center;">
      <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
        <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
      </Select>
      <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 300px;" />
      <Button style="margin-left: 10px;" @click="load">搜索</Button>
    </div>

    <Table :width="1170"
           :height="500"
           border
           :columns="columns"
           :loading="loading"
           :data="tableData"
           :span-method="handleSpan"
           @on-selection-change="selectTable"
           style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="code">
        <router-link :to="{
          name: 'warehouseAllocatingOut',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="departmentIdOut">
        {{ departmentList.find(f => f._id === row.departmentIdOut) && departmentList.find(f => f._id === row.departmentIdOut).name }}
      </template>
      <template slot-scope="{ row }" slot="departmentIdIn">
        {{ departmentList.find(f => f._id === row.departmentIdIn) && departmentList.find(f => f._id === row.departmentIdIn).name }}
      </template>
      <template slot-scope="{ row }" slot="audit">
        <Tag color="green" v-if="row.audit === '已审核'">已审核</Tag>
        <Tag color="red" v-else>未审核</Tag>
      </template>
      <template slot-scope="{ row }" slot="resultStatus">
        <Tag color="green" v-if="row.resultStatus === '已处理'">已处理</Tag>
        <Tag color="red" v-else>未处理</Tag>
      </template>
      <template slot-scope="{ row }" slot="commodityWarehouseOut">
        {{ warehouseList.find(f => f._id === row.commodityWarehouseOut) && warehouseList.find(f => f._id === row.commodityWarehouseOut).name }}
      </template>
      <template slot-scope="{ row }" slot="commodityWarehouseIn">
        {{ warehouseList.find(f => f._id === row.commodityWarehouseIn) && warehouseList.find(f => f._id === row.commodityWarehouseIn).name }}
      </template>
    </Table>

    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Page :current.sync="search.pageInfo.page" :total="total" :page-size="search.pageInfo.limit" :page-size-opts="pageSizeOpts" size="small" show-elevator show-sizer />
    </Row>

    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="success" @click="sure">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { queryWarehouseAllocatingOut } from '../../api/warehouseAllocatingOut'
import { queryDepartment } from '../../api/department'
import { queryWarehouse } from '../../api/warehouse'
export default {
  name: 'warehouseAllocatingOutList',
  data () {
    return {
      total: 0,
      pageSizeOpts: [10, 20, 50],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按单据编号/商品名称',
          formula: ['code', 'list.name']
        },
        {
          title: '按单据编号',
          placeholder: '请输入按单据编号',
          formula: ['code']
        },
        {
          title: '商品名称',
          placeholder: '请输入商品名称',
          formula: ['list.name']
        }
      ],
      search: {
        searchVal: '',
        filter: {
          accountSetId: null
        },
        pageInfo: {
          limit: 10,
          page: 1
        }
      },
      selectList: [],
      loading: true,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          resizable: true
        },
        {
          title: '单据编号',
          width: 200,
          slot: 'code',
          resizable: true
        },
        {
          title: '单据日期',
          width: 150,
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '调出部门',
          width: 150,
          slot: 'departmentIdOut',
          resizable: true
        },
        {
          title: '调入部门',
          width: 150,
          slot: 'departmentIdIn',
          resizable: true
        },
        {
          title: '审核状态',
          width: 100,
          align: 'center',
          slot: 'audit',
          resizable: true
        },
        {
          title: '差异处理状态',
          width: 150,
          align: 'center',
          slot: 'resultStatus',
          resizable: true
        },
        {
          title: '调出仓库',
          width: 150,
          slot: 'commodityWarehouseOut',
          resizable: true
        },
        {
          title: '调入仓库',
          width: 150,
          slot: 'commodityWarehouseIn',
          resizable: true
        },
        {
          title: '商品编码',
          width: 150,
          key: 'commodityCode',
          resizable: true
        },
        {
          title: '商品名称',
          width: 150,
          key: 'commodityName',
          resizable: true
        },
        {
          title: '单位',
          width: 150,
          key: 'commodityUnit',
          resizable: true
        },
        {
          title: '数量',
          width: 150,
          key: 'commodityNumber',
          resizable: true
        },
        {
          title: '单位成本',
          width: 150,
          key: 'commodityUnitDelivery',
          resizable: true
        },
        {
          title: '成本',
          width: 150,
          key: 'commodityDeliveryCost',
          resizable: true
        },
        {
          title: '商品行备注',
          width: 150,
          key: 'commodityDes',
          resizable: true
        }
      ],
      tableData: [],
      departmentList: [],
      warehouseAllocatingOut: [],
      modal: false
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myPermission',
      'myUser',
      'adminList',
      'userList'
    ])
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadDepartment()
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    show () {
      this.load()
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    sure () {
      this.$emit('selectOrder', this.warehouseAllocatingOut.filter(f => this.selectList.includes(f._id)))
      this.cancel()
    },
    loadDepartment () {
      queryDepartment({ accountSetId: this.accountSet._id }).then(res => {
        this.departmentList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '部门',
          desc: err.message
        })
      })
    },
    loadWarehouse () {
      queryWarehouse({ accountSetId: this.accountSet._id }).then(res => {
        this.warehouseList = res.data
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    load () {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id
      }
      if (search.searchVal) {
        let formula = this.searchList.find(f => f.title === this.whichSearchType).formula
        this.$set(filter, '$or', [])
        formula.forEach(f => {
          let obj = {}
          if (f.includes('.')) {
            let c = f.split('.')
            let o = {}
            o[c[1]] = { $regex: search.searchVal }
            this.$set(obj, c[0], { $elemMatch: o })
            filter['$or'].push(obj)
          } else {
            this.$set(obj, f, { $regex: search.searchVal })
            filter['$or'].push(obj)
          }
        })
      }
      search.filter = filter
      delete search.searchVal
      queryWarehouseAllocatingOut(search).then(res => {
        let list = []
        res.data.list.forEach(f => {
          f.list.forEach(fl => {
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              departmentIdOut: f.departmentIdOut,
              departmentIdIn: f.departmentIdIn,
              audit: f.audit,
              resultStatus: f.resultStatus,
              commodityCode: fl.code,
              commodityName: fl.name,
              commodityWarehouseOut: fl.warehouseId,
              commodityWarehouseIn: fl.warehouseIdIn,
              commodityUnit: fl.unit,
              commodityNumber: fl.number,
              commodityUnitDelivery: f.businessType === '异价调拨' ? fl.unitDelivery : '',
              commodityDeliveryCost: f.businessType === '异价调拨' ? fl.deliveryCost : '',
              commodityDes: fl.commodityDes
            })
          })
        })
        if (this.selectList.length) {
          list.forEach(f => {
            if (this.selectList.includes(f._id)) {
              f._checked = true
            }
          })
        }
        this.tableData = list
        this.total = res.data.total
        this.warehouseAllocatingOut = res.data.list
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '商品',
          desc: err.message
        })
      })
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (
        column.type === 'selection' ||
        column.slot === 'code' ||
        column.slot === 'dateTime' ||
        column.slot === 'departmentIdOut' ||
        column.slot === 'departmentIdIn' ||
        column.slot === 'audit' ||
        column.slot === 'resultStatus'
      ) {
        if (rowIndex === this.tableData.findIndex((f, i) => f._id === row._id)) {
          let num = this.tableData.filter(v => v._id === row._id).length
          if (num > 1) {
            return {
              rowspan: num,
              colspan: 1
            }
          }
        } else {
          let num = this.tableData.filter(v => v._id === row._id).length
          if (num > 1) {
            return [0, 0]
          }
        }
      }
      // console.log(row, column)
    },
    selectTable (list) {
      this.selectList = Array.from(new Set(list.map(v => v._id)))
    }
  }
}
</script>

<style scoped>

</style>
