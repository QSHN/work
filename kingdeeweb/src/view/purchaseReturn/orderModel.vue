<template>
  <Modal
    v-model="modal"
    title="采购入库单"
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
          name: 'purchaseWarehouse',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="supplierId">
        {{ supplierList.find(f => f._id === row.supplierId) && supplierList.find(f => f._id === row.supplierId).name }}
      </template>
      <template slot-scope="{ row }" slot="departmentId">
        {{ departmentList.find(f => f._id === row.departmentId) && departmentList.find(f => f._id === row.departmentId).name }}
      </template>
      <template slot-scope="{ row }" slot="clerkId">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).name }}
      </template>
      <template slot-scope="{ row }" slot="audit">
        <Tag color="green" v-if="row.audit === '已审核'">已审核</Tag>
        <Tag color="red" v-else>未审核</Tag>
      </template>
      <template slot-scope="{ row }" slot="paymentStatus">
        <Tag color="blue" v-if="row.paymentStatus === '部分付款'">部分付款</Tag>
        <Tag color="green" v-else-if="row.paymentStatus === '全部付款'">全部付款</Tag>
        <Tag color="red" v-else>未付款</Tag>
      </template>
      <template slot-scope="{ row }" slot="commodityWarehouse">
        {{ warehouseList.find(f => f._id === row.commodityWarehouse) && warehouseList.find(f => f._id === row.commodityWarehouse).name }}
      </template>
      <template slot-scope="{ row }" slot="paid">
        {{ row.paid ? formatMoney(row.paid, '', 2) : '' }}
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
import { queryPurchaseWarehouse } from '../../api/purchaseWarehouse'
import { querySupplier } from '../../api/supplier'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { queryWarehouse } from '../../api/warehouse'
export default {
  name: 'purchaseReturnList',
  data () {
    return {
      total: 0,
      pageSizeOpts: [10, 20, 50],
      whichSearchType: '快捷查询',
      searchList: [
        {
          title: '快捷查询',
          placeholder: '按单据编号/供应商/商品名称',
          formula: ['code', 'supplier', 'list.name']
        },
        {
          title: '按单据编号',
          placeholder: '请输入按单据编号',
          formula: ['code']
        },
        {
          title: '供应商',
          placeholder: '请输入供应商',
          formula: ['supplier']
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
          title: '供应商',
          width: 150,
          slot: 'supplierId',
          resizable: true
        },
        {
          title: '部门',
          width: 150,
          slot: 'departmentId',
          resizable: true
        },
        {
          title: '业务员',
          width: 150,
          slot: 'clerkId',
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
          title: '付款状态',
          width: 100,
          align: 'center',
          slot: 'paymentStatus',
          resizable: true
        },
        {
          title: '已付款金额',
          width: 150,
          slot: 'paid',
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
          title: '仓库',
          width: 150,
          slot: 'commodityWarehouse',
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
          title: '单价',
          width: 150,
          key: 'commodityPrice',
          resizable: true
        },
        {
          title: '含税单价',
          width: 150,
          key: 'commodityUnitPrice',
          resizable: true
        },
        {
          title: '增值税率%',
          width: 150,
          key: 'commodityTaxRate',
          resizable: true
        },
        {
          title: '税额',
          width: 150,
          key: 'commodityPayable',
          resizable: true
        },
        {
          title: '价税合计',
          width: 150,
          key: 'commodityPayableTotal',
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
      supplierList: [],
      departmentList: [],
      clerkList: [],
      warehouseList: [],
      purchaseWarehouse: [],
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
          this.loadSupplier()
          this.loadClerk()
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
    show (supplierId) {
      this.load(supplierId)
      this.modal = true
    },
    cancel () {
      this.modal = false
    },
    sure () {
      this.$emit('selectOrder', this.purchaseWarehouse.filter(f => this.selectList.includes(f._id)))
      this.cancel()
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
    loadSupplier () {
      querySupplier({ accountSetId: this.accountSet._id }).then(res => {
        this.supplierList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '供应商',
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
    load (supplierId) {
      this.loading = true
      let search = JSON.parse(JSON.stringify(this.search))
      let filter = {
        accountSetId: this.accountSet._id,
        supplierId: supplierId,
        audit: '已审核'
      }
      if (search.searchVal) {
        let formula = this.searchList.find(f => f.title === this.whichSearchType).formula
        this.$set(filter, '$or', [])
        formula.forEach(f => {
          let obj = {}
          if (f === 'supplier') {
            let list = this.supplierList.filter(f => f.name.includes(search.searchVal)).map(v => v._id)
            if (list.length) {
              this.$set(obj, 'supplierId', { $in: list })
              filter['$or'].push(obj)
            }
          } else if (f.includes('.')) {
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
      queryPurchaseWarehouse(search).then(res => {
        let list = []
        res.data.list.forEach(f => {
          f.list.forEach(fl => {
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              supplierId: f.supplierId,
              departmentId: f.departmentId,
              clerkId: f.clerkId,
              audit: f.audit,
              paymentStatus: f.paymentStatus,
              paid: f.paid,
              commodityCode: fl.code,
              commodityName: fl.name,
              commodityWarehouse: fl.warehouseId,
              commodityUnit: fl.unit,
              commodityNumber: fl.number,
              commodityPrice: fl.price,
              commodityUnitPrice: fl.unitPrice,
              commodityTaxRate: fl.taxRate,
              commodityPayable: fl.payable,
              commodityPayableTotal: fl.payableTotal,
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
        this.purchaseWarehouse = res.data.list
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
        column.slot === 'supplierId' ||
        column.slot === 'departmentId' ||
        column.slot === 'clerkId' ||
        column.slot === 'audit' ||
        column.slot === 'paymentStatus' ||
        column.slot === 'paid'
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
