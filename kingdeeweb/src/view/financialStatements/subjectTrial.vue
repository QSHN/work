<template>
  <div>
    <Row type="flex" style="line-height: 30px; font-size: 18px;">
      试算平衡表 ——
      <span style="color: #4d8afa" v-if="total('balance', 'borrower') === total('balance', 'lender')">试算结果平衡</span>
      <span style="color: red" v-else>试算结果不平衡</span>
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">会计期间：</span>
          <DatePicker type="month" v-model="search.accountingPeriod" style="width: 100px" :clearable="false"></DatePicker>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <DatePicker type="month" v-model="search.accountingPeriodEnd" style="width: 100px"></DatePicker>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">科目：</span>
          <Select v-model="search.subjectCode" filterable clearable style="width: 150px">
            <Option v-for="item in getSubjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject(false)">选择</Button>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <Select v-model="search.subjectCodeEnd" filterable clearable style="width: 150px" :disabled="!search.subjectCode">
            <Option v-for="item in getSubjectList" :value="item.code" :key="item.code" :disabled="item.code <= search.subjectCode">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject(true)" :disabled="!search.subjectCode">选择</Button>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">币别：</span>
          <Select v-model="search.currency" filterable style="width: 100px;">
            <Option v-for="(item, index) in currencyList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">包括未过账凭证：</span>
          <Checkbox v-model="search.post" style="margin-top: 7px;"></Checkbox>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <Button type="primary" @click="load" style="width: 100px;">搜索</Button>
        </div>
      </Row>
    </Card>

    <Card shadow>
      <div class="c_table">
        <div class="t_h">
          <div class="tb">科目编码</div>
          <div class="tb tb2">科目名称</div>
          <div class="tb tb3">
            <div class="tb_top">期初余额</div>
            <div class="tb_bottom">
              <div class="tb">借方</div>
              <div class="tb">贷方</div>
            </div>
          </div>
          <div class="tb tb3">
            <div class="tb_top">本期发生</div>
            <div class="tb_bottom">
              <div class="tb">借方</div>
              <div class="tb">贷方</div>
            </div>
          </div>
          <div class="tb tb3">
            <div class="tb_top">期末余额</div>
            <div class="tb_bottom">
              <div class="tb">借方</div>
              <div class="tb">贷方</div>
            </div>
          </div>
        </div>

        <div class="t_c">
          <ul>
            <li v-for="(v, i) in tableData" :key="i"
                @click="which = i"
                @dblclick="goDetail(v)"
                :class="{active: i === which}">
              <div class="tb">{{v.code}}</div>
              <div class="tb tb2">{{v.name}}</div>
              <div class="tb tb3">
                <div class="tb_c">
                  <template v-if="v.direction === '借方'">
                    <div class="tb" style="text-align: right">{{v.beginningBalance > 0 ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</div>
                    <div class="tb" style="text-align: right">{{0 > v.beginningBalance ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</div>
                  </template>
                  <template v-else>
                    <div class="tb" style="text-align: right">{{0 > v.beginningBalance ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</div>
                    <div class="tb" style="text-align: right">{{v.beginningBalance > 0 ? formatMoney(Math.abs(v.beginningBalance), '', 2) : ''}}</div>
                  </template>
                </div>
              </div>
              <div class="tb tb3" style="text-align: right;">
                <div class="tb_c">
                  <div class="tb" style="text-align: right">{{v.borrower !== 0 ? formatMoney(v.borrower, '', 2) : ''}}</div>
                  <div class="tb" style="text-align: right">{{v.lender !== 0 ? formatMoney(v.lender, '', 2) : ''}}</div>
                </div>
              </div>
              <div class="tb tb3" style="text-align: right;">
                <div class="tb_c">
                  <template v-if="v.direction === '借方'">
                    <div class="tb" style="text-align: right">{{v.balance > 0 ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</div>
                    <div class="tb" style="text-align: right">{{0 > v.balance ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</div>
                  </template>
                  <template v-else>
                    <div class="tb" style="text-align: right">{{0 > v.balance ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</div>
                    <div class="tb" style="text-align: right">{{v.balance > 0 ? formatMoney(Math.abs(v.balance), '', 2) : ''}}</div>
                  </template>
                </div>
              </div>
            </li>
          </ul>

          <ul>
            <li style="background: #fdf2bd">
              <div class="tb"></div>
              <div class="tb tb2">合计</div>
              <div class="tb tb3">
                <div class="tb_c">
                  <div class="tb" style="text-align: right">{{total('beginningBalance', 'borrower')}}</div>
                  <div class="tb" style="text-align: right">{{total('beginningBalance', 'lender')}}</div>
                </div>
              </div>
              <div class="tb tb3">
                <div class="tb_c">
                  <div class="tb" style="text-align: right">{{total('now', 'borrower')}}</div>
                  <div class="tb" style="text-align: right">{{total('now', 'lender')}}</div>
                </div>
              </div>
              <div class="tb tb3">
                <div class="tb_c">
                  <div class="tb" style="text-align: right">{{total('balance', 'borrower')}}</div>
                  <div class="tb" style="text-align: right">{{total('balance', 'lender')}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generalLedger } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { currencyQuery } from '../../api/currency'
import { querySubject } from '../../api/subject'
import { accountingProgram } from '../../libs/accountingProgram'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'subjectTrialIndex',
  components: {
    selectSubject
  },
  data () {
    return {
      accountingProgram,
      which: -1,
      search: {
        accountSetId: null,
        subjectCode: null,
        subjectCodeEnd: null,
        accountingPeriod: null,
        accountingPeriodEnd: null,
        post: false,
        currency: '人民币'
      },
      tableData: [],
      currencyList: [],
      subjectList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      let list = this.subjectList
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
          this.loadCurrency()
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
    total (name, type) {
      let money = 0
      this.tableData.forEach(v => {
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
        let period = this.moment(this.search.accountingPeriod).format('YYYY-MM-DD').split('-')
        let periodEnd = this.search.accountingPeriodEnd ? this.moment(this.search.accountingPeriodEnd).format('YYYY-MM-DD').split('-') : period
        let pushFun = (v, time, endTime) => {
          let info = v.eachBalance.find(e => e.time === time)
          let direction = v.balance === '借方'
          let borrower = credentials.reduce((total, c) => {
            c.child.forEach(cc => {
              if (cc.subjectCode.includes(v.code)) {
                total = NP.plus(total, cc.borrower || 0)
              }
            })
            return total
          }, 0)
          let lender = credentials.reduce((total, c) => {
            c.child.forEach(cc => {
              if (cc.subjectCode.includes(v.code)) {
                total = NP.plus(total, cc.lender || 0)
              }
            })
            return total
          }, 0)
          let allBorrow = v.eachBalance.reduce((total, c) => {
            if (c.time >= time && c.time <= endTime) {
              total = NP.plus(total, c.borrower || 0)
            }
            return total
          }, 0)
          let allLender = v.eachBalance.reduce((total, c) => {
            if (c.time >= time && c.time <= endTime) {
              total = NP.plus(total, c.lender || 0)
            }
            return total
          }, 0)
          let beginningBalance = 0
          if (v.balance === '借方') {
            beginningBalance = NP.minus(NP.plus(v.beginningBalance || 0, v.yearBorrow || 0), v.yearCredit || 0)
          } else {
            beginningBalance = NP.minus(NP.plus(v.beginningBalance || 0, v.yearCredit || 0), v.yearBorrow || 0)
          }
          let obj = {
            code: v.code,
            name: v.name,
            borrower: NP.plus(allBorrow, borrower),
            lender: NP.plus(allLender, lender),
            beginningBalance: info ? info.beginningBalance || 0 : beginningBalance || 0,
            yearBorrow: NP.plus(allBorrow, borrower),
            yearCredit: NP.plus(allLender, lender),
            direction: v.balance,
            isParent: subject.filter(f => (f.parentId.includes(v._id.toString()))).length
          }
          obj.balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](obj.beginningBalance || 0, obj.borrower || 0), obj.lender || 0)
          if (obj.borrower || obj.lender || obj.beginningBalance || obj.balance || obj.yearBorrow || obj.yearCredit) {
            list.push(obj)
          }
        }
        subject.forEach(v => {
          pushFun(v, period[0] + '-' + parseInt(period[1]), periodEnd[0] + '-' + parseInt(periodEnd[1]))
        })
        this.tableData = list
      }).catch(err => {
        this.$Notice.error({
          title: '总分类账',
          desc: err.message
        })
      })
    },
    goDetail (v) {
      this.$router.push({
        name: 'accountingDetailIndex',
        query: {
          accountSetId: this.accountSet._id,
          subjectCode: v.code,
          subject: v.name,
          accountingPeriod: v.time
        }
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .c_table {
    position: relative;
    max-width: 1354px;
    width: 100%;
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
      position: relative;
      width: 350px;
      line-height: 24px;

      .tb_top {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 24px;
        border-bottom: 1px solid #dcdee2;
      }

      .tb_bottom {
        position: absolute;
        left: 0;
        right: 0;
        top: 24px;
        bottom: 0;
      }

      .tb {
        width: 50%;
        height: 100%;
        float: left;
      }

      .tb_c {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }

    .t_h {
      position: relative;
      width: 1352px;
      height: 49px;
      line-height: 48px;
      background: #f8f8f9;
      text-align: center;
      border-bottom: 1px solid #dcdee2;

      & > div {}
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
      width: 1352px;
      list-style: none;
      /*border-bottom: 1px solid #dcdee2;*/
      padding: 0;

      li {
        width: 100%;
        cursor: pointer;
        border-bottom: 1px solid #dcdee2;

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
