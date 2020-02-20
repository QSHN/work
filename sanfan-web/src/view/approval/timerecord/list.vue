<template>
  <div class="attendance-log timerecord-log">
    <Card class="attendance-filter">
      <Form :label-width="80">
        <Row :gutter="60">
          <Col span="8">
          <FormItem label="创建者:">
            <employee-selector v-model="empolyee"
                               :multiple="false"
                               :range="empolyeeRange"
                               @change="initPage"></employee-selector>
          </FormItem>
          </Col>
          <!-- <Col span="8">
          <FormItem label="时间跨度:">
            <Select v-model="range"
                    @on-change="initPage"
                    placeholder="请选择时间长度">
              <Option value="1">一天之内</Option>
              <Option value="3">三天之内</Option>
              <Option value="7">一周之内</Option>
              <Option value="30">一个月之内</Option>
            </Select>

          </FormItem>
          </Col> -->
          <Col span="8">
          <FormItem label="日期:">
            <DatePicker v-model="date"
                        @on-change="initPage"
                        placeholder="请选择日期" />
          </FormItem>
          </Col>
          <!--
          <Col span="8">
          <excel-export-button :query="downExcel"
                               :fileName="downFileName">
            <Form :label-width="80"
                  slot="filter">
              <FormItem label="创建者:">
                <employee-selector v-model="excelFilter.employees"
                                   :multiple="true"
                                   :range="empolyeeRange" />
              </FormItem>
              <FormItem label="日期跨度:">
                <DatePicker v-model="excelFilter.dateRange"
                            type="daterange"
                            split-panels
                            placeholder="请选择起止日期" />
              </FormItem>
            </Form>
          </excel-export-button>
          </Col>
           -->
        </Row>
      </Form>

    </Card>

    <Card class="attendance-list timerecord-date-list">

      <Card v-for="tr in showList"
            :key="tr.date"
            :title="tr.date"
            class="timerecord-card">
        <!-- 分组显示 -->
        <div v-for="gp in tr.groups"
             :key="gp.timeNumber"
             class="timerecord-date">
          <h3 v-if="gp.records && gp.records.length >= 1"
              class="timenumber-start">{{gp.startTime}}</h3>
          <Timeline class="timerecord-time-line">
            <TimelineItem v-for="rd in gp.records"
                          :key="rd.id"
                          @click.native="showDetail(rd)">
              <Record :record="rd" />
            </TimelineItem>
          </Timeline>
          <h3 v-if="gp.records && gp.records.length >= 2"
              class="timenumber-end">{{gp.endTime}}</h3>
        </div>
      </Card>

      <div v-if="!showList.length">
        <h2>没有符合的记录</h2>
      </div>

    </Card>

    <Modal v-model="isShowDetail"
           width="600"
           height="600">
      <h2 slot="header">
        {{rd.employeeName}} {{rd.createTime}} 打卡记录
      </h2>
      <Audit :id="rd.id"
             @stateChange="stateChange" />
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import EmployeeSelector from '_c/employees/selector.vue'
// import ExcelExportButton from '_c/excel/export-button.vue'
import Audit from './audit.vue'
import Record from './record.vue'
import { getRecord } from '@/api/attendance'

