<template>
  <div>
    <Row type="flex" justify="space-between">
      <Button style="width: 80px;" @click="isExpend = !isExpend">{{ isExpend ? '收起' : '展开' }}筛选</Button>
      <Row>
        <Button type="primary" style="width: 80px; margin-left: 10px;" @click="load">查询</Button>
        <Button style="width: 80px; margin-left: 10px;">导出</Button>
        <Button type="default" style="width: 80px; margin-left: 10px;">列设置</Button>
        <Button @click="$refs.printModal.show()" style="width: 80px; margin-left: 10px;">打印</Button>
      </Row>
    </Row>

    <Card style="margin-top: 10px;" v-if="isExpend">
      <Form label-position="top">
        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="日期" style="margin: 0 30px 0 0;">
            <DatePicker type="daterange" split-panels v-model="search.time" style="width: 200px" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem label="单据类型" style="margin: 0 30px 0 0;">
            <Select v-model="search.type" style="width:200px">
              <Option v-for="(item, i) in ['全部', '销售出库', '销售退货']" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="审核状态" style="margin: 0 30px 0 0;">
            <Select v-model="search.audit" style="width:200px">
              <Option v-for="(item, i) in ['全部', '已审核', '未审核']" :value="item" :key="i">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="客户" style="margin: 0 30px 0 0;">
            <Select v-model="search.customerId" style="width:200px">
              <Option v-for="item in customerList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="单据编号" style="margin: 0 30px 0 0;">
            <Input v-model="search.code" style="width: 200px" />
          </FormItem>
          <FormItem label="商品" style="margin: 0 30px 0 0;">
            <div @click="addCommodity(true)">
              <Input :value="search.commodity.map(v => v.name).join('、')" readonly style="width: 200px" />
            </div>
          </FormItem>
        </Row>

        <Row type="flex" style="margin-bottom: 10px;">
          <FormItem label="部门" style="margin: 0 30px 0 0;">
            <Select v-model="search.departmentId" style="width:200px">
              <Option v-for="item in departmentList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="业务员" style="margin: 0 30px 0 0;">
            <Select v-model="search.clerkId" style="width:200px">
              <Option v-for="item in clerkList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="仓库" style="margin: 0 30px 0 0;">
            <Select v-model="search.warehouseId" style="width:200px">
              <Option v-for="item in warehouseList" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品类别" style="margin: 0 30px 0 0;">
            <Select v-model="search.groupId" style="width:200px">
              <Option v-for="item in commodityGroup" :value="item._id" :key="item._id">{{ item.code }} - {{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="商品行备注" style="margin: 0 30px 0 0;">
            <Input v-model="search.des" style="width: 200px" />
          </FormItem>
        </Row>

        <Row type="flex" style="margin-top: 20px;">
          <Button style="width: 80px; margin-right: 10px;" @click="resetSearch">重置</Button>
        </Row>
      </Form>
    </Card>

    <Table
      :width="getTableWidth"
      :height="getTableHeight"
      border
      :columns="columns"
      :data="tableData"
      :loading="loading"
      show-summary
      :summary-method="handleSummary"
      :span-method="handleSpan"
      style="margin-top: 10px;">
      <template slot-scope="{ row }" slot="code">
        <router-link :to="{
          name: row.orderType === '销售出库单' ? 'salesWarehouse' : 'salesReturn',
          query: { id: row._id }
        }">{{ row.code }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime ? moment(row.dateTime).format('YYYY-MM-DD') : ''}}
      </template>
      <template slot-scope="{ row }" slot="customerId">
        {{ customerList.find(f => f._id === row.customerId) && customerList.find(f => f._id === row.customerId).name }}
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
      <template slot-scope="{ row }" slot="commodityWarehouse">
        {{ warehouseList.find(f => f._id === row.commodityWarehouse) && warehouseList.find(f => f._id === row.commodityWarehouse).name }}
      </template>
    </Table>

    <printModal
      ref="printModal"
      :printList="tableData"
      :printType="'salesReportDetail'"
      :customerList="customerList"
      :departmentList="departmentList"
      :warehouseList="warehouseList"
      :clerkList="clerkList"
    />
    <commodityModal ref="commodityModal" @addCommodity="addCommodity" :isOne="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCustomer } from '../../api/customer'
import { queryClerk } from '../../api/clerk'
import { queryDepartment } from '../../api/department'
import { detailSalesReport } from '../../api/salesReport'
import { queryWarehouse } from '../../api/warehouse'
import { queryCommodityInfoGroup } from '../../api/commodityInfo'
import { formatMoney } from 'accounting'
import moment from 'moment'
import printModal from '../../components/print/index'
import commodityModal from '../../components/commodity/index'
export default {
  name: 'salesReportDetail',
  components: {
    printModal,
    commodityModal
  },
  data () {
    return {
      isExpend: true,
      loading: false,
      search: {
        accountSetId: null,
        time: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        customerId: null,
        clerkId: null,
        departmentId: null,
        commodity: [],
        audit: '全部',
        code: null,
        type: '全部',
        warehouseId: null,
        des: null,
        groupId: null
      },
      columns: [
        {
          title: '单据编号',
          width: 200,
          slot: 'code',
          resizable: true,
          key: 'code'
        },
        {
          title: '单据日期',
          width: 150,
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '单据类型',
          width: 200,
          key: 'orderType',
          resizable: true
        },
        {
          title: '客户',
          width: 150,
          slot: 'customerId',
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
      customerList: [],
      departmentList: [],
      clerkList: [],
      tableData: [],
      warehouseList: [],
      commodityGroup: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet',
      'myUser',
      'myPermission'
    ]),
    getTableWidth () {
      return window.innerWidth - 100
    },
    getTableHeight () {
      return window.innerHeight - (this.isExpend ? 435 : 220)
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.loadCustomer()
          this.loadClerk()
          this.loadDepartment()
          this.loadWarehouse()
          this.loadCommodityGroup()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    formatMoney,
    resetSearch () {
      this.search = {
        accountSetId: null,
        time: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        customerId: null,
        clerkId: null,
        departmentId: null,
        name: null,
        audit: '全部',
        code: null,
        type: '全部',
        warehouseId: null,
        des: null,
        groupId: null
      }
    },
    load () {
      let search = this.search
      let obj = {
        accountSetId: this.accountSet._id,
        dateTime: {
          $gte: moment(search.time[0]).format('YYYY-MM-DD') + ' 00:00:00.000',
          $lte: moment(search.time[1]).format('YYYY-MM-DD') + ' 23:59:59.999'
        },
        type: search.type
      }
      if (search.customerId) obj.customerId = search.customerId
      if (search.clerkId) obj.clerkId = search.clerkId
      if (search.departmentId) obj.departmentId = search.departmentId
      if (search.audit !== '全部') obj.audit = search.audit
      if (search.code) obj.code = { $regex: search.code }

      let listObj = {}
      if (search.commodity && search.commodity.length) listObj.commodityId = { $in: search.commodity.map(v => v._id) }
      if (search.warehouseId) listObj.warehouseId = search.warehouseId
      if (search.groupId) listObj.groupId = search.groupId
      if (search.des) listObj.des = { $regex: search.des }
      if (Object.keys(listObj).length) obj.list = { $elemMatch: listObj }
      this.loading = true
      detailSalesReport(obj).then(res => {
        this.loading = false
        let list = []
        res.data.forEach(f => {
          f.list.forEach(fl => {
            list.push({
              _id: f._id,
              code: f.code,
              dateTime: f.dateTime,
              audit: f.audit,
              customerId: f.customerId,
              departmentId: f.departmentId,
              clerkId: f.clerkId,
              orderType: f.orderType,
              commodityCode: fl.code,
              commodityName: fl.name,
              commodityWarehouse: fl.warehouseId,
              commodityUnit: fl.unit,
              commodityNumber: f.orderType === '销售退货单' ? fl.reStorage : fl.inStorage,
              commodityPrice: fl.price,
              commodityUnitPrice: fl.unitPrice,
              commodityTaxRate: fl.taxRate,
              commodityPayable: fl.payable,
              commodityPayableTotal: fl.payableTotal,
              commodityDes: fl.commodityDes
            })
          })
        })
        this.tableData = list
        this.loading = false
      }).catch(err => {
        this.$Notice.error({
          title: '销售明细表',
          desc: err.message
        })
      })
    },
    loadCustomer () {
      queryCustomer({ accountSetId: this.accountSet._id }).then(res => {
        this.customerList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '客户',
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
        this.$Notice.error({
          title: '仓库',
          desc: err.message
        })
      })
    },
    loadCommodityGroup () {
      queryCommodityInfoGroup({ accountSetId: this.accountSet._id }).then(res => {
        this.commodityGroup = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '商品类别',
          desc: err.message
        })
      })
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (
        column.slot === 'code' ||
          column.slot === 'dateTime' ||
          column.key === 'orderType' ||
          column.slot === 'customerId' ||
          column.slot === 'departmentId' ||
          column.slot === 'clerkId' ||
          column.slot === 'audit'
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
    handleSummary ({ columns, data }) {
      const sums = {}
      columns.forEach((column, index) => {
        const key = column.key
        if (index === 0) {
          sums[key] = {
            key,
            value: '合计'
          }
          return
        }
        const values = data.map(item => item[key])
        if ((key === 'commodityNumber' || key === 'commodityPayable' || key === 'commodityPayableTotal') && !values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[key] = {
            key,
            value: this.formatMoney(v, '', 2)
          }
        } else {
          sums[key] = {
            key,
            value: ' '
          }
        }
      })
      return sums
    },
    addCommodity (bool, list = []) {
      if (bool && list.length) {
        this.search.commodity = this.search.commodity.concat(list.map(v => {
          return {
            _id: v._id,
            name: v.name
          }
        }))
      } else {
        this.$refs.commodityModal.show(bool)
      }
    }
  }
}
</script>

<style scoped>

</style>
