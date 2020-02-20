<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      核算项目组合表
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">核算项目：</span>
          <Select v-model="search.accountItem[0]" style="width: 150px">
            <Option v-for="(v, i) in accountingProgram" :value="v.title" :key="i">{{v.title}}</Option>
          </Select>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;"></span>
          <Select v-model="search.accountItem[1]" style="width: 150px">
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
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">取数类型</span>
          <Select v-model="search.backType" style="width: 150px">
            <Option v-for="(v, i) in ['借方发生额', '贷方发生额', '借贷差额']" :value="v" :key="i">{{v}}</Option>
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
        <div class="t_h" :style="{width: 400 + 200 * tableTitle.length + 'px'}">
          <div class="tb tb2"></div>
          <div class="tb tb2" v-for="(v, i) in tableTitle" :key="i">{{v}}</div>
          <div class="tb tb2">小计</div>
        </div>

        <div class="t_c">
          <ul :style="{width: 400 + 200 * tableTitle.length + 'px'}">
            <li v-for="(v, i) in tableContent" :key="i">
              <div class="tb tb2">{{v}}</div>
              <div class="tb tb2" v-for="(item, index) in tableTitle" :key="index"  style="text-align: right">
                {{getContent(item, v)}}
              </div>
              <div class="tb tb2"  style="text-align: right">{{getContent(null, v)}}</div>
            </li>
          </ul>

          <ul :style="{width: 400 + 200 * tableTitle.length + 'px'}">
            <li style="background: #fdf2bd">
              <div class="tb tb2">小计</div>
              <div class="tb tb2" v-for="(item, index) in tableTitle" :key="index"  style="text-align: right">
                {{getContent(item, null)}}
              </div>
              <div class="tb tb2" style="text-align: right">
                {{getContent(null, null)}}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true" :isAccountItem="true" :isMoreAccountItem="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { accountingItemCombination } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { accountingProgram } from '../../libs/accountingProgram'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'accountingItemCombinationIndex',
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
        accountingPeriod: null,
        accountingPeriodEnd: null,
        post: false,
        accountItem: ['', ''],
        backType: '借方发生额'
      },
      tableData: [],
      tableTitle: [],
      tableContent: [],
      subjectList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      let list = this.subjectList.filter(f => f.accountItem.length > 1)
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
    }
  },
  methods: {
    formatMoney,
    moment,
    getContent (tName, cName) {
      let money = this.tableData.reduce((total, v) => {
        if (tName && cName) {
          if (v.tName === tName && v.cName === cName) total = NP.plus(total, v.number)
        } else if (tName && !cName) {
          if (v.tName === tName) total = NP.plus(total, v.number)
        } else if (!tName && cName) {
          if (v.cName === cName) total = NP.plus(total, v.number)
        } else {
          total = NP.plus(total, v.number)
        }
        return total
      }, 0)
      return money !== 0 ? this.formatMoney(money, '', 2) : ''
    },
    selectSubject () {
      this.$refs.subject.show(obj => {
        this.search.subjectCode = obj.code
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
      if (this.search.accountItem.filter(v => !v).length) {
        this.$Notice.error({
          title: '核算项目组合表',
          desc: '必选选两个核算项目'
        })
      } else {
        accountingItemCombination(this.search).then(res => {
          let list = []
          let tList = []
          let cList = []
          res.data.forEach(v => {
            v.child.forEach(c => {
              let fData = c.accountingItem.find(f => f.type === this.search.accountItem[0])
              let fData1 = c.accountingItem.find(f => f.type === this.search.accountItem[1])
              if (!fData || !fData1) return
              if (!tList.includes(fData.name)) tList.push(fData.name)
              if (!cList.includes(fData1.name)) cList.push(fData1.name)
              let uData = list.find(f => f.tCode === fData.code && f.cCode === fData1.code)
              let number = 0
              switch (this.search.backType) {
                case '借方发生额':
                  number = c.borrower || 0
                  break
                case '贷方发生额':
                  number = c.lender || 0
                  break
                case '借贷差额':
                  number = Math.abs(NP.minus(c.borrower || 0, c.lender || 0))
                  break
              }
              if (uData) {
                uData.number = NP.plus(uData.number || 0, number)
              } else {
                list.push({
                  number,
                  tCode: fData.code,
                  tName: fData.name,
                  cCode: fData1.code,
                  cName: fData1.name
                })
              }
            })
          })
          this.tableData = list
          this.tableTitle = tList
          this.tableContent = cList
        }).catch(err => {
          this.$Notice.error({
            title: '核算项目组合表',
            desc: err.message
          })
        })
      }
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
