<template>
  <div>
    <Row type="flex" style="line-height: 30px; font-size: 18px;">
      多栏式明细账
    </Row>

    <Card shadow style="margin: 10px 0">
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
          <Button type="default" style="margin-left: 10px;" @click="selectSubject">选择</Button>
        </div>

        <div style="display: flex; margin-left: 20px;" v-if="accountingProgram.length">
          <span style="margin-right: 5px; line-height: 30px;">项目类别：</span>
          <Select v-model="search.accountItem" style="width: 150px">
            <Option v-for="(v, i) in accountingProgram" :value="v" :key="i">{{v}}</Option>
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
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <template v-if="tableData.balance">
          <p>
            借方显示：
          </p>
          <Select v-model="borrowerList" multiple :max-tag-count="1" style="width:180px">
            <Option v-for="(item, index) in allBorrowerList" :value="item" :key="index">{{ item }}</Option>
          </Select>

          <p style="margin-left: 20px;">
            贷方显示：
          </p>
          <Select v-model="lenderList" multiple :max-tag-count="1" style="width:180px">
            <Option v-for="(item, index) in allLenderList" :value="item" :key="index">{{ item }}</Option>
          </Select>

          <template v-if="!search.accountItem">
            <p style="margin-left: 20px;">
              科目级别：
            </p>
            <Select v-model="subjectLevel" style="width:100px">
              <Option v-for="(item, index) in [2, 3, 4]" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </template>
        </template>
      </div>
      <div class="c_table">
        <div class="t_h" :style="{width: 1000 + ((borrowerList.length + lenderList.length) * 100) + 'px'}">
          <div class="tb">日期</div>
          <div class="tb">凭证字号</div>
          <div class="tb tb2">摘要</div>
          <div class="tb tb2">借方</div>
          <div class="tb tb2">贷方</div>
          <div class="tb tb2">余额</div>
          <div class="tb tb3" v-if="borrowerList.length" :style="{width: borrowerList.length * 100 + 'px'}">
            <div class="tb_top">借方</div>
            <div class="tb_bottom">
              <div class="tb" v-for="(item, itemIndex) in borrowerList" :key="itemIndex">{{item}}</div>
            </div>
          </div>
          <div class="tb tb3" v-if="lenderList.length" :style="{width: lenderList.length * 100 + 'px'}">
            <div class="tb_top">贷方</div>
            <div class="tb_bottom">
              <div class="tb" v-for="(item, itemIndex) in lenderList" :key="itemIndex">{{item}}</div>
            </div>
          </div>
        </div>

        <div class="t_c" v-if="tableData.balance" :style="{width: 1000 + ((borrowerList.length + lenderList.length) * 100) + 'px'}">
          <ul>
            <li style="background: #f8f8f9">
              <div class="tb">{{tableData.balance ? moment(new Date(tableData.balance.time)).format('YYYY-MM-DD') : ''}}</div>
              <div class="tb"></div>
              <div class="tb tb2">{{tableData.balance.time.split('-')[1] === '1' ? '年初' : '期初'}}余额</div>
              <div class="tb tb2" style="text-align: right">{{tableData.balance.borrower ? formatMoney(tableData.balance.borrower, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: right">{{tableData.balance.lender ? formatMoney(tableData.balance.lender, '', 2) : ''}}</div>
              <div class="tb tb2">
                <span>{{getDirection(tableData.balance.beginningBalance || 0, tableData.balance.balance)}}</span>
                <p style="text-align: right">{{tableData.balance.beginningBalance ? formatMoney(tableData.balance.beginningBalance, '', 2) : ''}}</p>
              </div>
              <div class="tb tb3" v-if="borrowerList.length" :style="{width: borrowerList.length * 100 + 'px'}">
                <div class="tb_c">
                  <div class="tb" v-for="(item, itemIndex) in borrowerList" :key="itemIndex"></div>
                </div>
              </div>
              <div class="tb tb3" v-if="lenderList.length" :style="{width: lenderList.length * 100 + 'px'}">
                <div class="tb_c">
                  <div class="tb" v-for="(item, itemIndex) in lenderList" :key="itemIndex"></div>
                </div>
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
                <div class="tb tb2" style="text-align: right">{{formatMoney(v2.borrower || 0, '', 2)}}</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v2.lender || 0, '', 2)}}</div>
                <div class="tb tb2">
                  <span>{{getDirection(v2.balance || 0, tableData.balance.balance)}}</span>
                  <p style="text-align: right">{{formatMoney(v2.balance || 0, '', 2)}}</p>
                </div>

                <div class="tb tb3" v-if="borrowerList.length" :style="{width: borrowerList.length * 100 + 'px'}">
                  <div class="tb_c">
                    <div class="tb" v-for="(item, itemIndex) in borrowerList" :key="itemIndex" style="text-align: right">
                      <template v-if="search.accountItem">
                        {{v2.accountingItem.find(f => f.name === item) ? v2.borrower ? formatMoney(v2.borrower || 0, '', 2) : '' : ''}}
                      </template>
                      <template v-else>
                        {{isSubSubject(item, v2.subject) ? v2.borrower ? formatMoney(v2.borrower || 0, '', 2) : '' : ''}}
                      </template>
                    </div>
                  </div>
                </div>
                <div class="tb tb3" v-if="lenderList.length" :style="{width: lenderList.length * 100 + 'px'}">
                  <div class="tb_c">
                    <div class="tb" v-for="(item, itemIndex) in lenderList" :key="itemIndex" style="text-align: right">
                      <template v-if="search.accountItem">
                        {{v2.accountingItem.find(f => f.name === item) ? v2.lender ? formatMoney(v2.lender || 0, '', 2) : '' : ''}}
                      </template>
                      <template v-else>
                        {{isSubSubject(item, v2.subject) ? v2.lender ? formatMoney(v2.lender || 0, '', 2) : '' : ''}}
                      </template>
                    </div>
                  </div>
                </div>
              </li>

              <li style="background: #fdf2bd">
                <div class="tb">{{v1.time}}</div>
                <div class="tb"></div>
                <div class="tb tb2">本日合计</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v1.borrower || 0, '', 2)}}</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v1.lender || 0, '', 2)}}</div>
                <div class="tb tb2">
                  <span>{{getDirection(v1.balance || 0, tableData.balance.balance)}}</span>
                  <p style="text-align: right">{{formatMoney(v1.balance || 0, '', 2)}}</p>
                </div>
                <div class="tb tb3" v-if="borrowerList.length" :style="{width: borrowerList.length * 100 + 'px'}">
                  <div class="tb_c">
                    <div class="tb" v-for="(item, itemIndex) in borrowerList" :key="itemIndex" style="text-align: right">
                      {{formatMoney(total('borrower', item, v1.time), '', 2)}}
                    </div>
                  </div>
                </div>
                <div class="tb tb3" v-if="lenderList.length" :style="{width: lenderList.length * 100 + 'px'}">
                  <div class="tb_c">
                    <div class="tb" v-for="(item, itemIndex) in lenderList" :key="itemIndex" style="text-align: right">
                      {{formatMoney(total('lender', item, v1.time), '', 2)}}
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <ul>
              <li style="background: #fdf2bd">
                <div class="tb">{{v.accountingPeriod}}</div>
                <div class="tb"></div>
                <div class="tb tb2">本期合计</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v.borrower || 0, '', 2)}}</div>
                <div class="tb tb2" style="text-align: right">{{formatMoney(v.lender || 0, '', 2)}}</div>
                <div class="tb tb2">
                  <span>{{getDirection(v.balance || 0, tableData.balance.balance)}}</span>
                  <p style="text-align: right">{{formatMoney(v.balance || 0, '', 2)}}</p>
                </div>
                <div class="tb tb3" v-if="borrowerList.length" :style="{width: borrowerList.length * 100 + 'px'}">
                  <div class="tb_c">
                    <div class="tb" v-for="(item, itemIndex) in borrowerList" :key="itemIndex" style="text-align: right">
                      {{formatMoney(total('borrower', item, v.accountingPeriod), '', 2)}}
                    </div>
                  </div>
                </div>
                <div class="tb tb3" v-if="lenderList.length" :style="{width: lenderList.length * 100 + 'px'}">
                  <div class="tb_c">
                    <div class="tb" v-for="(item, itemIndex) in lenderList" :key="itemIndex" style="text-align: right">
                      {{formatMoney(total('lender', item, v.accountingPeriod), '', 2)}}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <ul>
            <li style="background: #d8e5cf">
              <div class="tb"></div>
              <div class="tb"></div>
              <div class="tb tb2">本年累计</div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(total('borrower'), '', 2)}}</div>
              <div class="tb tb2" style="text-align: right">{{formatMoney(total('lender'), '', 2)}}</div>
              <div class="tb tb2">
                <span>{{getDirection(total('all'), tableData.balance.balance)}}</span>
                <p style="text-align: right">{{formatMoney(total('all'), '', 2)}}</p>
              </div>
              <div class="tb tb3" v-if="borrowerList.length" :style="{width: borrowerList.length * 100 + 'px'}">
                <div class="tb_c">
                  <div class="tb" v-for="(item, itemIndex) in borrowerList" :key="itemIndex" style="text-align: right">
                    {{formatMoney(total('borrower', item), '', 2)}}
                  </div>
                </div>
              </div>
              <div class="tb tb3" v-if="lenderList.length" :style="{width: lenderList.length * 100 + 'px'}">
                <div class="tb_c">
                  <div class="tb" v-for="(item, itemIndex) in lenderList" :key="itemIndex" style="text-align: right">
                    {{formatMoney(total('lender', item), '', 2)}}
                  </div>
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
import { moreColumn } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'accountingMoreColumn',
  components: {
    selectSubject
  },
  data () {
    return {
      which: [-1, -1, -1],
      search: {
        accountSetId: null,
        subjectCode: null,
        accountingPeriod: null,
        accountingPeriodEnd: null,
        post: false,
        accountItem: null
      },
      tableData: [],
      accountingProgram: [],
      accountItem: [],
      subjectList: [],
      borrowerList: [],
      lenderList: [],
      allBorrowerList: [],
      allLenderList: [],
      subjectLevel: null,
      allSubjectList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      let list = this.allSubjectList
      return list
    }
  },
  watch: {
    accountSet: {
      handler () {
        if (this.accountSet) {
          this.search.accountSetId = this.accountSet._id
          this.search.accountingPeriod = this.accountSet.currentAccountingPeriod || this.accountSet.accountingYear + '-' + this.accountSet.accountingPeriod
          // this.load()
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
    },
    'search.subjectCode' () {
      if (this.search.subjectCode) {
        this.search.accountItem = null
        this.accountingProgram = this.allSubjectList.find(f => f.code === this.search.subjectCode).accountItem
        this.subjectLevel = null
        this.borrowerList = []
        this.lenderList = []
        this.allBorrowerList = []
        this.allLenderList = []
      }
    },
    subjectLevel () {
      if (!this.search.accountItem) {
        let list = []
        list = this.subjectList.filter(v => v.parentId.length === (this.subjectLevel - 1))
        list = list.map(v => v.name)
        this.borrowerList = list
        this.lenderList = list
        this.allBorrowerList = list
        this.allLenderList = list
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
    selectSubject () {
      this.$refs.subject.show(obj => {
        this.search.subjectCode = obj.code
      })
    },
    loadSubject () {
      querySubject({ accountSetId: this.accountSet._id }).then(res => {
        // console.log('querySubject', res.data)
        this.allSubjectList = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '科目',
          desc: err.message
        })
      })
    },
    isSubSubject (parentName, name) {
      let pData = this.subjectList.find(v => v.name === parentName)
      let sData = this.subjectList.find(v => v.name === name)
      return sData.parentId.includes(pData._id) || parentName === name
    },
    total (type, name, time) {
      let direction = this.tableData.balance.balance === '借方'
      let money = type === 'all' ? this.tableData.balance.beginningBalance : 0
      this.tableData.list.forEach(t => {
        t.day.forEach(d => {
          money = d.child.reduce((total, v) => {
            if (type === 'all') {
              if (v.borrower) {
                total = NP[direction ? 'plus' : 'minus'](total, v.borrower)
              } else if (v.lender) {
                total = NP[direction ? 'minus' : 'plus'](total, v.lender)
              }
            } else if (type === 'borrower') {
              if (!name || (name && (this.search.accountItem ? v.accountingItem.find(f => f.name === name) : this.isSubSubject(name, v.subject)))) {
                if (!time || (time && (time === d.time || time === t.accountingPeriod))) {
                  total = NP.plus(total, v.borrower || 0)
                }
              }
            } else {
              if (!name || (name && (this.search.accountItem ? v.accountingItem.find(f => f.name === name) : this.isSubSubject(name, v.subject)))) {
                if (!time || (time && (time === d.time || time === t.accountingPeriod))) {
                  total = NP.plus(total, v.lender || 0)
                }
              }
            }
            return total
          }, money)
        })
      })
      return money
    },
    load () {
      moreColumn(this.search).then(res => {
        let { balance, list, accountItem, subjectList } = res.data
        let arr = []
        let total = balance.beginningBalance
        list.forEach(v => {
          let findData = arr.find(a => a.accountingPeriod === v.accountingPeriod)
          let subjectList = JSON.parse(JSON.stringify(v.child.filter(c => c.subjectCode.includes(this.search.subjectCode))))
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
        this.accountItem = accountItem
        this.subjectList = subjectList
        let initList = []
        if (this.search.accountItem) {
          initList = this.accountItem.map(v => v.name)
        } else {
          initList = this.subjectList.filter(v => v.parentId.length === 1)
          this.subjectLevel = 2
          if (initList.length === 0) {
            initList = this.subjectList.filter(v => v.parentId.length === 2)
            this.subjectLevel = 3
          }
          if (initList.length === 0) {
            initList = this.subjectList.filter(v => v.parentId.length === 3)
            this.subjectLevel = 4
          }
          if (initList.length === 0) {
            this.subjectLevel = null
          } else {
            initList = initList.map(v => v.name)
          }
        }
        this.borrowerList = initList
        this.lenderList = initList
        this.allBorrowerList = initList
        this.allLenderList = initList
      }).catch(err => {
        this.$Notice.error({
          title: '多栏式明细账',
          desc: err.message
        })
      })
    },
    goDetail (v) {
      // this.$router.push({
      //   name: 'accountingDetailIndex',
      //   query: {
      //     accountSetId: this.accountSet._id,
      //     subjectCode: v.code,
      //     subject: v.name,
      //     accountingPeriod: v.time
      //   }
      // })
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;

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
      width: 150px;
    }
    .tb3 {
      position: relative;
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
        height: 100%;
      }

      .tb_c {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: row;
      }
    }

    .t_h {
      position: relative;
      height: 49px;
      line-height: 48px;
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
