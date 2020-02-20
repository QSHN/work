<template>
  <div>
    <Row type="flex" justify="space-between" style="margin-bottom: 5px;">
      <p style="line-height: 30px; font-size: 18px;">
        总分类账
      </p>
      <Button type="success" @click="$refs.printModal.show()">预览/打印</Button>
    </Row>
    <card style="margin: 10px 0;">
      <div style="display: flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">会计期间：</span>
          <DatePicker type="month" v-model="search.accountingPeriod" style="width: 100px" :clearable="false"></DatePicker>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <DatePicker type="month" v-model="search.accountingPeriodEnd" style="width: 100px" placement="bottom-end"></DatePicker>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">科目：</span>
          <Select v-model="search.subjectCode" filterable clearable style="width: 150px">
            <Option v-for="item in getSubjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject(false)">选择</Button>
        </div>

        <div style="display: flex;">
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <Select v-model="search.subjectCodeEnd" filterable clearable style="width: 150px" :disabled="!search.subjectCode">
            <Option v-for="item in getSubjectList" :value="item.code" :key="item.code" :disabled="item.code <= search.subjectCode">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject(true)" :disabled="!search.subjectCode">选择</Button>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="width: 120px; text-align: right; margin-right: 5px; line-height: 30px;">包括未过账凭证：</span>
          <Checkbox v-model="search.post" style="margin-top: 7px;"></Checkbox>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <Button type="primary" @click="load" style="width: 100px;">搜索</Button>
        </div>
      </div>

      <div style="display: flex; margin-top: 15px;">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">核算项目：</span>
          <Select v-model="filter.accountItem" clearable style="width: 233px">
            <Option v-for="(v, i) in accountingProgram" :value="v.title" :key="i">{{v.title}}</Option>
          </Select>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">科目级次：</span>
          <Select v-model="filter.subjectLevel" clearable style="width:122px">
            <Option v-for="(item, index) in [1, 2, 3, 4]" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </div>

        <div style="display: flex; margin-left: 10px;">
          <span style="text-align: right; margin-right: 5px; line-height: 30px;">无发生额且余额为0不显示：</span>
          <Checkbox v-model="filter.noAmount" style="margin-top: 7px;"></Checkbox>
        </div>
      </div>
    </card>
    <card>
      <div class="c_table">
        <div class="t_h">
          <div class="tb">科目</div>
          <div class="tb tb3">科目名称</div>
          <div class="tb">期间</div>
          <div class="tb tb2">摘要</div>
          <div class="tb tb2">借方</div>
          <div class="tb tb2">贷方</div>
          <div class="tb tb2">余额</div>
        </div>

        <div class="t_c">
          <ul v-for="(v, i) in tableData" :key="i">
            <li v-for="(v1, i1) in v.child" :key="i1"
                @click="which = [i, i1]"
                @dblclick="goDetail(v, v1.period)"
                :class="{active: i === which[0] && i1 === which[1]}">
              <div class="tb">{{i1 === 0 ? v.code : ''}}</div>
              <div class="tb tb3">{{i1 === 0 ? v.name : ''}}</div>
              <div class="tb">{{v1.period}}</div>
              <div class="tb tb2">{{v1.abstract}}</div>
              <div class="tb tb2" style="text-align: right">{{v1.borrower !== 0 ? formatMoney(v1.borrower, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: right">{{v1.lender !== 0 ? formatMoney(v1.lender, '', 2) : ''}}</div>
              <div class="tb tb2">
                <span>{{getDirection(v1.balance, v.direction)}}</span>
                <p style="text-align: right">{{v1.balance !== 0 ? formatMoney(v1.balance, '', 2) : ''}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </card>

    <selectSubject ref="subject" :isReturnObj="true" :isLimitAccounting="true" />
    <printModal ref="printModal" :printList="tableData" :printType="'generalLedger'" :period="search" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generalLedger } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
import printModal from '../../components/print/index'
import { accountingProgram } from '../../libs/accountingProgram'
export default {
  name: 'generalLedgerIndex',
  components: {
    selectSubject,
    printModal
  },
  data () {
    return {
      accountingProgram,
      which: [-1, -1],
      search: {
        accountSetId: null,
        subjectCode: null,
        subjectCodeEnd: null,
        accountingPeriod: null,
        accountingPeriodEnd: null,
        post: false
      },
      filter: {
        accountItem: [],
        subjectLevel: null,
        noAmount: false
      },
      tableData: [],
      subjectList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      let list = this.subjectList.filter(f => !f.controlledSystem)
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.search.accountSetId = this.accountSet._id
          this.search.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          this.load()
          this.loadSubject()
        }
      },
      immediate: true,
      deep: true
    },
    search: {
      handler () {
        if (this.search.accountingPeriod && this.search.accountingPeriodEnd) {
          if (this.moment(this.accountingPeriodEnd).isBefore(this.search.accountingPeriod)) {
            this.search.accountingPeriodEnd = this.search.accountingPeriod
          }
        }
      },
      deep: true
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
    selectSubject (isEnd) {
      this.$refs.subject.show(obj => {
        if (!isEnd) {
          this.search.subjectCode = obj.code
        } else {
          if (obj.code <= this.search.subjectCode) {
            this.search.subjectCodeEnd = this.search.subjectCode
          } else {
            this.search.subjectCodeEnd = obj.code
          }
        }
      })
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubject', res.data)
        this.subjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    load () {
      generalLedger(this.search).then(res => {
        let { subject, credentials } = res.data
        let list = []
        let getMoney = (type, which, period, sData, child) => {
          let money = 0
          let time = period[0] + '-' + parseInt(period[1])
          let balance = sData.eachBalance ? sData.eachBalance.find(v => v.time === time) : null
          let subList = credentials.filter(v => v.child.filter(v => v.subjectCode.includes(sData.code)).length)
          let isPlusBL = true
          let credBorrower = subList.reduce((total, v) => {
            if (v.accountingPeriod <= time) {
              if (v.accountingPeriod < time) isPlusBL = false
              v.child.forEach(c => {
                if (c.subjectCode.includes(sData.code)) total = NP.plus(total, c.borrower || 0)
              })
            }
            return total
          }, 0)
          let credLender = subList.reduce((total, v) => {
            if (v.accountingPeriod <= time) {
              if (v.accountingPeriod < time) isPlusBL = false
              v.child.forEach(c => {
                if (c.subjectCode.includes(sData.code)) total = NP.plus(total, c.lender || 0)
              })
            }
            return total
          }, 0)

          money = balance ? balance.beginningBalance || 0 : sData.beginningBalance || 0
          if (!balance && sData.eachBalance && sData.eachBalance.length > 0) {
            let lastBalance = sData.eachBalance[sData.eachBalance.length - 1]
            if (sData.balance === '借方') {
              money = NP.minus(NP.plus(lastBalance.beginningBalance || 0, lastBalance.borrower || 0), lastBalance.lender || 0)
            } else {
              money = NP.minus(NP.plus(lastBalance.beginningBalance || 0, lastBalance.lender || 0), lastBalance.borrower || 0)
            }
          }
          if (which === '期初') {
            if (sData.eachBalance && sData.eachBalance.length) {
            } else {
              if (sData.balance === '借方') {
                money = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearBorrow || 0), sData.yearCredit || 0)
              } else {
                money = NP.minus(NP.plus(sData.beginningBalance || 0, sData.yearCredit || 0), sData.yearBorrow || 0)
              }
            }
          } else if (which === '本期') {
            if (type === 'balance') {
              if (sData.balance === '借方') {
                if (balance) money = NP.minus(NP.plus(money, balance.borrower || 0), balance.lender || 0)
                money = NP.minus(NP.plus(money, credBorrower), credLender)
              } else {
                if (balance) money = NP.minus(NP.plus(money, balance.lender || 0), balance.borrower || 0)
                money = NP.minus(NP.plus(money, credLender), credBorrower)
              }
            } else {
              money = balance ? balance[type] || 0 : 0
              if (isPlusBL) money = NP.plus(money, type === 'borrower' ? credBorrower : credLender)
            }
          } else {
            if (type === 'balance') {
              let totalBorrower = child.reduce((total, v) => (total = NP.plus(total, v.borrower || 0)), 0)
              let totalLender = child.reduce((total, v) => (total = NP.plus(total, v.lender || 0)), 0)
              if (sData.balance === '借方') {
                money = NP.minus(NP.plus(money, totalBorrower || 0), totalLender || 0)
              } else {
                money = NP.minus(NP.plus(money, totalLender || 0), totalBorrower || 0)
              }
            } else {
              money = child.reduce((total, v) => (total = NP.plus(total, v[type] || 0)), 0)
            }
          }
          return money
        }

        subject.forEach(v => {
          let period = this.moment(this.search.accountingPeriod).format('YYYY-MM-DD').split('-')
          let child = []
          if (this.search.accountingPeriodEnd) {
            let time = period[0] + '-' + parseInt(period[1])
            let periodEnd = this.moment(this.search.accountingPeriodEnd).format('YYYY-MM-DD').split('-')
            let endTime = periodEnd[0] + '-' + parseInt(periodEnd[1])
            let isDefault = true
            if (v.eachBalance && v.eachBalance.length) {
              let eList = v.eachBalance.filter(e => e.time >= time && e.time <= endTime)
              if (eList.length) {
                isDefault = false
                for (let i = parseInt(period[1]); i <= parseInt(periodEnd[1]); i++) {
                  let arr = [period[0], i]
                  child.push({
                    period: i,
                    abstract: '本期合计',
                    borrower: getMoney('borrower', '本期', arr, v),
                    lender: getMoney('lender', '本期', arr, v),
                    balance: getMoney('balance', '本期', arr, v),
                    direction: v.balance
                  })
                }
              }
            }
            if (isDefault) {
              let balance = 0
              if (v.balance === '借方') {
                balance = NP.minus(NP.plus(v.beginningBalance || 0, v.yearBorrow || 0), v.yearCredit || 0)
              } else {
                balance = NP.minus(NP.plus(v.beginningBalance || 0, v.yearCredit || 0), v.yearBorrow || 0)
              }
              child.push({
                period: parseInt(period[1]),
                abstract: '本期合计',
                borrower: v.yearBorrow || 0,
                lender: v.yearCredit || 0,
                balance: balance,
                direction: v.balance
              })
            }
          } else {
            child.push({
              period: parseInt(period[1]),
              abstract: '本期合计',
              borrower: getMoney('borrower', '本期', period, v),
              lender: getMoney('lender', '本期', period, v),
              balance: getMoney('balance', '本期', period, v),
              direction: v.balance
            })
          }
          let total = JSON.parse(JSON.stringify(child))
          child.unshift({
            period: parseInt(period[1]),
            abstract: parseInt(period[1]) === 1 ? '年初余额' : '期初余额',
            borrower: 0,
            lender: 0,
            balance: getMoney('balance', '期初', period, v),
            direction: v.balance
          })
          child.push({
            period: parseInt(period[1]),
            abstract: '本年累计',
            borrower: getMoney('borrower', '本年', period, v, total),
            lender: getMoney('lender', '本年', period, v, total),
            balance: getMoney('balance', '本年', period, v, total),
            direction: v.balance
          })
          list.push({
            code: v.code,
            name: v.name,
            period: period[0],
            child: child,
            direction: v.balance,
            accountItem: v.accountItem
          })
        })
        if (this.filter.accountItem.length) {
          list = list.filter(v => v.accountItem.find(f => v.accountItem.includes(f)))
        }
        if (this.filter.subjectLevel) {
          list = list.filter(v => v.code.split('.').length === this.filter.subjectLevel)
        }
        if (this.filter.noAmount) {
          list = list.filter(v => v.child.filter(f => f.borrower || f.lender || f.balance).length)
        }
        this.tableData = list
      }).catch(err => {
        this.$Notice.error({
          title: '总分类账',
          desc: err.message
        })
      })
    },
    goDetail (v, period) {
      this.$router.push({
        name: 'credentialsSubjectIndex',
        query: {
          accountSetId: this.accountSet._id,
          subjectCode: v.code,
          subject: v.name,
          accountingPeriod: v.period + '-' + period
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .c_table {
    position: relative;
    width: 100%;
    max-width: 1304px;
    /*height: 100%;*/
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdee2;
    overflow: auto;

    .tb {
      position: relative;
      width: 100px;
      display: table-cell;
      border-left: 1px solid #dcdee2;
      font-size: 14px;
      overflow: hidden;

      span {
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #dcdee2;
      }
    }
    .tb2 {
      width: 200px;
    }
    .tb3 {
      width: 300px;
    }

    .t_h {
      position: relative;
      width: 1302px;
      height: 37px;
      line-height: 36px;
      background: #f8f8f9;
      text-align: center;
      border-bottom: 1px solid #dcdee2;
    }

    .t_c {
      flex-grow: 1;
    }

    .t_h, li {
      .tb:nth-child(1) {
        border: none;
      }
    }

    ul {
      width: 1302px;
      list-style: none;
      border-bottom: 1px solid #dcdee2;
      padding: 0;

      li {
        width: 100%;
        cursor: pointer;

        &.active {
          background: #000;
          color: #fff;
        }

        .tb {
          font-size: 12px;
          padding: 3px 5px;
        }
      }
    }
  }
</style>
