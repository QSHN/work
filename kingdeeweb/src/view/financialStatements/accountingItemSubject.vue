<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      核算项目科目组合表
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">项目类别：</span>
          <Select v-model="search.accountItem" style="width: 300px">
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
      </Row>

      <Row type="flex" style="margin-top: 15px;">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">取数类型：</span>
          <Select v-model="search.backType" multiple style="width: 150px">
            <Option v-for="(v, i) in backTypeList" :value="v" :key="i">{{v}}</Option>
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
        <div class="t_h" :style="{width: 200 + (100 * backType.length) * tableTitle.length + 'px'}">
          <div class="tb tb2" style="text-align: left; padding-left: 5px">
            科目名称：
            <Icon type="md-arrow-round-forward" />
          </div>
          <div class="tb" :style="{width: 100 * backType.length + 'px'}"
               v-for="(v, i) in tableTitle" :key="i">
            {{v}}
          </div>
        </div>

        <div class="t_c">
          <ul :style="{width: 200 + (100 * backType.length) * tableTitle.length + 'px'}">
            <li style="background: #d7eafc">
              <div class="tb tb2">
                {{search.accountItem}}：
                <Icon type="md-arrow-round-down" />
              </div>
              <template  v-for="item in tableTitle">
                <div class="tb" v-for="(b, bIndex) in backType" :key="item + bIndex"  style="text-align: right">
                  {{b}}
                </div>
              </template>
            </li>
          </ul>

          <ul :style="{width: 200 + (100 * backType.length) * tableTitle.length + 'px'}">
            <li v-for="(v, i) in tableContent" :key="i">
              <div class="tb tb2">{{v}}</div>
              <template  v-for="item in tableTitle">
                <div class="tb" v-for="(b, bIndex) in backType" :key="item + bIndex"  style="text-align: right">
                  {{getContent(item, v, b)}}
                </div>
              </template>
            </li>
          </ul>

          <ul :style="{width: 200 + (100 * backType.length) * tableTitle.length + 'px'}">
            <li style="background: #fdf2bd">
              <div class="tb tb2">合计</div>
              <template  v-for="item in tableTitle">
                <div class="tb" v-for="(b, bIndex) in backType" :key="item + bIndex"  style="text-align: right">
                  {{getContent(item, null, b)}}
                </div>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </Card>

    <selectSubject ref="subject" :isReturnObj="true" :isAccountItem="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { accountingItemSubject } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { accountingProgram } from '../../libs/accountingProgram'
import { querySubject } from '../../api/subject'
import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'accountingItemSubjectIndex',
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
        accountItem: '客户',
        backType: ['借方发生']
      },
      tableData: [],
      tableTitle: [],
      tableContent: [],
      backType: [],
      backTypeList: [
        '借方发生',
        '贷方发生'
      ],
      subjectList: []
    }
  },
  computed: {
    ...mapGetters([
      'accountSet'
    ]),
    getSubjectList () {
      let list = this.subjectList.filter(f => f.accountItem.length)
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
    getContent (tName, cName, type) {
      let which = type === '借方发生' ? 'borrower' : 'lender'
      let money = this.tableData.reduce((total, v) => {
        if (tName && cName) {
          if (v.tName === tName && v.cName === cName) total = NP.plus(total, v[which])
        } else if (tName && !cName) {
          if (v.tName === tName) total = NP.plus(total, v[which])
        }
        return total
      }, 0)
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
      accountingItemSubject(this.search).then(res => {
        let list = []
        let tList = []
        let cList = []
        res.data.forEach(v => {
          v.child.forEach(c => {
            let fData = c.accountingItem.find(f => f.type === this.search.accountItem)
            if (!fData) return
            if (!cList.includes(fData.name)) cList.push(fData.name)
            if (!tList.includes(c.subject)) tList.push(c.subject)
            let uData = list.find(f => f.tCode === c.subjectCode && f.cCode === fData.code)
            let borrower = 0
            let lender = 0
            if (this.search.backType.includes('借方发生')) {
              borrower = c.borrower || 0
            }
            if (this.search.backType.includes('贷方发生')) {
              lender = c.lender || 0
            }
            if (uData) {
              uData.borrower = NP.plus(uData.borrower || 0, borrower)
              uData.lender = NP.plus(uData.lender || 0, lender)
            } else {
              list.push({
                borrower,
                lender,
                tCode: c.subjectCode,
                tName: c.subject,
                cCode: fData.code,
                cName: fData.name
              })
            }
          })
        })
        this.tableData = list
        this.tableTitle = tList
        this.tableContent = cList
        this.backType = this.search.backType
      }).catch(err => {
        this.$Notice.error({
          title: '核算项目科目组合表',
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
    max-width: 1404px;
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
      height: 36px;
      line-height: 37px;
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
