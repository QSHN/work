<template>
  <div>
    <Row>
      <Alert type="warning" show-icon style="float: left" v-if="reportTemplate">
        <template v-if="reportTemplate.period == 'DAY'">
          提交时间：{{reportTemplate.days.reduce((value, v, i) => value += (value ? '，' : '') + daysOfWeek.displays[(v - 1).toString()], '')}}
          （{{times.displays[reportTemplate.startTime.toString()]}} - {{times.displays[reportTemplate.endTime.toString()]}}）
        </template>
        <template v-else-if="reportTemplate.period == 'WEEK'">
          开始提交时间：{{daysOfWeek.displays[(reportTemplate.startDate - 1).toString()]}}  {{times.displays[reportTemplate.startTime.toString()]}},
          截止时间：{{daysOfWeek.displays[(reportTemplate.endDate - 1).toString()]}}  {{times.displays[reportTemplate.startTime.toString()]}},
        </template>
        <template v-else>
          开始提交时间：{{daysOfMonth.displays[(reportTemplate.startDate - 1).toString()]}}  {{times.displays[reportTemplate.startTime.toString()]}},
          截止时间：{{daysOfMonth.displays[(reportTemplate.endDate - 1).toString()]}}  {{times.displays[reportTemplate.startTime.toString()]}},
        </template>
      </Alert>
    </Row>

    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
    <Row type="flex" justify="end" style="margin-top: 15px" v-if="total > 10">
      <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="(page) => pageNum = page" />
    </Row>
  </div>
</template>

<script>
import { getReportTemp, getReportData } from '@/api/report.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
import {
  daysOfWeek,
  daysOfMonth,
  times
} from '@/libs/select.js'
export default {
  name: 'report',
  data () {
    return {
      daysOfWeek,
      daysOfMonth,
      times,
      loading: true,
      reportTemplate: null,
      columns: [],
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  watch: {
    pageNum () {
      this.getReport()
    }
  },
  methods: {
    getReport () {
      getReportData({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchStartDate: moment().format('YYYY-MM-DD'),
        searchEndDate: moment().format('YYYY-MM-DD')
      }).then((res) => {
        console.log('getReportData', res.data)
        if (!res.data) return
        this.tableData = res.data.list
        this.total = res.data.total
        this.$emit('updateCount', 2, res.data.total)
        this.loading = false
      }).catch((err) => {
        if (err.errorMsg) {
          this.$Notice.error({
            title: '错误提示',
            desc: err.errorMsg
          })
          this.loading = false
        }
      })
    }
  },
  created () {
    let departmentId = this.getUserInfo.role === 'SUPERADMIN' ? '' : this.getUserInfo.departmentId
    if (!departmentId) return
    this.tableData = []
    getReportTemp(departmentId).then((res) => {
      console.log('getReportTemp', res.data)
      if (res.data) {
        this.reportTemplate = res.data
        let cList = []
        res.data.items.forEach((v, i) => {
          cList.push({
            title: `${v.name}（${v.unit}）`,
            render: (h, params) => {
              let val = this.tableData[params.index] && this.tableData[params.index].items[i].value
              return h('span', val || '')
            }
          })
        })
        cList.push({
          title: '创建时间',
          render: (h, params) => {
            let time = this.tableData[params.index] && this.tableData[params.index].createTime
            return h('span', time && moment(time).format('YYYY-MM-DD HH:MM:SS'))
          }
        })
        cList.push({
          title: '状态',
          render: (h, params) => {
            let status = this.tableData[params.index] && this.tableData[params.index].status
            let val = ''
            switch (status) {
              case 'CONFIRM': val = '已完成'
                break
              case 'REJECT': val = '已驳回，需重新提交'
                break
              case 'WITHDRAW': val = '已撤回，需要重新提交'
                break
              case 'UNREAD':
              case 'READ': val = '已提交，待上级审批'
                break
              default: val = '未提交'
                break
            }
            return h('span', val)
          }
        })
        this.columns = cList
        this.getReport()
      } else {
        this.loading = false
      }
    }).catch((err) => {
      if (err.errorMsg) {
        this.$Notice.error({
          title: '错误提示',
          desc: err.errorMsg
        })
      }
    })
  }
}
</script>

<style scoped>

</style>
