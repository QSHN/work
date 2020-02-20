<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      摘要汇总表
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
          <span style="margin-right: 5px; line-height: 30px;">摘要：</span>
          <Input v-model="search.abstract" style="width: 150px" />
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">日期：</span>
          <DatePicker type="daterange" split-panels v-model="search.time" style="width: 180px"></DatePicker>
        </div>

        <div style="display: flex; margin-left: 20px;">
          <span style="margin-right: 5px; line-height: 30px;">科目：</span>
          <Select v-model="search.subjectCode" filterable clearable style="width: 150px">
            <Option v-for="item in getSubjectList" :value="item.code" :key="item.code">{{ item.code }} {{ item.name }}</Option>
          </Select>
          <Button type="default" style="margin-left: 10px;" @click="selectSubject(false)">选择</Button>
          <span style="margin: 0 10px; line-height: 30px;">至</span>
          <Select v-model="search.subjectCodeEnd" filterable clearable placement="bottom-end" style="width: 150px" :disabled="!search.subjectCode">
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
          <div class="tb tb2">摘要</div>
          <div class="tb tb3">会计科目</div>
          <div class="tb tb2">借方发生总额</div>
          <div class="tb tb2">贷方发生总额</div>
          <div class="tb tb2">方向</div>
          <div class="tb tb2">区间发生净额</div>
        </div>

        <div class="t_c">
          <ul>
            <li v-for="(v, i) in tableData.list"
                :key="i"
                :class="{active: i === which}"
                @dblclick="goDetail(v)"
                @click="which = i">
              <div class="tb tb2">{{v.abstract}}</div>
              <div class="tb tb3">[{{v.subjectCode}}] {{v.subject}}</div>
              <div class="tb tb2" style="text-align: right">{{v.borrower ? formatMoney(v.borrower, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: right">{{v.lender ? formatMoney(v.lender, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: center">{{v.direction.charAt(0)}}</div>
              <div class="tb tb2" style="text-align: right">
                {{
                v.direction === '借方' ?
                v.borrower ? formatMoney(v.borrower, '', 2) : formatMoney(-(v.lender), '', 2) :
                v.lender ? formatMoney(v.lender, '', 2) : formatMoney(-(v.borrower), '', 2)
                }}
              </div>
            </li>

            <li style="background: #fdf2bd">
              <div class="tb tb2">小计</div>
              <div class="tb tb3"></div>
              <div class="tb tb2" style="text-align: right">{{tableData.borrower ? formatMoney(tableData.borrower, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: right">{{tableData.lender ? formatMoney(tableData.lender, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: center"></div>
              <div class="tb tb2" style="text-align: right"></div>
            </li>

            <li style="background: #fdf2bd">
              <div class="tb tb2">合计</div>
              <div class="tb tb3"></div>
              <div class="tb tb2" style="text-align: right">{{tableData.borrower ? formatMoney(tableData.borrower, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: right">{{tableData.lender ? formatMoney(tableData.lender, '', 2) : ''}}</div>
              <div class="tb tb2" style="text-align: center"></div>
              <div class="tb tb2" style="text-align: right"></div>
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
import { abstractQuery } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
import NP from 'number-precision'
export default {
  name: 'abstractIndex',
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
        post: false,
        time: [null, null],
        abstract: ''
      },
      tableData: {
        list: [],
        borrower: 0,
        lender: 0
      },
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
          this.search.time = [null, null]
          // this.load()
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
      abstractQuery(this.search).then(res => {
        let list = []
        let borrower = 0
        let lender = 0
        res.data.credentials.forEach(v => {
          v.child.forEach(c => {
            if (c.abstract.includes(this.search.abstract)) {
              if (c.borrower) borrower = NP.plus(borrower, c.borrower)
              if (c.lender) lender = NP.plus(lender, c.lender)
              list.push({
                ...c,
                accountingPeriod: v.accountingPeriod,
                direction: res.data.subject.find(f => f.code === c.subjectCode).balance
              })
            }
          })
        })
        this.tableData = {
          list,
          borrower,
          lender
        }
      }).catch(err => {
        this.$Modal.error({
          title: '摘要汇总表',
          content: err.message
        })
      })
    },
    goDetail (v) {
      this.$router.push({
        name: 'credentialsSubjectIndex',
        query: {
          accountSetId: this.accountSet._id,
          subjectCode: v.subjectCode,
          subject: v.subject,
          accountingPeriod: v.accountingPeriod
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
