<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      数量金额总账
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
          <span style="width: 120px; text-align: right; margin-right: 5px; line-height: 30px;">包括未过账凭证：</span>
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
          <div class="tb tb2_1">科目名称</div>
          <div class="tb">期间</div>
          <div class="tb">计量单位</div>
          <div class="tb tb2_1">期初余额</div>
          <div class="tb tb2_1">借方</div>
          <div class="tb tb2_1">贷方</div>
          <div class="tb tb2_1">本年累计借方</div>
          <div class="tb tb2_1">本年累计贷方</div>
          <div class="tb tb2_1">期末余额</div>
        </div>

        <div class="t_c">
          <ul>
            <li v-for="(v, i) in tableData" :key="i"
                @click="which = i"
                @dblclick="goDetail(v)"
                :class="{active: i === which}">
              <div class="tb">{{v.code}}</div>
              <div class="tb tb2_1">{{v.name}}</div>
              <div class="tb">{{v.time}}</div>
              <div class="tb">{{v.unit}}</div>
              <div class="tb tb2_1">
                <span>{{getDirection(v.beginningBalance || 0, v.direction)}}</span>
                <p style="text-align: right"> {{v.beginningBalance !== 0 ? formatMoney(v.beginningBalance, '', 2) : ''}}</p>
              </div>
              <div class="tb tb2_1" style="text-align: right;">{{v.borrower !== 0 ? formatMoney(v.borrower, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">{{v.lender !== 0 ? formatMoney(v.lender, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">{{v.yearBorrow !== 0 ? formatMoney(v.yearBorrow, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">{{v.yearCredit !== 0 ? formatMoney(v.yearCredit, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">
                <span>{{getDirection(v.balance || 0, v.direction)}}</span>
                <p style="text-align: right">{{v.balance !== 0 ? formatMoney(v.balance, '', 2) : ''}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true" :isUnit="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { numberAccounting } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'numberAccountingIndex',
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
        post: false
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
      let list = this.subjectList.filter(f => f.numberUnit && f.unit)
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
      numberAccounting(this.search).then(res => {
        let { subject, credentials } = res.data
        let list = []
        let period = this.moment(this.search.accountingPeriod).format('YYYY-MM-DD').split('-')
        let periodEnd = this.moment(this.search.accountingPeriodEnd).format('YYYY-MM-DD').split('-')
        let pushFun = (v, time, isName) => {
          if (v.eachBalance && v.eachBalance.length) {
            let info = v.eachBalance.find(e => e.time === time)
            let direction = v.balance === '借方'
            let borrower = credentials.reduce((total, c) => {
              if (c.accountingPeriod === time) {
                c.child.forEach(cc => {
                  if (cc.subjectCode.includes(v.code)) {
                    total = NP.plus(total, cc.borrower || 0)
                  }
                })
              }
              return total
            }, 0)
            let lender = credentials.reduce((total, c) => {
              if (c.accountingPeriod === time) {
                c.child.forEach(cc => {
                  if (cc.subjectCode.includes(v.code)) {
                    total = NP.plus(total, cc.lender || 0)
                  }
                })
              }
              return total
            }, 0)
            let yearBorrow = credentials.reduce((total, c) => {
              c.child.forEach(cc => {
                if (cc.subjectCode.includes(v.code)) {
                  total = NP.plus(total, cc.borrower || 0)
                }
              })
              return total
            }, 0)
            let yearCredit = credentials.reduce((total, c) => {
              c.child.forEach(cc => {
                if (cc.subjectCode.includes(v.code)) {
                  total = NP.plus(total, cc.lender || 0)
                }
              })
              return total
            }, 0)
            let obj = {
              time,
              code: isName ? v.code : '',
              name: isName ? v.name : '',
              unit: v.unit,
              borrower: NP.plus(info ? info.borrower || 0 : 0, borrower),
              lender: NP.plus(info ? info.lender || 0 : 0, lender),
              beginningBalance: isName ? info ? info.beginningBalance || 0 : 0 : list[list.length - 1].balance,
              yearBorrow: NP.plus(v.yearBorrow || 0, yearBorrow),
              yearCredit: NP.plus(v.yearCredit || 0, yearCredit),
              direction: v.balance
            }
            obj.balance = NP[direction ? 'minus' : 'plus'](NP[direction ? 'plus' : 'minus'](obj.beginningBalance || 0, obj.borrower || 0), obj.lender || 0)
            if (obj.borrower || obj.lender || obj.beginningBalance || obj.balance || obj.yearBorrow || obj.yearCredit) {
              list.push(obj)
            }
          }
        }
        subject.forEach(v => {
          if (this.search.accountingPeriodEnd) {
            for (let i = parseInt(period[1]); i <= parseInt(periodEnd[1]); i++) {
              pushFun(v, period[0] + '-' + i, i === parseInt(period[1]))
            }
          } else {
            pushFun(v, period[0] + '-' + parseInt(period[1]), true)
          }
        })
        this.tableData = list
      }).catch(err => {
        this.$Notice.error({
          title: '数量金额总账',
          desc: err.message
        })
      })
    },
    goDetail (v) {
      this.$router.push({
        name: 'numberAccountingDetailIndex',
        query: {
          accountSetId: this.accountSet._id,
          subjectCode: v.code,
          subject: v.name,
          accountingPeriod: v.time
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
    .tb2_1 {
      width: 140px;
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
