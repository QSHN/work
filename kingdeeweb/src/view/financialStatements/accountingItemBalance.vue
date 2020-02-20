<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px; margin-bottom: 5px;">
      核算项目余额表
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">项目类别：</span>
          <Select v-model="search.accountItem" style="width: 150px">
            <Option v-for="(v, i) in accountingProgram" :value="v.title" :key="i">{{v.title}}</Option>
          </Select>
        </div>

        <div style="display: flex; margin-left: 20px;">
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
          <div class="tb">期间</div>
          <div class="tb">项目编码</div>
          <div class="tb tb2">项目名称</div>
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
            <div class="tb_top">本年累计</div>
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
          <ul v-for="(t, tIndex) in tableData" :key="tIndex">
            <li v-for="(v, i) in t.child" :key="i"
                @click="which = [tIndex, i]"
                @dblclick="goDetail(t.subjectCode, t.subject, v.accountingPeriod)"
                :class="{active: tIndex === which[0] && i === which[1]}">
              <div class="tb">{{v.accountingPeriod}}</div>
              <div class="tb">{{t.code}}</div>
              <div class="tb tb2">{{t.name}}</div>
              <div class="tb tb3">
                <div class="tb_c">
                  <template v-if="t.direction === '借方'">
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
                  <div class="tb" style="text-align: right">{{v.borrower !== 0 ? formatMoney(v.borrower, '', 2) : ''}}</div>
                  <div class="tb" style="text-align: right">{{v.lender !== 0 ? formatMoney(v.lender, '', 2) : ''}}</div>
                </div>
              </div>
              <div class="tb tb3" style="text-align: right;">
                <div class="tb_c">
                  <template v-if="t.direction === '借方'">
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
                  <div class="tb" style="text-align: right">{{total('year', 'borrower')}}</div>
                  <div class="tb" style="text-align: right">{{total('year', 'lender')}}</div>
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
import { accountingItemBalance } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { accountingProgram } from '../../libs/accountingProgram'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'accountBalanceIndex',
  components: {
    selectSubject
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
        post: false,
        accountItem: '客户'
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
    total (name, type) {
      let money = 0
      this.tableData.forEach(t => {
        t.child.forEach(v => {
          if (name === 'beginningBalance') {
            if (type === 'borrower') {
              money = NP.plus(money, t.direction === '借方' && v.beginningBalance > 0 ? v.beginningBalance : 0)
            } else {
              money = NP.plus(money, t.direction === '贷方' && v.beginningBalance > 0 ? v.beginningBalance : 0)
            }
          } else if (name === 'now') {
            if (type === 'borrower') {
              money = NP.plus(money, v.borrower || 0)
            } else {
              money = NP.plus(money, v.lender || 0)
            }
          } else if (name === 'year') {
            if (type === 'borrower') {
              money = NP.plus(money, v.borrower || 0)
            } else {
              money = NP.plus(money, v.lender || 0)
            }
          } else {
            if (type === 'borrower') {
              money = NP.plus(money, t.direction === '借方' && v.balance > 0 ? v.balance : 0)
            } else {
              money = NP.plus(money, t.direction === '贷方' && v.balance > 0 ? v.balance : 0)
            }
          }
        })
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
    load () {
      accountingItemBalance(this.search).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '核算项目余额表',
          desc: err.message
        })
      })
    },
    goDetail (subjectCode, subject, accountingPeriod) {
      this.$router.push({
        name: 'accountingDetailIndex',
        query: {
          accountSetId: this.accountSet._id,
          subjectCode: subjectCode,
          subject: subject,
          accountingPeriod: accountingPeriod
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
    max-width: 1404px;
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
      width: 251px;
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
      width: 1402px;
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
      width: 1402px;
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
