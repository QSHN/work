<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      销售汇总表
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 18px;">
      <p style="width: 33.3333%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
    </div>

    <Table :columns="columns" :data="printList" class="print_table" border>
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
    }
  },
  data () {
    return {
      columns: [
        {
          title: '客户编号',
          resizable: true,
          key: 'code'
        },
        {
          title: '客户名称',
          width: 150,
          key: 'name',
          resizable: true
        },
        {
          title: '整单折扣分配额',
          width: 150,
          key: 'discount',
          resizable: true
        },
        {
          title: '实际不含税金额',
          width: 150,
          key: 'price',
          resizable: true
        },
        {
          title: '税额',
          width: 150,
          key: 'payable',
          resizable: true
        },
        {
          title: '销售费用',
          width: 150,
          key: 'salesExpense',
          resizable: true
        },
        {
          title: '价税合计',
          width: 150,
          key: 'payableTotal',
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
