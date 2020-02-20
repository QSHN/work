<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      调汇历史信息
    </Row>
    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
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
          <div class="tb">会计期间</div>
          <div class="tb">科目编码</div>
          <div class="tb tb2">科目名称</div>
          <div class="tb">原币名称</div>
          <div class="tb">方向</div>
          <div class="tb tb2">原币余额</div>
          <div class="tb">调整前汇率</div>
          <div class="tb tb2">调整前本位币余额</div>
          <div class="tb">调整后汇率</div>
          <div class="tb tb2">调整后本位币余额</div>
          <div class="tb tb2">调整前后本位币差额</div>
        </div>

        <div class="t_c">
          <ul v-for="(t, tIndex) in tableData" :key="tIndex">
            <li v-for="(v, i) in t.child" :key="i">
              <div class="tb">{{v.accountingPeriod}}</div>
              <div class="tb">{{v.subjectCode}}</div>
              <div class="tb tb2">{{v.subject}}</div>
              <div class="tb">{{v.currency}}</div>
              <div class="tb">{{getDirection(v.oldCurrencyAmount, v.direction)}}</div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(v.oldCurrencyAmount, '', 2)}}</div>
              <div class="tb">{{v.oldRate}}</div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(v.oldBorrower || v.oldLender, '', 2)}}</div>
              <div class="tb">{{v.rate}}</div>
              <div class="tb tb2" style="text-align: right">{{times(v.oldCurrencyAmount, v.rate)}}</div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(v.borrower || v.lender, '', 2)}}</div>
            </li>

            <li style="background: #fdf2bd">
              <div class="tb"></div>
              <div class="tb"></div>
              <div class="tb tb2">小计</div>
              <div class="tb"></div>
              <div class="tb"></div>
              <div class="tb tb2"></div>
              <div class="tb"></div>
              <div class="tb tb2" style="text-align: right">{{total(t.code, 'old')}}</div>
              <div class="tb"></div>
              <div class="tb tb2" style="text-align: right">{{total(t.code, 'new')}}</div>
              <div class="tb tb2" style="text-align: right">{{total(t.code, 'balance')}}</div>
            </li>
          </ul>

          <ul>
            <li  style="background: #fdf2bd">
              <div class="tb"></div>
              <div class="tb"></div>
              <div class="tb tb2">总计</div>
              <div class="tb"></div>
              <div class="tb"></div>
              <div class="tb tb2"></div>
              <div class="tb"></div>
              <div class="tb tb2" style="text-align: right">{{total(false, 'old')}}</div>
              <div class="tb"></div>
              <div class="tb tb2" style="text-align: right">{{total(false, 'new')}}</div>
              <div class="tb tb2" style="text-align: right">{{total(false, 'balance')}}</div>
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
import { finalTuningHistory } from '../../api/credentials'
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
        accountSetId: null,
        subjectCode: null,
        subjectCodeEnd: null,
        accountingPeriod: null,
        accountingPeriodEnd: null,
        currency: '所有币别'
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
    }
  },
  methods: {
    formatMoney,
    moment,
    times (money, rate) {
      return this.formatMoney(NP.times(money, rate), '', 2)
    },
    getDirection (money, direction) {
      if (money === 0) {
        return '平'
      } else {
        return direction ? direction.charAt(0) : ''
      }
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
      finalTuningHistory(this.search).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Modal.error({
          title: '调汇历史信息',
          content: err.message
        })
      })
    },
    loadCurrency () {
      currencyQuery({
        accountSetId: this.accountSet._id
      }).then(res => {
        this.currencyList = res.data.map(v => v.name)
        this.currencyList.push('所有币别')
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
    max-width: 1604px;
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
      width: 1602px;
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
      width: 1602px;
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
