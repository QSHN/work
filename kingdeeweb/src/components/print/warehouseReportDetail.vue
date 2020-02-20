<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      商品收发明细表
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
          width: 62,
          key: 'name',
          resizable: true
        },
        {
          title: '单据类型',
          width: 62,
          key: 'orderType',
          resizable: true
        },
        {
          title: '单据编号',
          width: 62,
          key: 'orderCode',
          resizable: true
        },
        {
          title: '单据日期',
          width: 62,
          key: 'dateTime',
          resizable: true
        },
        {
          title: '审批状态',
          width: 62,
          key: 'audit',
          resizable: true
        },
        {
          title: '仓库',
          width: 62,
          key: 'warehouse',
          resizable: true
        },
        {
          title: '入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '基本单位',
              width: 62,
              key: 'iUnitD',
              resizable: true
            },
            {
              title: '基本单位数量',
              width: 62,
              key: 'iNumberD',
              resizable: true
            },
            {
              title: '单位',
              width: 62,
              key: 'iUnit',
              resizable: true
            },
            {
              title: '数量',
              width: 62,
              key: 'iNumber',
              resizable: true
            },
            {
              title: '单位成本',
              width: 62,
              key: 'iPrice',
              resizable: true
            },
            {
              title: '成本',
              width: 62,
              key: 'iTotal',
              resizable: true
            }
          ]
        },
        {
          title: '出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '基本单位',
              width: 62,
              key: 'oUnitD',
              resizable: true
            },
            {
              title: '基本单位数量',
              width: 62,
              key: 'oNumberD',
              resizable: true
            },
            {
              title: '单位',
              width: 62,
              key: 'oUnit',
              resizable: true
            },
            {
              title: '数量',
              width: 62,
              key: 'oNumber',
              resizable: true
            },
            {
              title: '单位成本',
              width: 62,
              key: 'oPrice',
              resizable: true
            },
            {
              title: '成本',
              width: 62,
              key: 'oTotal',
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
