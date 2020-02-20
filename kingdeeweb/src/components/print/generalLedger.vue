<template>
  <div style="">
    <div style="width: 100%;
        font-size: 18px;
        text-align: center;">
      {{printData.name}} 总账
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 14px;">
      <p style="width: 40%; margin-bottom: 0; ">公司名称：{{accountSet && accountSet.organization}}</p>
      <p style="width: 20%; text-align: center; margin-bottom: 0;">{{getPeriod}}</p>
      <p style="width: 40%; text-align: right; margin-bottom: 0;">科目：【{{printData.code}} - {{printData.name}}】</p>
    </div>

    <table style="width: 100%; line-height: 32px; font-size: 14px; border-collapse:collapse" cellpadding="0" cellspacing="0">
      <thead>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 10%;">期间</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 20%;">摘要</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 20%;">借方</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 20%;">贷方</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 10%;">方向</td>
        <td style="border: 1px solid #dcdee2; text-align: center; width: 20%;">余额</td>
      </thead>
      <tbody>
        <tr v-for="(v, i) in printData.child" :key="i">
          <td :style="{
              border: '1px solid #dcdee2',
              borderRight: 'none',
              borderTop: 'none',
              paddingLeft: '10px',
              width: '10%'
          }">
            {{period ? moment(period.accountingPeriod).format('YYYY-MM').split('-')[0] + '-' + v.period : ''}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 20%; padding-right: 10px;">
            {{v.abstract}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 20%; padding-right: 10px;">
            {{v.borrower !== 0 ? formatMoney(v.borrower, '', 2) : ''}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 20%; padding-right: 10px;">
            {{v.lender !== 0 ? formatMoney(v.lender, '', 2) : ''}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: center; width: 10%; padding-right: 10px;">
            {{getDirection(v.balance, v.direction)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 20%; padding-right: 10px;">
            {{v.balance !== 0 ? formatMoney(v.balance, '', 2) : ''}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatMoney } from 'accounting'
import moment from 'moment'
export default {
  name: 'profitIndex',
  props: {
    printData: {
      type: Object,
      required: true
    },
    period: {
      type: Object,
      required: true
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
    getDirection (money, direction) {
      if (money === 0) {
        return '平'
      } else {
        return direction.charAt(0)
      }
    }
  }
}
</script>
