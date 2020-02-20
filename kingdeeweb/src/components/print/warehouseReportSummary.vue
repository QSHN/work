<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      商品收发汇总表
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
          width: 45,
          key: 'name',
          resizable: true
        },
        {
          title: '基本单位',
          width: 45,
          key: 'unit',
          resizable: true
        },
        {
          title: '采购入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'pwNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'pwTotal',
              resizable: true
            }
          ]
        },
        {
          title: '销售退货',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'srNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'srTotal',
              resizable: true
            }
          ]
        },
        {
          title: '盘盈',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'ddNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'ddTotal',
              resizable: true
            }
          ]
        },
        {
          title: '调拨入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'aiNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'aiTotal',
              resizable: true
            }
          ]
        },
        {
          title: '其他入库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'iiNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'iiTotal',
              resizable: true
            }
          ]
        },
        {
          title: '入库合计',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'iNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'iTotal',
              resizable: true
            }
          ]
        },
        {
          title: '采购退货',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'prNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'prTotal',
              resizable: true
            }
          ]
        },
        {
          title: '销售出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'swNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'swTotal',
              resizable: true
            }
          ]
        },
        {
          title: '盘亏',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'dsNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'dsTotal',
              resizable: true
            }
          ]
        },
        {
          title: '调拨出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'aoNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'aoTotal',
              resizable: true
            }
          ]
        },
        {
          title: '其他出库',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'ooNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
              key: 'ooTotal',
              resizable: true
            }
          ]
        },
        {
          title: '出库合计',
          align: 'center',
          resizable: true,
          children: [
            {
              title: '数量',
              width: 45,
              key: 'oNumber',
              resizable: true
            },
            {
              title: '成本',
              width: 45,
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
