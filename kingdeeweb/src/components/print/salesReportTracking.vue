<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      销售订单跟踪表
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 18px;">
      <p style="width: 33.3333%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
    </div>

    <Table :columns="columns" :data="printList" class="print_table" border>
      <template slot-scope="{ row }" slot="code">
        {{ row.code }}
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatMoney } from 'accounting'
import moment from 'moment'
export default {
  name: 'profitIndex',
  props: {
    printList: {
      type: Array,
      required: true
    },
    supplierList: Array,
    departmentList: Array,
    warehouseList: Array,
    clerkList: Array
  },
  data () {
    return {
      columns: [
        {
          title: '单据编号',
          width: 62,
          slot: 'code',
          resizable: true,
          key: 'code'
        },
        {
          title: '单据日期',
          width: 62,
          slot: 'dateTime',
          resizable: true
        },
        {
          title: '单据状态',
          width: 62,
          key: 'audit',
          resizable: true
        },
        {
          title: '客户',
          width: 62,
          slot: 'customerId',
          resizable: true
        },
        {
          title: '部门',
          width: 62,
          slot: 'departmentId',
          resizable: true
        },
        {
          title: '业务员',
          width: 62,
          slot: 'clerkId',
          resizable: true
        },
        {
          title: '商品编码',
          width: 62,
          key: 'commodityCode',
          resizable: true
        },
        {
          title: '商品名称',
          width: 62,
          key: 'commodityName',
          resizable: true
        },
        {
          title: '仓库',
          width: 62,
          slot: 'commodityWarehouse',
          resizable: true
        },
        {
          title: '单位',
          width: 62,
          key: 'commodityUnit',
          resizable: true
        },
        {
          title: '数量',
          width: 62,
          key: 'commodityNumber',
          resizable: true
        },
        {
          title: '单价',
          width: 62,
          key: 'commodityPrice',
          resizable: true
        },
        {
          title: '含税单价',
          width: 62,
          key: 'commodityUnitPrice',
          resizable: true
        },
        {
          title: '增值税率%',
          width: 62,
          key: 'commodityTaxRate',
          resizable: true
        },
        {
          title: '税额',
          width: 62,
          key: 'commodityPayable',
          resizable: true
        },
        {
          title: '价税合计',
          width: 62,
          key: 'commodityPayableTotal',
          resizable: true
        },
        {
          title: '已出库数量',
          width: 62,
          key: 'commodityInStorage',
          resizable: true
        },
        {
          title: '未出库数量',
          width: 62,
          key: 'commodityUnStorage',
          resizable: true
        },
        {
          title: '商品行备注',
          key: 'commodityDes',
          resizable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ])
  },
  methods: {
    formatMoney,
    moment
  }
}
</script>
