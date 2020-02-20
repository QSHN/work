<template>
  <card style="width: 100%; height: 100%">
    <Row type="flex" justify="space-between" style="margin-bottom: 10px">
      <Col span="6">
        <Button type="primary" icon="md-add" @click="$refs.submitRData.show()" v-if="isAdd">提交汇报</Button>
      </Col>
      <Col span="12">
        <Alert type="warning" show-icon v-if="reportTemplate" style="text-align: center">
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
      </Col>
      <Col span="6">
      </Col>
    </Row>
    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
    <submitRData ref="submitRData" :reportTemplate="reportTemplate" @update="getReport" />

    <Row type="flex" justify="end" style="margin-top: 15px">
      <Page :total="total" :current="pageNum" :page-size="pageSize" @on-change="(page) => pageNum = page" />
    </Row>
  </card>
</template>

<script>
import { getReportTemp, getReportData, recallReport } from '@/api/report.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
import submitRData from './components/submitRData'
import {
  daysOfWeek,
  daysOfMonth,
  times
} from '@/libs/select.js'
export default {
  name: 'submitReport',
  components: {
    submitRData
  },
  data () {
    return {
      daysOfWeek,
      daysOfMonth,
      times,
      loading: true,
      reportTemplate: null,
      columns: [],
      tableData: [],
      isAdd: true,
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
  methods: {
    getReport () {
      getReportData({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        console.log('getReportData', res.data)
        if (!res.data) return
        this.tableData = res.data.list
        this.total = res.data.total
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
  watch: {
    tableData () {
      this.tableData.map(v => {
        if (moment(v.createdAt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
          this.isAdd = false
        }
      })
    },
    pageNum () {
      this.getReport()
    }
  },
  mounted () {
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
        cList.push({
          title: '操作',
          width: '100',
          align: 'center',
          render: (h, params) => {
            let isShow = this.tableData[params.index] && moment(this.tableData[params.index].createdAt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
            let status = this.tableData[params.index] && this.tableData[params.index].status
            let val = status !== 'CONFIRM' ? status === 'REJECT' || status === 'WITHDRAW' || status === 'RECALL' ? '提交' : '撤回' : '无法撤回'
            return h('span', [
              h('Button', {
                props: {
                  type: val === '撤回' ? 'error' : 'primary',
                  size: 'small',
                  disabled: status === '已确认'
                },
                style: {
                  marginRight: '8px',
                  width: '64px',
                  display: isShow ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    let self = this
                    if (val === '撤回') {
                      self.$Modal.error({
                        title: '撤回该汇报',
                        content: '您确定撤回该汇报吗？',
                        onOk () {
                          let sendData = self.tableData[params.index]
                          recallReport(sendData.id).then((res) => {
                            self.getReport()
                          }).catch((err) => {
                            if (err.errorMsg) {
                              self.$Notice.error({
                                title: '错误提示',
                                desc: err.errorMsg
                              })
                            }
                          })
                        }
                      })
                    } else if (val === '提交') {
                      this.$refs.submitRData.show(this.tableData[params.index])
                    }
                  }
                }
              }, val)
            ])
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
