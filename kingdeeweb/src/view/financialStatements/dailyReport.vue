<template>
  <div>
    <Row style="line-height: 30px; font-size: 18px;">
      日报表
    </Row>

    <Card shadow style="margin: 10px 0;">
      <Row type="flex">
        <div style="display: flex;">
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
          <div class="tb">科目编码</div>
          <div class="tb tb2">科目名称</div>
          <div class="tb tb2">上日余额</div>
          <div class="tb tb2">本日借方发生额</div>
          <div class="tb tb2">本日贷方发生额</div>
          <div class="tb tb2">本日余额</div>
          <div class="tb">借方笔数</div>
          <div class="tb">贷方笔数</div>
        </div>

        <div class="t_c">
          <ul>
            <li v-for="(v, i) in tableData"
                :key="i"
                :style="{background: ['#f8f8f9', '#d8f7f1', '#c9e1fc', '#a3cdfb'][v.parentId.length]}"
                :class="{active: i === which}"
                @click="which = i">
              <div class="tb">{{v.code}}</div>
              <div class="tb tb2">{{v.name}}</div>
              <div class="tb tb2">
                <span>{{getDirection(v.lastBalance, v.direction)}}</span>
                <p style="text-align: right">{{v.lastBalance ? formatMoney(v.lastBalance, '', 2) : ''}}</p>
              </div>
              <div class="tb tb2">{{v.borrower ? formatMoney(v.borrower, '', 2) : ''}}</div>
              <div class="tb tb2">{{v.lender ? formatMoney(v.lender, '', 2) : ''}}</div>
              <div class="tb tb2">
                <span>{{getDirection(v.balance, v.direction)}}</span>
                <p style="text-align: right">{{v.balance ? formatMoney(v.balance, '', 2) : ''}}</p>
              </div>
              <div class="tb">{{v.borrowerNumber || ''}}</div>
              <div class="tb">{{v.lenderNumber || ''}}</div>
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
import { dailyReport } from '../../api/credentials'
import { formatMoney } from 'accounting'
import { querySubject } from '../../api/subject'
import moment from 'moment'
import selectSubject from '../../components/subject/index'
export default {
  name: 'dailyReportIndex',
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
        time: null
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
          this.search.time = [new Date(), new Date()]
          this.load()
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
      dailyReport(this.search).then(res => {
        this.tableData = res.data
      }).catch(err => {
        this.$Modal.error({
          title: '日报表',
          content: err.message
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
          background: #000 !important;
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
