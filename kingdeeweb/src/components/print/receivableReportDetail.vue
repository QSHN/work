<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      应收明细表
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
      <template slot-scope="{ row }" slot="customerId">
        {{ customerList.find(f => f._id === row.customerId) && customerList.find(f => f._id === row.customerId).name }}
      </template>
      <template slot-scope="{ row }" slot="departmentId">
        {{ departmentList.find(f => f._id === row.departmentId) && departmentList.find(f => f._id === row.departmentId).name }}
      </template>
      <template slot-scope="{ row }" slot="clerkId">
        {{ clerkList.find(f => f._id === row.clerkId) && clerkList.find(f => f._id === row.clerkId).name }}
      </template>
      <template slot-scope="{ row }" slot="customerCode">
        {{ customerList.find(f => f._id === row.customerId) && customerList.find(f => f._id === row.customerId).code }}
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
    customerList: Array,
    departmentList: Array,
    clerkList: Array
  },
  data () {
    return {
      columns: [
        {
          title: '客户编号',
          slot: 'customerCode',
          resizable: true
        },
        {
          title: '客户名称',
          slot: 'customerId',
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
          title: '预收',
          align: 'right',
          children: [
            {
              title: '预收金额',
              slot: 'payable',
              width: 56,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '应收',
          align: 'center',
          children: [
            {
              title: '销售应收金额',
              slot: 'orderPayable',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '其他应收金额',
              slot: 'otherPayable',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '应收合计金额',
              slot: 'totalPayable',
              width: 56,
              resizable: true,
              align: 'right'
            }
          ]
        },
        {
          title: '收款',
          align: 'center',
          children: [
            {
              title: '收销售款金额',
              slot: 'orderAmount',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '收其他应收款金额',
              slot: 'otherAmount',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '收款合计金额',
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
              title: '预收余额',
              slot: 'payableBalance',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '销售应收余额',
              slot: 'orderBalance',
              width: 56,
              resizable: true,
              align: 'right'
            },
            {
              title: '其他应收余额',
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
