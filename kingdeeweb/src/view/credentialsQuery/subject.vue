<template>
  <div>
    <Row type="flex" justify="space-between">
      <p style="line-height: 30px; font-size: 18px;">
        明细账分类账
        <span style="margin: 0 10px;">——【{{search.subjectCode}}】{{search.subject}}</span>
        {{search.accountingItem ? '（' + search.accountingItem  + '）' : ''}}
      </p>
      <Button type="success" @click="$refs.printModal.show()">预览/打印</Button>
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">会计期间：</span>
          <DatePicker type="month" v-model="search.accountingPeriod" style="width: 100px"></DatePicker>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <DatePicker type="month" v-model="search.accountingPeriodEnd" style="width: 100px"></DatePicker>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">日期：</span>
          <DatePicker type="daterange" split-panels v-model="search.time" style="width: 180px" :start-date="new Date(search.accountingPeriod)"></DatePicker>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">科目：</span>
          <Select v-model="search.subject" filterable clearable style="width: 150px">
            <Option v-for="item in getSubjectList" :value="item.name" :key="item.code">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject">选择</Button>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">过账状态：</span>
          <Select v-model="search.post" style="width: 100px;">
            <Option v-for="(item, index) in search.postList" :value="item" :key="index">{{ item }}</Option>
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
          <div class="tb">日期</div>
          <div class="tb">凭证字号</div>
          <div class="tb tb2">摘要</div>
          <div class="tb tb3">对方科目</div>
          <div class="tb tb2">借方金额</div>
          <div class="tb tb2">贷方金额</div>
          <div class="tb tb2">余额</div>
        </div>

        <div class="t_c" v-if="tableData.balance">
          <ul>
            <li style="background: #f8f8f9">
              <div class="tb">{{tableData.balance ? moment(new Date(tableData.balance.time)).format('YYYY-MM-DD') : ''}}</div>
              <div class="tb"></div>
              <div class="tb tb2">{{tableData.balance.time.split('-')[1] === '1' ? '年初' : '期初'}}余额</div>
              <div class="tb tb3"></div>
              <div class="tb tb2" style="text-align: right">{{tableData.balance && formatMoney(tableData.balance.borrower || 0, '', 2)}}</div>
              <div class="tb tb2" style="text-align: right">{{tableData.balance && formatMoney(tableData.balance.lender || 0, '', 2)}}</div>
              <div class="tb tb2">
                <span>{{getDirection(tableData.balance.beginningBalance || 0, tableData.balance.balance)}}</span>
                <p style="text-align: right">{{tableData.balance && formatMoney(tableData.balance.beginningBalance || 0, '', 2)}}</p>
              </div>
            </li>
          </ul>

          <div v-for="(v, i) in tableData.list" :key="i">
            <ul  v-for="(v1, i1) in v.day" :key="i1">
              <li v-for="(v2, i2) in v1.child" :key="i2"
                  @click="which = [i, i1, i2]"
                  @dblclick="goDetail(v2._id)"
                  :class="{active: i === which[0] && i1 === which[1] && i2 === which[2]}">
                <div class="tb">{{moment(v2.time).format('YYYY-MM-DD')}}</div>
                <div class="tb">{{v2.proofWords + ' - ' + v2.certificateNumber}}</div>
                <div class="tb tb2">{{v2.abstract}}</div>
                <div class="tb tb3">
                  {{v2.subjectCode}} {{v2.subject}}
                  <template v-for="(item) in v2.accountingItem">
                    / {{item.type}}：{{item.name}}（{{item.code}}）
                  </template>
                </div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v2.borrower || 0, '', 2)}}</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v2.lender || 0, '', 2)}}</div>
                <div class="tb tb2">
                  <span>{{getDirection(v2.balance || 0, tableData.balance.balance)}}</span>
                  <p style="text-align: right">{{formatMoney(v2.balance || 0, '', 2)}}</p>
                </div>
              </li>
              <li style="background: #fdf2bd">
                <div class="tb">{{v1.time}}</div>
                <div class="tb"></div>
                <div class="tb tb2">本日合计</div>
                <div class="tb tb3"></div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v1.borrower || 0, '', 2)}}</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v1.lender || 0, '', 2)}}</div>
                <div class="tb tb2">
                  <span>{{getDirection(v1.balance || 0, tableData.balance.balance)}}</span>
                  <p style="text-align: right">{{formatMoney(v1.balance || 0, '', 2)}}</p>
                </div>
              </li>
            </ul>

            <ul>
              <li style="background: #fdf2bd">
                <div class="tb">{{v.accountingPeriod}}</div>
                <div class="tb"></div>
                <div class="tb tb2">本期合计</div>
                <div class="tb tb3"></div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v.borrower || 0, '', 2)}}</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v.lender || 0, '', 2)}}</div>
                <div class="tb tb2">
                  <span>{{getDirection(v.balance || 0, tableData.balance.balance)}}</span>
                  <p style="text-align: right">{{formatMoney(v.balance || 0, '', 2)}}</p>
                </div>
              </li>
            </ul>
          </div>

          <ul>
            <li style="background: #d8e5cf">
              <div class="tb"></div>
              <div class="tb"></div>
              <div class="tb tb2">本年累计</div>
              <div class="tb tb3"></div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(total('borrower'), '', 2)}}</div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(total('lender'), '', 2)}}</div>
              <div class="tb tb2">
                <span>{{getDirection(total('all'), tableData.balance.balance)}}</span>
                <p style="text-align: right">{{formatMoney(total('all'), '', 2)}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true"/>
    <printModal ref="printModal" :printData="tableData" :printType="'subjectDetail'" :period="search" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { credentialsSubject } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
import printModal from '../../components/print/index'
export default {
  name: 'credentialsSubjectIndex',
  components: {
    selectSubject,
    printModal
  },
  data () {
    return {
      which: [-1, -1, -1],
      search: {
        accountSetId: null,
        subjectCode: null,
        subject: null,
        accountingPeriod: null,
        accountingPeriodEnd: null,
        accountingItem: null,
        time: null,
        postList: ['未过账', '已过账', '全部'],
        post: '全部'
      },
      tableData: {},
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
        if (this.search.subject && this.subjectList.length) {
          this.search.subjectCode = this.subjectList.find(f => f.name === this.search.subject).code
        }
      },
      deep: true
    },
    '$route': {
      handler () {
        if (this.$route.name !== 'credentialsSubjectIndex') return
        let {
          accountSetId,
          subjectCode,
          subject,
          accountingPeriod,
          accountingPeriodEnd,
          accountingItem
        } = this.$route.query
        this.search.accountSetId = accountSetId
        this.search.subjectCode = subjectCode
        this.search.subject = subject
        if (accountingPeriod) this.search.accountingPeriod = accountingPeriod
        if (accountingPeriodEnd) this.search.accountingPeriodEnd = accountingPeriodEnd
        if (accountingItem !== 'null') this.search.accountingItem = accountingItem
        if (this.search.subjectCode) this.load()
        this.$forceUpdate()
      },
      deep: true,
      immediate: true
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
    selectSubject () {
      this.$refs.subject.show(obj => {
        this.search.subjectCode = obj.code
        this.search.subject = obj.name
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
    total (type) {
      let direction = this.tableData.balance.balance === '借方'
      let money = type === 'all' ? this.tableData.balance.beginningBalance : 0
      this.tableData.list.forEach(v => {
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
    },
    load () {
      credentialsSubject(this.search).then(res => {
        let { balance, list } = res.data
        let arr = []
        let total = balance.beginningBalance
        list.forEach(v => {
          let findData = arr.find(a => a.accountingPeriod === v.accountingPeriod)
          let subjectList = JSON.parse(JSON.stringify(
            v.child.filter(c => {
              let isIt = c.subjectCode.includes(this.search.subjectCode)
              let isA = true
              if (this.search.accountingItem) {
                let findAccountItem = c.accountingItem.map(a => a.name).join(',')
                isA = findAccountItem === this.search.accountingItem
              }
              return isIt && isA
            })
          ))
          subjectList.forEach(s => {
            s.time = v.time
            s.proofWords = v.proofWords
            s.certificateNumber = v.certificateNumber
            s._id = v._id
          })
          if (findData) {
            let day = findData.day.find(d => this.moment(d.time).format('YYYY-MM-DD') === this.moment(v.time).format('YYYY-MM-DD'))
            if (day) {
              day.child = day.child.concat(subjectList)
            } else {
              findData.day.push({
                time: this.moment(v.time).format('YYYY-MM-DD'),
                child: subjectList
              })
            }
          } else {
            arr.push({
              accountingPeriod: v.accountingPeriod,
              day: [{
                time: this.moment(v.time).format('YYYY-MM-DD'),
                child: subjectList
              }]
            })
          }
        })
        arr.map(v => {
          v.day.map(d => {
            d.child.map(c => {
              if (c.borrower) {
                total = NP[balance.balance === '借方' ? 'plus' : 'minus'](total, c.borrower)
              } else if (c.lender) {
                total = NP[balance.balance === '借方' ? 'minus' : 'plus'](total, c.lender)
              }
              c.balance = total
            })
            d.balance = d.child[d.child.length - 1].balance
            d.borrower = d.child.reduce((total, r) => (total = NP.plus(total, r.borrower || 0)), 0)
            d.lender = d.child.reduce((total, r) => (total = NP.plus(total, r.lender || 0)), 0)
          })
          v.balance = v.day[v.day.length - 1].balance
          v.borrower = v.day.reduce((total, r) => (total = NP.plus(total, r.borrower || 0)), 0)
          v.lender = v.day.reduce((total, r) => (total = NP.plus(total, r.lender || 0)), 0)
        })
        this.tableData = {
          balance,
          list: arr
        }
      }).catch(err => {
        this.$Modal.error({
          title: '明细账',
          content: err.message
        })
      })
    },
    goDetail (id) {
      this.$router.push({
        name: 'voucherInputIndex',
        query: {
          id,
          type: 'look'
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
