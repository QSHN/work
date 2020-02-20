<template>
  <div style="padding: 30px 20px;">
    <div style="font-size: 20px; text-align: center;">
      所有者权益变动表
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 18px;">
      <p style="width: 33.3333%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
      <p style="width: 33.3333%; text-align: center; margin-bottom: 0;">{{getPeriod}}</p>
      <p style="width: 33.3333%; margin-bottom: 0;"></p>
    </div>

    <Table :columns="columns" :data="printList" :span-method="handleSpan" class="print_table" border>
      <template slot-scope="{ row, column }" slot="content">
        <div v-if="row._index === 0 || row._index === 1 || printList[0][column.title].type === 'title'"
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
    moment,
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        }
        if (rowIndex === 1) {
          return [0, 0]
        }
      }
      if (rowIndex === 0 && columnIndex > 0) {
        if (columnIndex === 1 || columnIndex === 7) {
          return {
            rowspan: 1,
            colspan: 6
          }
        } else {
          return [0, 0]
        }
      }
    }
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
            width: this.printList[0][key].type === 'formula' ? null : 200
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
