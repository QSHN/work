<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      应付明细表
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 18px;">
      <p style="width: 33.3333%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
    </div>

    <Table :columns="columns" :data="printList" class="print_table" border>
      <template slot-scope="{ row }" slot="dateTime">
        {{ row.dateTime && (row.orderType !== '小计' && row.orderType !== '期初余额' && row.orderType !== '合计') ? moment(row.dateTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template slot-scope="{ row }" slot="payable">
        {{ row.payable ? formatMoney(row.payable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="orderPayable">
        {{ row.orderPayable ? formatMoney(row.orderPayable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="otherPayable">
        {{ row.otherPayable ? formatMoney(row.otherPayable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="totalPayable">
        {{ row.totalPayable ? formatMoney(row.totalPayable, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="orderAmount">
        {{ row.orderAmount ? formatMoney(row.orderAmount, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="otherAmount">
        {{ row.otherAmount ? formatMoney(row.otherAmount, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="totalAmount">
        {{ row.totalAmount ? formatMoney(row.totalAmount, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="payableBalance">
        {{ row.payableBalance ? formatMoney(row.payableBalance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="orderBalance">
        {{ row.orderBalance ? formatMoney(row.orderBalance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="otherBalance">
        {{ row.otherBalance ? formatMoney(row.otherBalance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="balance">
        {{ row.balance ? formatMoney(row.balance, '', 2) : '' }}
      </template>
      <template slot-scope="{ row }" slot="balance">
        {{ row.balance ? formatMoney(row.balance, '', 2) : '' }}
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
      <template slot-scope="{ row }" slot="supplierCode">
        {{ supplierList.find(f => f._id === row.supplierId) && supplierList.find(f => f._id === row.supplierId).code }}
      </template>
      <template slot-scope="{ row }" slot="departmentCode">
        {{ departmentList.find(f => f._id === row.departmentId) && departmentList.find(f => f._id === row.departmentId).code }}
      </template>
      <template slot-scope="{ row }" slot="clerkCode">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).code }}
      </template>
      <template slot-scope="{ row }" slot="des">
        {{ (row.orderType !== '小计' && row.orderType !== '期初余额' && row.orderType !== '合计') ? row.des : ''}}
      </template>
      <template slot-scope="{ row }" slot="code">
        {{ row.code }}
      </template>
      <template slot-scope="{ row }" slot="orderType">
        {{ row.orderType }}
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
    clerkList: Array
  },
  data () {
    return {
      columns: [
        {
          title: '供应商编号',
          slot: 'supplierCode',
          resizable: true
        },
        {
          title: '供应商名称',
          slot: 'supplierId',
          width: 56,
          resizable: true
        },
        {
          title: '日期',
          slot: 'dateTime',
          width: 56,
          resizable: true
        },
        {
          title: '单据类型',
          slot: 'orderType',
          width: 56,
          resizable: true
        },
        {
          title: '单据编号',
          slot: 'code',
          width: 56,
          resizable: true
        },
        {
          title: '备注',
          slot: 'des',
          width: 56,
          resizable: true
        },
        {
          title: '预付',
          align: 'right',
          children: [
            {
              title: '预付金额',
              slot: 'payable',
              width: 56,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '应付',
          align: 'center',
          children: [
            {
              title: '销售应付金额',
              slot: 'orderPayable',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '其他应付金额',
              slot: 'otherPayable',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '应付合计金额',
              slot: 'totalPayable',
              width: 56,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '付款',
          align: 'center',
          children: [
            {
              title: '付销售款金额',
              slot: 'orderAmount',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '付其他应付款金额',
              slot: 'otherAmount',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '付款合计金额',
              slot: 'totalAmount',
              width: 56,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '余额',
          align: 'center',
          children: [
            {
              title: '预付余额',
              slot: 'payableBalance',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '销售应付余额',
              slot: 'orderBalance',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '其他应付余额',
              slot: 'otherBalance',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '余额',
              slot: 'balance',
              width: 56,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '部门编号',
          slot: 'departmentCode',
          width: 56,
          resizable: true
        },
        {
          title: '部门',
          slot: 'departmentId',
          width: 56,
          resizable: true
        },
        {
          title: '业务员编号',
          slot: 'clerkCode',
          width: 56,
          resizable: true
        },
        {
          title: '业务员',
          slot: 'clerkId',
          width: 56,
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
