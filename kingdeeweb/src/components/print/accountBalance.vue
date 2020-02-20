<template>
  <div>
    <div style="width: 100%;
      font-size: 18px;
      text-align: center;">
      科目余额表
    </div>

    <div class="c_info" style="width: 100%;
      margin: 10px 0 5px 0;
      display: flex;
      font-size: 14px;">
      <p style="width: 33.3333%; margin-bottom: 0;">公司名称：{{accountSet && accountSet.organization}}</p>
      <p style="width: 33.3333%; text-align: center;  margin-bottom: 0;">{{getPeriod}}</p>
      <p style="width: 33.3333%; margin-bottom: 0;"></p>
    </div>

    <table style="line-height: 32px; font-size: 14px; border-collapse:collapse" cellpadding="0" cellspacing="0">
      <thead>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 10%;">科目编码</td>
        <td style="border: 1px solid #dcdee2; border-right: none; text-align: center; width: 26%;">科目名称</td>
        <td style="border: 1px solid #dcdee2; text-align: center; border-right: none; width: 16%">
          <div style="border-bottom: 1px solid #dcdee2; width: 100%;">期初余额</div>
          <div style="display: flex; width: 100%;">
            <span style="width: 50%; ">借方</span>
            <span style="width: 50%; border-left: 1px solid #dcdee2;">贷方</span>
          </div>
        </td>
        <td style="border: 1px solid #dcdee2; text-align: center; border-right: none; width: 16%">
          <div style="border-bottom: 1px solid #dcdee2; width: 100%;">本期发生</div>
          <div style="display: flex; width: 100%;">
            <span style="width: 50%; ">借方</span>
            <span style="width: 50%; border-left: 1px solid #dcdee2;">贷方</span>
          </div>
        </td>
        <td style="border: 1px solid #dcdee2; text-align: center; border-right: none; width: 16%">
          <div style="border-bottom: 1px solid #dcdee2; width: 100%;">本年发生</div>
          <div style="display: flex; width: 100%;">
            <span style="width: 50%; ">借方</span>
            <span style="width: 50%; border-left: 1px solid #dcdee2;">贷方</span>
          </div>
        </td>
        <td style="border: 1px solid #dcdee2; text-align: center; width: 16%">
          <div style="border-bottom: 1px solid #dcdee2; width: 100%;">期末余额</div>
          <div style="display: flex; width: 100%;">
            <span style="width: 50%; ">借方</span>
            <span style="width: 50%; border-left: 1px solid #dcdee2;">贷方</span>
          </div>
        </td>
      </thead>

      <tbody>
        <template  v-for="(v, i) in printList">
          <tr :key="i">
            <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                width: '10%'
            }">
              {{v.code}}
            </td>

            <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: v.parentId.length * 10 + 'px',
                width: '26%'
            }">
              {{v.name}}
            </td>

            <td style="border-bottom: 1px solid #dcdee2; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.beginningBalance > 0 ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.beginningBalance ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.beginningBalance ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.beginningBalance > 0 ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                </template>
              </div>
              <div style="display: flex; opacity: 0;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.beginningBalance > 0 ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.beginningBalance ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.beginningBalance ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.beginningBalance > 0 ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</span>
                </template>
              </div>
            </td>

            <td style="border-bottom: 1px solid #dcdee2; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.borrower !== 0 ? formatMoney(v.borrower, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.lender !== 0 ? formatMoney(v.lender, '', 2) : ''}}</span>
              </div>
              <div style="display: flex; opacity: 0;">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.borrower !== 0 ? formatMoney(v.borrower, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.lender !== 0 ? formatMoney(v.lender, '', 2) : ''}}</span>
              </div>
            </td>

            <td style="border-bottom: 1px solid #dcdee2; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.yearBorrow !== 0 ? formatMoney(v.yearBorrow, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.yearCredit !== 0 ? formatMoney(v.yearCredit, '', 2) : ''}}</span>
              </div>
              <div style="display: flex; opacity: 0;">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.yearBorrow !== 0 ? formatMoney(v.yearBorrow, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.yearCredit !== 0 ? formatMoney(v.yearCredit, '', 2) : ''}}</span>
              </div>
            </td>

            <td style="border: 1px solid #dcdee2; border-top: none; border-left: none; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.balance > 0 ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.balance ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.balance ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.balance > 0 ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                </template>
              </div>
              <div style="display: flex; opacity: 0;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.balance > 0 ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.balance ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v.balance ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v.balance > 0 ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</span>
                </template>
              </div>
            </td>
          </tr>

          <tr v-for="(v1, i1) in v.child" :key="'i' + i1">
            <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                width: '10%'
            }">
              {{v1.code}}
            </td>

            <td :style="{
                border: '1px solid #dcdee2',
                borderRight: 'none',
                borderTop: 'none',
                paddingLeft: v.parentId.length * 10 + 'px',
                width: '26%'
            }">
              {{v1.name}}
            </td>

            <td style="border-bottom: 1px solid #dcdee2; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.beginningBalance > 0 ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.beginningBalance ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.beginningBalance ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.beginningBalance > 0 ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                </template>
              </div>
              <div style="display: flex; opacity: 0;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.beginningBalance > 0 ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.beginningBalance ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.beginningBalance ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.beginningBalance > 0 ? formatMoney(Math.abs(v1.beginningBalance), '', 2) : ''}}</span>
                </template>
              </div>
            </td>

            <td style="border-bottom: 1px solid #dcdee2; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.borrower !== 0 ? formatMoney(v1.borrower, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.lender !== 0 ? formatMoney(v1.lender, '', 2) : ''}}</span>
              </div>
              <div style="display: flex; opacity: 0">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.borrower !== 0 ? formatMoney(v1.borrower, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.lender !== 0 ? formatMoney(v1.lender, '', 2) : ''}}</span>
              </div>
            </td>

            <td style="border-bottom: 1px solid #dcdee2; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.yearBorrow !== 0 ? formatMoney(v1.yearBorrow, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.yearCredit !== 0 ? formatMoney(v1.yearCredit, '', 2) : ''}}</span>
              </div>
              <div style="display: flex; opacity: 0">
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.yearBorrow !== 0 ? formatMoney(v1.yearBorrow, '', 2) : ''}}</span>
                <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.yearCredit !== 0 ? formatMoney(v1.yearCredit, '', 2) : ''}}</span>
              </div>
            </td>

            <td style="border: 1px solid #dcdee2; border-top: none; border-left: none; text-align: right; width: 16%; position: relative;">
              <div style="display: flex; position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.balance > 0 ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.balance ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.balance ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.balance > 0 ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                </template>
              </div>
              <div style="display: flex; opacity: 0">
                <template v-if="v.direction === '借方'">
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.balance > 0 ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.balance ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                </template>
                <template v-else>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{0 > v1.balance ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                  <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{v1.balance > 0 ? formatMoney(Math.abs(v1.balance), '', 2) : ''}}</span>
                </template>
              </div>
            </td>
          </tr>
        </template>

        <tr>
          <td :style="{
              border: '1px solid #dcdee2',
              borderRight: 'none',
              borderTop: 'none',
              width: '10%'
          }"></td>

          <td :style="{
              border: '1px solid #dcdee2',
              borderRight: 'none',
              borderTop: 'none',
              textAlign: 'center',
              width: '26%'
          }">
            合计
          </td>

          <td style="border-bottom: 1px solid #dcdee2; text-align: right;  width: 16%; position: relative;">
            <div style="display: flex; position: absolute; left: 0; top: 0; width: 100%; height: 100%;">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('beginningBalance', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('beginningBalance', 'lender')}}</span>
            </div>
            <div style="display: flex; opacity: 0">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('beginningBalance', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('beginningBalance', 'lender')}}</span>
            </div>
          </td>

          <td style="border-bottom: 1px solid #dcdee2; text-align: right;  width: 16%; position: relative;">
            <div style="display: flex; position: absolute; left: 0; top: 0; width: 100%; height: 100%;">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('now', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('now', 'lender')}}</span>
            </div>
            <div style="display: flex; opacity: 0;">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('now', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('now', 'lender')}}</span>
            </div>
          </td>

          <td style="border-bottom: 1px solid #dcdee2; text-align: right;  width: 16%; position: relative;">
            <div style="display: flex; position: absolute; left: 0; top: 0; width: 100%; height: 100%;">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('year', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('year', 'lender')}}</span>
            </div>
            <div style="display: flex; opacity: 0;">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('year', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('year', 'lender')}}</span>
            </div>
          </td>

          <td style="border: 1px solid #dcdee2; border-top: none; border-left: none; text-align: right;  width: 16%; position: relative;">
            <div style="display: flex; position: absolute; left: 0; top: 0; width: 100%; height: 100%;">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('balance', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('balance', 'lender')}}</span>
            </div>
            <div style="display: flex; opacity: 0">
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('balance', 'borrower')}}</span>
              <span style="width: 50%; padding-right: 5px; word-wrap: break-word; word-break: break-all; border-left: 1px solid #dcdee2;">{{total('balance', 'lender')}}</span>
            </div>
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
    printList: {
      type: Array,
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
    total (name, type) {
      let money = 0
      this.printList.forEach(v => {
        if (!v.isParent) {
          if (name === 'beginningBalance') {
            if (type === 'borrower') {
              money = NP.plus(money, v.direction === '借方' && v.beginningBalance > 0 ? v.beginningBalance : 0)
            } else {
              money = NP.plus(money, v.direction === '贷方' && v.beginningBalance > 0 ? v.beginningBalance : 0)
            }
          } else if (name === 'now') {
            if (type === 'borrower') {
              money = NP.plus(money, v.borrower || 0)
            } else {
              money = NP.plus(money, v.lender || 0)
            }
          } else if (name === 'year') {
            if (type === 'borrower') {
              money = NP.plus(money, v.yearBorrow || 0)
            } else {
              money = NP.plus(money, v.yearCredit || 0)
            }
          } else {
            if (type === 'borrower') {
              money = NP.plus(money, v.direction === '借方' && v.beginningBalance > 0 ? v.beginningBalance : 0)
              money = NP.plus(money, v.borrower || 0)
            } else {
              money = NP.plus(money, v.direction === '贷方' && v.beginningBalance > 0 ? v.beginningBalance : 0)
              money = NP.plus(money, v.lender || 0)
            }
          }
        }
      })
      return money !== 0 ? this.formatMoney(money, '', 2) : ''
    }
  }
}
</script>
