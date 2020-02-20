<template>
  <div class="page_daily">
    <Row>
      <Alert type="warning" show-icon style="float: left" v-if="journalTemplate">
        日报开始提交时间：
        <span v-if="journalTemplate.dailyStatus">
          日报：
          {{journalTemplate.days.reduce((total, v) => total += (total ? '、' : '') + daysOfWeek.displays[v - 1], '')}}
          （{{journalTemplate && journalTemplate.startTime || '18'}}:00  -
          {{journalTemplate && journalTemplate.endTime ||'24'}}:00）
        </span>

        <span v-if="journalTemplate.weeklyStatus" style="margin-left: 20px;">
          周报：
          {{journalTemplate.weeklyStartDate}} {{journalTemplate.weeklyStartTime}}:00 至
          {{journalTemplate.weeklyEndDate}} {{journalTemplate.weeklyEndTime}}:00
        </span>

        <span v-if="journalTemplate.monthlyStatus" style="margin-left: 20px;">
          月报：
          {{journalTemplate.monthlyStartDate}} 号 {{journalTemplate.monthlyStartTime}}:00 至
          {{journalTemplate.monthlyEndDate}} 号 {{journalTemplate.monthlyEndTime}}:00
        </span>
      </Alert>
    </Row>

    <Table border :columns="columns" :data="tableData" :loading="loading"></Table>
  </div>
</template>

<script>
import { dailySetting } from '@/api/dailySetting'
import { getMyDailyList } from '@/api/daily'
import { mapGetters } from 'vuex'
import { daysOfWeek } from '@/libs/select'
import moment from 'moment'
export default {
  name: 'daily',
  data () {
    return {
      daysOfWeek,
      loading: true,
      columns: [
        {
          title: '类型',
          render: (h, params) => {
            let type = params.row.dailyType
            return h('span', type === 'DAILY' ? '日报' : type === 'WEEKLY' ? '周报' : '月报')
          }
        },
        {
          title: '内容',
          key: 'content'
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('span', moment(params.row.createTime).format('hh:mm:ss'))
          }
        },
        {
          title: '状态',
          render: (h, params) => {
            let status = ''
            switch (params.row.dailyStatus) {
              case 'READ': status = '已读'
                break
              case 'PASS': status = '已通过'
                break
              case 'NOPASS': status = '已驳回，需要重新提交'
                break
              default: status = '已提交，待上级审批'
                break
            }
            return h('span', status)
          }
        }
      ],
      tableData: [],
      journalTemplate: null
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  },
  methods: {
  },
  created () {
    dailySetting().then(res => {
      this.journalTemplate = res.data

      getMyDailyList().then(res => {
        if (res.data) {
          this.tableData = res.data
          this.$emit('updateCount', 1, res.data.length)
        }
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
}
</script>

<style scoped>

</style>
