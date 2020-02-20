<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      科目利息计算表
    </Row>

    <Card shadow style="margin: 10px 0">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">开始计算日期：</span>
          <DatePicker v-model="search.time" style="width: 150px" :clearable="false" :disabled="true"></DatePicker>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <DatePicker v-model="search.timeEnd" :options="options" style="width: 150px"></DatePicker>
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
          <Select v-model="search.currency" filterable style="width: 150px;">
            <Option v-for="item in currencyList" :value="item" :key="item">{{ item }}</Option>
          </Select>
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
          <div class="tb tb2">核算项目</div>
          <div class="tb">币别</div>
          <div class="tb">方向</div>
          <div class="tb tb2">本币余额</div>
          <div class="tb">计息开始日</div>
          <div class="tb">计息截止日</div>
          <div class="tb">计息天数</div>
          <div class="tb tb2">积数</div>
          <div class="tb tb2">实计利息</div>
          <div class="tb tb2">应计利息</div>
          <div class="tb">日利率</div>
        </div>

        <div class="t_c">
          <ul v-if="tableData.subject">
            <li v-for="(v, i) in tableData.subject" :key="i">
              <div class="tb">{{v.code}}</div>
              <div class="tb tb2">{{v.name}}</div>
              <div class="tb tb2">
                <template v-for="item in v.accountItem">
                  / {{item.type}}：{{item.name}}（{{item.code}}）
                </template>
              </div>
              <div class="tb" style="text-align: center">{{v.currency}}</div>
              <div class="tb" style="text-align: center">{{getDirection(getBalance(v), v.balance)}}</div>
              <div class="tb tb2" style="text-align: right">{{getBalance(v)}}</div>
              <div class="tb" style="text-align: center">{{moment(search.time).format('YYYY-MM-DD')}}</div>
              <div class="tb" style="text-align: center">{{moment(search.timeEnd).format('YYYY-MM-DD')}}</div>
              <div class="tb" style="text-align: right">{{moment(search.timeEnd).diff(moment(search.time), 'days')}}</div>
              <div class="tb tb2" style="text-align: right">{{getValue('product', v)}}</div>
              <div class="tb tb2" style="text-align: right">{{getValue('interest', v)}}</div>
              <div class="tb tb2" style="text-align: right">{{getValue('interest', v)}}</div>
              <div class="tb" style="text-align: right">{{v.draw}}‰</div>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { interest } from '../../api/credentials'
import { currencyQuery } from '../../api/currency'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'finalTuningHistoryIndex',
  components: {
    selectSubject
  },
  data () {
    return {
      which: -1,
      search: {
        time: null,
        timeEnd: null,
        subjectCode: null,
        subjectCodeEnd: null,
        currency: '人民币'
      },
      tableData: {},
      currencyList: [],
      options: {},
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
          this.search.time = moment(new Date(this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod)).format('YYYY-MM-DD')
          this.search.timeEnd = moment().format('YYYY-MM-DD')
          let expiryDate = moment(this.search.time).valueOf()
          this.options = {
            disabledDate (date) {
              return date && date.valueOf() < expiryDate + 86400000
            }
          }
          this.load()
          this.loadCurrency()
          this.loadSubject()
        }
      },
      immediate: true,
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
    getValue (type, item) {
      let money = 0
      let direction = item.balance === '借方'
      if (item.currency !== this.accountSet.unit) {
        money = Math.abs(NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](item.initBeginningBalance || 0, item.initYearBorrow || 0), item.initYearCredit || 0))
        if (this.tableData.credentials) {
          let total = this.tableData.credentials.reduce((total, v) => {
            v.child.forEach(c => {
              if (c.subjectCode === item.code) {
                if (v.borrower) {
                  total = NP[direction ? 'plus' : 'minus'](total, v.currencyAmount)
                }
                if (v.lender) {
                  total = NP[direction ? 'minus' : 'plus'](total, v.currencyAmount)
                }
              }
            })
            return total
          }, 0)
          money = NP.plus(money, Math.abs(total))
        }
      } else {
        money = Math.abs(NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](item.beginningBalance || 0, item.yearBorrow || 0), item.yearCredit || 0))
      }
      money = NP.times(money, moment(this.search.timeEnd).diff(moment(this.search.time), 'days'))
      if (type === 'interest') {
        money = NP.times(NP.divide(money, 1000), item.draw)
      }
      return money
    },
    getBalance (row) {
      let direction = row.balance === '借方'
      return NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](row.beginningBalance || 0, row.yearBorrow || 0), row.yearCredit || 0)
    },
    total (code, which) {
      let money = 0
      this.tableData.forEach(t => {
        t.child.forEach(c => {
          if (!code || (code && c.subjectCode === code)) {
            if (which === 'old') {
              money = NP.plus(money, c.oldBorrower || c.oldLender)
            } else if (which === 'new') {
              money = NP.plus(money, NP.times(c.oldCurrencyAmount, c.rate))
            } else {
              money = NP.plus(money, c.borrower || c.lender)
            }
          }
        })
      })
      return this.formatMoney(money, '', 2)
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
    load () {
      interest({
        accountSetId: this.accountSet._id,
        subjectCode: this.search.subjectCode,
        subjectCodeEnd: this.search.subjectCodeEnd,
        subjectDraw: true,
        currency: this.search.currency
      }).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Modal.error({
          title: '科目利息计算表',
          content: err.message
        })
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data.map(v => v.name)
      }).catch(err => {
        this.$Notice.error({
          title: '币别',
          desc: err.message
        })
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
    }
  }
}
</script>

<style lang="less" scoped>
  .c_table {
    position: relative;
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
      width: 1902px;
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
      width: 1902px;
      list-style: none;
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
