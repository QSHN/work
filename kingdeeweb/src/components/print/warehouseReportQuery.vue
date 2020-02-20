<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      库存查询表
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
          resizable: true,
          key: 'name'
        },
        {
          title: '商品类别',
          width: 150,
          resizable: true,
          key: 'groupId'
        },
        {
          title: '辅助属性',
          width: 150,
          resizable: true,
          key: 'auxiliary'
        },
        {
          title: '仓库名称',
          width: 150,
          resizable: true,
          key: 'warehouse'
        },
        {
          title: '基本单位',
          width: 150,
          resizable: true,
          key: 'unit'
        },
        {
          title: '即时库存',
          width: 150,
          resizable: true,
          key: 'inventory'
        },
        {
          title: '可用库存',
          width: 150,
          resizable: true,
          key: 'can'
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
