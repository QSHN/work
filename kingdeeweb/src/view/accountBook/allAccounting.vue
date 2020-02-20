<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      核算项目分类总账
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
          <div class="tb tb2">{{search.accountItem}}</div>
          <div class="tb">期间</div>
          <div class="tb">科目编码</div>
          <div class="tb tb2">科目名</div>
          <div class="tb tb2_1">期初余额</div>
          <div class="tb tb2_1">借方</div>
          <div class="tb tb2_1">贷方</div>
          <div class="tb tb2_1">本年累计借方</div>
          <div class="tb tb2_1">本年累计贷方</div>
          <div class="tb tb2_1">期末余额</div>
        </div>

        <div class="t_c">
          <ul v-for="(v, i) in tableData" :key="i">
            <li v-for="(v1, i1) in v.cData" :key="i1"
                @click="which = [i, i1]"
                @dblclick="goDetail(v)"
                :class="{active: i === which[0] && i1 === which[1]}">
              <div class="tb tb2">{{v.name}}</div>
              <div class="tb">{{v1.time}}</div>
              <div class="tb">{{v1.code}}</div>
              <div class="tb tb2">{{v1.name}}</div>
              <div class="tb tb2_1">
                <span>{{getDirection(v1.beginningBalance || 0, v1.direction)}}</span>
                <p style="text-align: right"> {{v1.beginningBalance !== 0 ? formatMoney(v1.beginningBalance || 0, '', 2) : ''}}</p>
              </div>
              <div class="tb tb2_1" style="text-align: right;">{{v1.borrower !== 0 ? formatMoney(v1.borrower, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">{{v1.lender !== 0 ? formatMoney(v1.lender, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">{{v1.yearBorrow !== 0 ? formatMoney(v1.yearBorrow, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">{{v1.yearCredit !== 0 ? formatMoney(v1.yearCredit, '', 2) : ''}}</div>
              <div class="tb tb2_1" style="text-align: right;">
                <span>{{getDirection(v1.balance || 0, v1.direction)}}</span>
                <p style="text-align: right">{{v1.balance !== 0 ? formatMoney(v1.balance || 0, '', 2) : ''}}</p>
              </div>
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
import { allAccounting } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import { accountingProgram } from '../../libs/accountingProgram'
// import NP from 'number-precision'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'allAccountingIndex',
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
    load () {
      allAccounting(this.search).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Notice.error({
          title: '总分类账',
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
    }
  }
}
</script>

<style lang="less" scoped>
  .c_table {
    position: relative;
    width: 100%;
    max-width: 1504px;
    /*height: 100%;*/
    /*display: flex;*/
    /*flex-direction: column;*/
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
      width: 150px;
    }
    .tb3 {
      width: 300px;
    }

    .t_h {
      position: relative;
      width: 1502px;
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
      width: 1502px;
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
