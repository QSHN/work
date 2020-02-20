<template>
  <div style="padding: 30px 50px;">
    <div style="font-size: 20px; text-align: center;">
      资产负债表
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 18px;">
      <p style="width: 33.3333%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
      <p style="width: 33.3333%; text-align: center; margin-bottom: 0;">{{getPeriod}}</p>
      <p style="width: 33.3333%; margin-bottom: 0;"></p>
    </div>

    <Table :columns="columns" :data="printList" class="print_table" border>
      <template slot-scope="{ row, column }" slot="content">
        <div v-if="printList[0][column.title].type === 'title'"
             :style="{ textAlign: row[column.title].align, padding: `2px 0 2px ${row[column.title].padding}px` }">
          {{ row[column.title].val || '' }}
        </div>

        <div v-else :style="{ textAlign: row[column.title].align, padding: `2px 0 2px 0`}">
          {{ row[column.title].money !== undefined ? formatMoney(row[column.title].money, '', 2) : '' }}
        </div>
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
    period: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      columns: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getPeriod () {
      if (this.accountSet) {
        let time = (this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod) + '期'
        let period = this.period.accountingPeriod ? this.moment(this.period.accountingPeriod).format('YYYY-M') + '期' : ''
        if (this.period.accountingPeriodEnd) {
          period += '-' + this.moment(this.period.accountingPeriodEnd).format('YYYY-M') + '期'
        }
        return period || time
      } else {
        return ''
      }
    }
  },
  methods: {
    formatMoney,
    moment
  },
  watch: {
    printList: {
      handler () {
        let columns = []
        for (let key in this.printList[0]) {
          columns.push({
            title: key,
            align: 'center',
            slot: 'content',
            resizable: true,
            width: key === 'A' || key === 'D' ? null : 150
          })
        }
        this.columns = columns
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
