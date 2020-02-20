<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      采购销售汇总表
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
          title: '商品编码',
          resizable: true,
          key: 'code'
        },
        {
          title: '商品名称',
          width: 68,
          key: 'name',
          resizable: true
        },
        {
          title: '商品类别',
          width: 68,
          key: 'groupId',
          resizable: true
        },
        {
          title: '单位',
          width: 68,
          key: 'unit',
          resizable: true
        },
        {
          title: '采购',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '采购数量',
              width: 68,
              key: 'purchaseNumber',
              resizable: true
            },
            {
              title: '采购金额',
              width: 68,
              key: 'purchaseMoney',
              resizable: true
            },
            {
              title: '退货数量',
              width: 68,
              key: 'purchaseReNumber',
              resizable: true
            },
            {
              title: '退货金额',
              width: 68,
              key: 'purchaseReMoney',
              resizable: true
            },
            {
              title: '采购费用',
              width: 68,
              key: 'purchaseExpense',
              resizable: true
            },
            {
              title: '进货均价',
              width: 68,
              key: 'purchasePrice',
              resizable: true
            }
          ]
        },
        {
          title: '销售',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '销售数量',
              width: 68,
              key: 'salesNumber',
              resizable: true
            },
            {
              title: '销售金额',
              width: 68,
              key: 'salesMoney',
              resizable: true
            },
            {
              title: '退货数量',
              width: 68,
              key: 'salesReNumber',
              resizable: true
            },
            {
              title: '退货金额',
              width: 68,
              key: 'salesReMoney',
              resizable: true
            },
            {
              title: '销售费用',
              width: 68,
              key: 'salesExpense',
              resizable: true
            },
            {
              title: '销售均价',
              width: 68,
              key: 'salesPrice',
              resizable: true
            },
            {
              title: '进销差价',
              width: 68,
              key: 'diffPrice',
              resizable: true
            }
          ]
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
