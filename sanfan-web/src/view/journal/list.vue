<template>
  <Card :title="cardTitle">
    <Card>
      <Row :gutter="20">
        <Col v-if="page === 'manager'"
             span="6">
        <employee-selector :multiple="false"
                           range="directlyEmployee"
                           @change="changeEmpolyee" />
        </Col>
        <Col span="4">
        <Select v-model="range"
                placeholder="时间范围">
          <Option :value="3">最近三天</Option>
          <Option :value="7">最近一周</Option>
          <Option :value="30">最近一月</Option>
          <Option :value="1100">全部</Option>
        </Select>
        </Col>
        <Col span="4">
        <DatePicker v-model="qCreateTime"
                    :options="dateOptiopn"
                    type="date"
                    placeholder="筛选日期"
                    @on-change="changeDate"></DatePicker>
        </Col>
        <Col span="4">
        <Select v-model="dailyStatus"
                placeholder="状态选择">
          <Option value="ALL">全部</Option>
          <Option value="UNREAD">未读</Option>
          <Option value="PASS">已确认</Option>
          <Option value="NOPASS">已驳回</Option>
          <Option value="READ">已读</Option>
        </Select>

        </Col>
      </Row>
    </Card>
    <Card>
      <div class="journal-list">
        <jouranl-card v-for="item in filterList"
                      :key="item.id"
                      v-bind="item"
                      @detail="showDetail"></jouranl-card>
      </div>
      <div v-if="!filterList.length">没有相关数据</div>
    </Card>

    <Modal v-model="isShowDetail"
           width="660"
           height="400">
      <p slot="header">{{journalShow.createName}} {{ journalShow.createdFormat }} 的 {{journalShow.typeStr}}</p>
      <journalaudit :journalID="journalShow.id"
                    @stateChange="stateChange"></journalaudit>
    </Modal>
  </Card>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'dayjs'
import JouranlCard from './components/journal-card.vue'
import EmployeeSelector from '_c/employees/selector.vue'
import journalaudit from './audit.vue'
import { getManagerDailyList, getMyDailyList, searchDailyList } from '@/api/daily'

const MILLISECONDS_ONE_DAY = 24 * 3600 * 1000
const TODAY = new Date().setHours(0, 0, 0, 0)

const DAILYTYPES = {
  'DAILY': '日报', 'WEEKLY': '周报', 'MONTHLY': '月报'
}

export default {
  name: 'journallist',
  components: {
    JouranlCard,
    EmployeeSelector,
    journalaudit
  },
  data () {
    return {
      journalList: [],
      dateLimit: [],
      page: '',
      range: 3,
      dailyStatus: 'ALL',
      filters: {},
      qCreateTime: '',
      queryAction: getMyDailyList,
      dateOptiopn: {
        disabledDate (date) {
          return date && date.valueOf() > moment().endOf('day')
        }
      },
      isShowDetail: false,
      journalShow: {
        id: ''
      }
    }
  },
  methods: {
    initRouter () {
      // 对路由变化作出响应...
      this.page = this.$route.meta.page
      console.log('Page : %s', this.page)

      // 先清空筛选
      delete this.filters.createId
      delete this.filters.qCreateTime

      if (this.page === 'manager') {
        this.queryAction = getManagerDailyList
      } else if (this.page === 'self') {
        this.queryAction = getMyDailyList
      }

      this.initPage()
    },

    initPage () {
      this.$Loading.start()
      this.queryAction(this.filters).then(res => {
        this.$Loading.finish()
        this.journalList = res.data
      }).catch(err => {
        console.error(err)
        this.$Loading.error()
        this.$Message.error('获取记录失败，请稍后再试')
      })
    },

    // 只有【员工日报】才有筛选
    // 【我的日报】是没筛选
    changeEmpolyee (value) {
      this.queryAction = searchDailyList
      if (!value) {
        delete this.filters.createId
        if (this.page === 'manager') {
          this.queryAction = getManagerDailyList
        } else if (this.page === 'self') {
          this.queryAction = getMyDailyList
        }
      } else {
        this.filters.createId = value
      }
      this.initPage()
    },
    changeDate (value) {
      this.queryAction = searchDailyList
      if (!value) {
        delete this.filters.qCreateTime
      } else {
        this.filters.qCreateTime = value
      }
      this.initPage()
    },
    showDetail (journal) {
      console.log('Detail : ', journal)
      this.journalShow = journal
      this.journalShow.createdFormat = moment(journal.qCreateTime).format('M月D日HH时')
      this.journalShow.typeStr = DAILYTYPES[journal.dailyType]
      this.isShowDetail = true
    },
    stateChange (id, status, comment) {
      this.journalList.forEach(j => {
        if (j.id === id) {
          j.dailyStatus = status
          j.comment = comment
        }
      })
    }
  },
  computed: {
    ...mapGetters([]),
    cardTitle () {
      return this.page === 'manager' ? '员工日报' : '我的日报'
    },

    filterList () {
      let stateList = this.dailyStatus === 'ALL' ? this.journalList : this.journalList.filter(j => j.dailyStatus === this.dailyStatus)
      if (this.qCreateTime) return stateList
      let createdBefore = TODAY - this.range * MILLISECONDS_ONE_DAY
      console.log('create Before ', createdBefore)
      return stateList.filter(j => Date.parse(j.createTime) > createdBefore)
    }

  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.initRouter())
  },
  beforeRouteUpdate (to, from, next) {
    this.initRouter()
    next()
  }
}

</script>
<style lang="less" scoped>
.journal-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  min-width: 900px;

  .journal-block {
    margin: 5px;
  }
}
</style>
