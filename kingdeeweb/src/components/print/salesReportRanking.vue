<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      销售排行表
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
          title: '商品编号',
          resizable: true,
          key: 'code'
        },
        {
          title: '商品名称',
          width: 150,
          key: 'name',
          resizable: true
        },
        {
          title: '基本单位',
          width: 150,
          key: 'unit',
          resizable: true
        },
        {
          title: '销售数量',
          width: 150,
          key: 'number',
          resizable: true
        },
        {
          title: '折扣（折）',
          width: 150,
          key: 'discount',
          resizable: true
        },
        {
          title: '价税合计',
          width: 150,
          key: 'payableTotal',
          resizable: true
        },
        {
          title: '销售占比（%）',
          width: 150,
          key: 'salesAccounted',
          resizable: true
        },
        {
          title: '累计占比（%）',
          width: 150,
          key: 'accounted',
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