export default {
  name: 'TimerecordList',
  components: {
    EmployeeSelector,
    // ExcelExportButton,
    Audit,
    Record
  },
  props: ['qdate', 'qid'],
  data () {
    return {
      // dates: [],
      showList: [],
      date: null,
      empolyee: '',
      // range: '3',
      isShowDetail: false,
      rd: {},
      empolyeeRange: ''
      // excelFilter: {
      //   dateRange: [],
      //   employees: [],
      // }
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    qdate (val) {
      if (!val) return
      let dt = new Date(val)
      if (dt && dt.getTime()) {
        this.date = dt
      }
    },
    qid (val) {
      if (!val) return
      this.empolyee = val
      console.log('New qid: ', val)
    }
  },
  methods: {
    initPage () {
      this.$Loading.start()
      // let range = parseInt(this.range, 10)

      let self = this

      getRecord({
        'employeeId': this.empolyee,
        'qCreateTime': new Date(this.date).toHawkDateString()
      }).then(res => {
        self.$Loading.finish()
        // 先清空
        self.showList.length = 0

        if (!res.data || !res.data.length) {
          return self.$forceUpdate()
        }

        const timeStrToMinutes = t =>
          t.split(':').map((val, idx) => parseInt(val, 10) * (idx ? 1 : 60)).reduce((p, n) => p + n, 0)

        // 排序担保
        let records = res.data.sort((a, b) => {
          // 日期优先，不过目前只有一天
          const dateDiff = 0
          if (!dateDiff) return dateDiff
          // 考勤节点
          const numberDiff = parseInt(a.timeNumber) - parseInt(b.timeNumber)
          if (!numberDiff) return numberDiff
          // 规定打卡时间
          const timeDiff = timeStrToMinutes(a.timeDate) - timeStrToMinutes(b.timeDate)
          if (!timeDiff) return timeDiff
          // 真实打卡时间
          const checkDiff = new Date(a.checkInDate) - new Date(a.checkInDate)
          return checkDiff
        })

        // 分选装包
        let [tDay, cDay, iDay, tNum, cNum, iNum] = ['', '', -1, 0, 0, -1]
        for (let i = 0; i < records.length; i++) {
          cDay = new Date(records[i].startDate || records[i].createTime).toHawkDateString()
          if (tDay !== cDay) {
            iDay++
            tDay = cDay
            tNum = cNum = iNum = -1
            self.showList[iDay] = {
              date: tDay,
              groups: []
            }
          }
          cNum = records[i].timeNumber
          if (tNum !== cNum) {
            iNum++
            tNum = cNum
            self.showList[iDay].groups[iNum] = {
              timeNumber: tNum,
              startTime: new Date(records[i].startDate).toHawkTimeString().substr(0, 5),
              endTime: new Date(records[i].endDate).toHawkTimeString().substr(0, 5),
              records: []
            }
          }

          self.showList[iDay].groups[iNum].records.push(records[i])
        }
        self.$forceUpdate()
      }).catch(err => {
        console.error(err)
        self.$Loading.error()
        self.$Message.error('获取记录失败，请稍后再试')

        self.showList.length = 0
        self.$forceUpdate()
      })
    },
    showDetail (rd) {
      this.rd = rd
      this.isShowDetail = true
    },
    stateChange (status) {
      // if (!id || !status) return
      // debugger
      // for (let i = 0; i < this.showList.length; i++) {
      //   for (let j = 0; j < showList[i].groups.length; j++) {
      //     for (let k = 0; k < showList[i].groups[j].records[k].length; k++) {
      //       if (id === showList[i].groups[j].records[k].id) showList[i].groups[j].records[k].auditStatus = status
      //     }
      //   }
      // }

      this.rd.auditStatus = status
    }
    /*
    downExcel () {
      console.log('Filter %o', this.excelFilter)

      if (this.excelFilter.dateRange.length !== 2 || !this.excelFilter.employees.length) {
        this.$Message.error('请完整填写筛选条件')
        return Promise.reject(new Error('没有填参数'))
      }

      return query(this.excelFilter, true)
    },
    downFileName () {
      if (this.excelFilter.dateRange.length !== 2) return '打卡记录'
      return '打卡记录 ' + new Date(this.excelFilter.dateRange[0]).toHawkDateString() + ' 至 ' + new Date(this.excelFilter.dateRange[1]).toHawkDateString()
    }
    */
  },
  created () {
    if (this.getUserInfo.role === 'SUPERADMIN') {
      this.empolyeeRange = 'allEmployee'
    } else if (this.getUserInfo.role === 'DEPARTMENTADMIN') {
      this.empolyeeRange = 'allDepartmentEmployee'
    } else {
      // 只有自己也是调用这个
      this.empolyeeRange = 'directlyEmployee'
    }
    this.empolyee = this.getUserInfo.id

    // 不是弹窗打卡的就不直接执行
    if (!this.qid) this.initPage()
  }

}
</script>
<style lang="less">
.timerecord-log {
  .timerecord-date-list {
    background: #fafafa;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .timerecord-card {
      width: 320px;
      .ivu-card-body {
        padding-right: 0;
      }
    }
  }
}

.timerecord-time-line {
  & .ivu-timeline-item {
    padding-bottom: 4px;
  }
  & .ivu-timeline-item-head {
    top: 10px;
  }
  & .ivu-timeline-item-tail {
    top: 10px;
  }
}
.timerecord-date {
  position: relative;
  padding: 12px 0 0 12px;
  .timenumber-start,
  .timenumber-end {
    display: block;
    position: absolute;
    width: 200px;
  }

  @tnleft : -10px;
  .timenumber-start {
    top: -8px;
    left: @tnleft;
  }

  .timenumber-end {
    left: @tnleft;
    bottom: 28px;
  }
}
</style>
