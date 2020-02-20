<template>
  <div>
    <Row type="flex" justify="space-between">
      <Row>
        <div style="display: flex; align-items: center;">
          <Select v-model="whichSearchType" style="width: 100px; margin-right: 10px;">
            <Option v-for="(item, index) in searchList" :value="item.title" :key="index">{{ item.title }}</Option>
          </Select>
          <Input v-model="search.searchVal" :placeholder="searchList.find(f => f.title === whichSearchType).placeholder" style="width: 300px;" />
          <Button style="margin-left: 10px;" @click="load">搜索</Button>
        </div>
      </Row>

      <ButtonGroup>
        <Button style="width: 80px; margin-left: 10px;" @click="load">刷新</Button>
      </ButtonGroup>
    </Row>

    <Row type="flex" style="margin-top: 10px;">
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="pwFun(true)">生成其他入库单</Button>
      <Button style="margin-right: 10px;" :disabled="!selectList.length" @click="pwFun(false)">生成其他出库单</Button>
    </Row>

    <Table :width="getTableWidth"
           :height="getTableHeight"
           border
           :columns="columns"
           :loading="loading"
           :data="tableData"
           :span-method="handleSpan"
           @on-selection-change="selectTable"
           style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="status">
        {{
          tableData.filter(v => v._id === row._id && v.commodityDiffNumber !== 0).length
            ? tableData.filter(v => v._id === row._id && v.commodityInNumber > 0).length
              ? '部分入库'
              : '未入库'
            : '全部入库'
        }}
      </template>
      <template slot-scope="{ row }" slot="code">
        <router-link :to="{
          name: 'warehouseAllocatingOut',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="inCode">
        <router-link :to="{
          name: 'warehouseAllocatingIn',
          query: { id: row.inId }
        }">{{ row.inCode }}</router-link>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { warehouseAllocatingDiff } from '../../api/warehouseAllocatingOut'
import { queryWarehouse } from '../../api/warehouse'
import NP from 'number-precision'
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
          title: '调拨出库日期',
          width: 200,
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '业务类型',
          width: 150,
          key: 'businessType',
          resizable: true
        },
        {
          title: '调拨状态',
          width: 150,
          slot: 'status',
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
          title: '调拨出库单编号',
          width: 200,
          slot: 'code',
          resizable: true
        },
        {
          title: '调拨入库单编号',
          width: 200,
          slot: 'inCode',
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
          title: '出库数量',
          width: 150,
          key: 'commodityNumber',
          resizable: true
        },
        {
          title: '入库数量',
          width: 150,
          key: 'commodityInNumber',
          resizable: true
        },
        {
          title: '差异数量',
          width: 150,
          key: 'commodityDiffNumber',
          resizable: true
        }
      ],
      tableData: [],
      warehouseList: [],
      warehouseAllocatingOut: []
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
    getTableHeight () {
      return window.innerHeight - 250
    },
    getTableWidth () {
      return window.innerWidth - 100
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.load()
          this.loadWarehouse()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
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
        accountSetId: this.accountSet._id,
        audit: '已审核'
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
      warehouseAllocatingDiff(search).then(res => {
        let list = []
        let inList = res.data.inList || []
        res.data.list.forEach(f => {
          f.list.forEach(fl => {
            let inCode = null
            let inId = null
            let inAudit = null
            let warehouseIdIn = null
            inList.forEach(fi => fi.list.forEach(fil => {
              if (fil.pId === f._id && fl.code === fil.code && fl.auxiliary === fil.auxiliary && fl.unit === fil.unit) {
                inCode = fi.code
                inId = fi._id
                inAudit = fi.audit
                warehouseIdIn = fil.warehouseId
              }
            }))
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              departmentIdOut: f.departmentIdOut,
              departmentIdIn: f.departmentIdIn,
              audit: f.audit,
              businessType: f.businessType,
              resultStatus: f.resultStatus,
              commodityCode: fl.code,
              commodityName: fl.name,
              commodityWarehouseOut: fl.warehouseId,
              commodityWarehouseIn: warehouseIdIn || fl.warehouseIdIn,
              commodityUnit: fl.unit,
              commodityNumber: fl.number,
              commodityInNumber: fl.inNumber || 0,
              commodityDiffNumber: NP.minus(fl.number || 0, fl.inNumber || 0),
              commodityUnitDelivery: f.businessType === '异价调拨' ? fl.unitDelivery : '',
              commodityDeliveryCost: f.businessType === '异价调拨' ? fl.deliveryCost : '',
              commodityDes: fl.commodityDes,
              inCode,
              inId,
              inAudit
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
        column.slot === 'dateTime' ||
        column.slot === 'businessType' ||
        column.slot === 'status' ||
        column.slot === 'code' ||
        column.slot === 'inCode' ||
        column.slot === 'resultStatus'
      ) {
        if (rowIndex === this.tableData.findIndex((f, i) => f._id === row._id)) {
          let num = this.tableData.filter(v => v._id === row._id).length
          let inNum = this.tableData.filter(v => v._id === row._id && v.inCode === row.inCode).length
          if (num > 1) {
            if (column.slot === 'inCode') {
              return {
                rowspan: inNum,
                colspan: 1
              }
            } else {
              return {
                rowspan: num,
                colspan: 1
              }
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
    },
    pwFun (isIN) {
      let error = ''
      let selectList = Array.from(new Set(this.selectList))
      selectList.forEach(id => {
        let fData = this.warehouseAllocatingOut.find(f => f._id === id)
        let iData = this.tableData.find(f => f._id === id)
        if (fData.audit === '未审核') {
          error += `<P>调拨出库单${fData.code}未审核，无法进行该操作</P>`
        }
        if (iData.inAudit === '未审核') {
          error += `<P>调拨入库单${fData.code}未审核，无法进行该操作</P>`
        }
      })
      if (error) {
        this.$Modal.error({
          title: isIN ? '生成其他入库单' : '生成其他出库单',
          content: error
        })
      } else {
        let obj = {
          name: isIN ? 'warehouseAllocatingIn' : 'warehouseAllocatingOut'
        }
        if (isIN) {
          this.$set(obj, 'query', {
            pId: this.selectList.join(',')
          })
        }
        this.$router.push(obj)
      }
    }
  }
}
</script>

<style scoped>

</style>
