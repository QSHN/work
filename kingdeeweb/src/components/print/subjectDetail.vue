<template>
  <div>
    <div style="width: 100%;
        font-size: 18px;
        text-align: center;">
      {{period.subject}} 明细账
    </div>

    <div class="c_info" style="width: 100%;
        margin: 10px 0 5px 0;
        display: flex;
        font-size: 14px;">
      <p style="width: 40%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
      <p style="width: 20%; text-align: center; margin-bottom: 0;">{{getPeriod}}</p>
      <p style="width: 40%; text-align: right; margin-bottom: 0;">科目：【{{period.subjectCode}}】{{period.subject}}】</p>
    </div>

    <table style="width: 100%; line-height: 32px; font-size: 14px; border-collapse:collapse" cellpadding="0" cellspacing="0" v-if="printData.balance">
      <thead>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 12%;">日期</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 10%;">凭证字号</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 25%;">摘要</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 15%;">借方</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 15%;">贷方</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 8%;">方向</td>
        <td style="border: 1px solid #dcdee2; text-align: center; width: 15%;">余额</td>
      </thead>
      <tbody>
        <tr>
          <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: '10px',
                width: '12%'
            }">
            {{printData.balance ? moment(new Date(printData.balance.time)).format('YYYY-MM-DD') : ''}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 10%; padding-right: 10px;">
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 25%; padding-right: 10px;">
            {{printData.balance.time.split('-')[1] === '1' ? '年初' : '期初'}}余额
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
            {{printData.balance && formatMoney(printData.balance.borrower || 0, '', 2)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
            {{printData.balance && formatMoney(printData.balance.lender || 0, '', 2)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: center; width: 8%; padding-right: 10px;">
            {{getDirection(printData.balance.beginningBalance || 0, printData.balance.balance)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 15%; padding-right: 10px;">
            {{printData.balance && formatMoney(printData.balance.beginningBalance || 0, '', 2)}}
          </td>
        </tr>

        <div v-for="(v, i) in printData.list" :key="i">
          <div v-for="(v1, i1) in v.day" :key="i1">
            <tr v-for="(v2, i2) in v1.child" :key="i2">
              <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: '10px',
                width: '12%'
              }">
                {{moment(v2.time).format('YYYY-MM-DD')}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 10%; padding-right: 10px;">
                {{v2.proofWords + ' - ' + v2.certificateNumber}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 25%; padding-right: 10px;">
                {{v2.abstract}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
                {{formatMoney(v2.borrower || 0, '', 2)}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
                {{formatMoney(v2.lender || 0, '', 2)}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: center; width: 8%; padding-right: 10px;">
                {{getDirection(v2.balance || 0, printData.balance.balance)}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 15%; padding-right: 10px;">
                {{formatMoney(v2.balance || 0, '', 2)}}
              </td>
            </tr>

            <tr>
              <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: '10px',
                width: '12%'
              }">
                {{v1.time}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 10%; padding-right: 10px;">
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 25%; padding-right: 10px;">
                本日合计
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
                {{formatMoney(v1.borrower || 0, '', 2)}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
                {{formatMoney(v1.lender || 0, '', 2)}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: center; width: 8%; padding-right: 10px;">
                {{getDirection(v1.balance || 0, printData.balance.balance)}}
              </td>
              <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 15%; padding-right: 10px;">
                {{formatMoney(v1.balance || 0, '', 2)}}
              </td>
            </tr>
          </div>

          <tr>
            <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: '10px',
                width: '12%'
              }">
              {{v.accountingPeriod}}
            </td>
            <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 10%; padding-right: 10px;">
            </td>
            <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 25%; padding-right: 10px;">
              本期合计
            </td>
            <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
              {{formatMoney(v.borrower || 0, '', 2)}}
            </td>
            <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
              {{formatMoney(v.lender || 0, '', 2)}}
            </td>
            <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: center; width: 8%; padding-right: 10px;">
              {{getDirection(v.balance || 0, printData.balance.balance)}}
            </td>
            <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 15%; padding-right: 10px;">
              {{formatMoney(v.balance || 0, '', 2)}}
            </td>
          </tr>
        </div>

        <tr>
          <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: '10px',
                width: '12%'
              }">
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 10%; padding-right: 10px;">
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: left; width: 25%; padding-right: 10px;">
            本年累计
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
            {{formatMoney(total('borrower'), '', 2)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: right; width: 15%; padding-right: 10px;">
            {{formatMoney(total('lender'), '', 2)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; border-right: none; text-align: center; width: 8%; padding-right: 10px;">
            {{getDirection(total('all'), printData.balance.balance)}}
          </td>
          <td style="border: 1px solid #dcdee2; border-top: none; text-align: right; width: 15%; padding-right: 10px;">
            {{formatMoney(total('all'), '', 2)}}
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
import NP from 'number-precision'
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
        return direction ? direction.charAt(0) : ''
      }
    },
    total (type) {
      let direction = this.printData.balance.balance === '借方'
      let money = type === 'all' ? this.printData.balance.beginningBalance : 0
      this.printData.list.forEach(v => {
        v.day.forEach(d => {
          money = d.child.reduce((total, v) => {
            if (type === 'all') {
              if (v.borrower) {
                total = NP[direction ? 'plus' : 'minus'](total, v.borrower)
              } else if (v.lender) {
                total = NP[direction ? 'minus' : 'plus'](total, v.lender)
              }
            } else if (type === 'borrower') {
              total = NP.plus(total, v.borrower || 0)
            } else {
              total = NP.plus(total, v.lender || 0)
            }
            return total
          }, money)
        })
      })
      return money
    }
  }
}
</script>
