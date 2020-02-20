<template>
  <div>
    <Card>
      <div slot="title">
        <DatePicker v-model="filters.date"
                    @on-change="initPage"
                    placeholder="请选择日期" />
      </div>

      <Spin v-if="spinShow"
            size="large"
            fix />

      <Row>
        <!-- ============== 左侧 ================== -->
        <Col span="6">
        <i-circle :size="180"
                  :trail-width="5"
                  :stroke-width="5"
                  :percent="percent"
                  stroke-linecap="square"
                  stroke-color="#19be6b"
                  trail-color="#ff9900"
                  class="circle-ring">
          <div class="circle-data">
            <div class="circle-info">
              <Icon color="#19be6b"
                    type="ios-square" /> 正常
              <count-to :end="normal" /> 人
            </div>
            <div class="circle-info">
              <Icon color="#ff9900"
                    type="ios-square" /> 异常
              <count-to :end="unnormal" /> 人
            </div>
          </div>
        </i-circle>
        <div>&nbsp;</div>
        <div class="data-items">
          <div @click="checkList('LATE')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 迟到 </Col>
              <Col span="4"> {{countData.LATE || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>
          <div @click="checkList('EARLY')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 早退 </Col>
              <Col span="4"> {{countData.EARLY || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>
          <div @click="checkList('MISSING')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 缺卡 </Col>
              <Col span="4"> {{countData.MISSING || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>
          <div @click="checkList('OUT')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 外出 </Col>
              <Col span="4"> {{countData.OUT || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>
          <div @click="approvalList('LEAVE')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 请假 </Col>
              <Col span="4"> {{countData.LEAVE || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>
          <div @click="approvalList('BUSINESS_TRAVEL')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 出差 </Col>
              <Col span="4"> {{countData.BUSINESS_TRAVEL || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>
          <div @click="approvalList('OVERTIME')"
               class="data-item">
            <Row :gutter="16">
              <Col span="4"> 加班 </Col>
              <Col span="4"> {{countData.OVERTIME || 0}} </Col>
              <Col span="1"> 人 </Col>
              <Col offset="12"
                   span="1">
              <Icon type="ios-arrow-forward"
                    color="#c5c8ce" />
              </Col>
            </Row>
            <Divider class="data-item-divider" />
          </div>

        </div>
        </Col>
        <Col span="18">
        <!-- =================== 右侧 ==================== -->
        <div v-show="showRight === 'CHECK'">
          <h2 v-show="!rightList.CHECK.length"> 暂无相关数据 </h2>

          <a v-for="item in rightList.CHECK"
             :key="item.id"
             class="check_name"
             href="javascript:void(0)"
             @click="showTimerecord(item.id)">{{item.name}}</a>

          <!-- <a class="check_name"
             href="javascript:void(0)"
             @click="showTimerecord('402880086951e719016951ec68390000')">FFFFF</a> -->

          <Modal v-model="checkModal"
                 :closable="false"
                 width="900">
            <Timerecord :qdate="checkDate"
                        :qid="checkId" />
          </Modal>

        </div>
        <div v-show="showRight === 'LEAVE'">
          <Table :columns="rightCols.LEAVE"
                 :data="rightList.LEAVE" />
        </div>
        <div v-show="showRight === 'BUSINESS_TRAVEL'">
          <Table :columns="rightCols.BUSINESS_TRAVEL"
                 :data="rightList.BUSINESS_TRAVEL" />
        </div>
        <div v-show="showRight === 'OVERTIME'">
          <Table :columns="rightCols.OVERTIME"
                 :data="rightList.OVERTIME" />
        </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CountTo from '_c/count-to'
import Timerecord from './timerecord/list.vue'
import { statistics, statisticsByCheck, statisticsByApproval } from '@/api/attendance'

export default {
  name: 'ApprovalStatistic',
  components: {
    CountTo,
    Timerecord
  },
  props: {},
  data () {
    return {
      spinShow: false,
      DATA_TYPES: {
        BUSINESS_TRAVEL: '出差',
        LATE: '迟到',
        EARLY: '早退',
        LEAVE: '请假',
        ABNORMAL: '异常',
        MISSING: '漏卡',
        OVERTIME: '加班',
        NORMAL: '正常',
        OUT: '外出'
      },
      percent: 1,
      unnormal: 0,
      normal: 1,
      filters: {
        type: 'REPORTUSER',
        date: new Date().toHawkDateString(),
        qCreateTime: ''
      },
      countData: {
        BUSINESS_TRAVEL: 0,
        LATE: 0,
        EARLY: 0,
        LEAVE: 0,
        ABNORMAL: 0,
        MISSING: 0,
        OVERTIME: 0,
        NORMAL: 0,
        OUT: 0
      },
      showRight: '',
      rightList: {
        CHECK: [],
        LEAVE: [],
        BUSINESS_TRAVEL: [],
        OVERTIME: []
      },
      rightCols: {
        LEAVE: [
          { title: '申请人', key: 'createName' },
          { title: '申请时间', key: 'createTime' },
          { title: '请假类型', key: 'leaveName' },
          { title: '时间起', key: 'startTime' },
          { title: '时间止', key: 'endTime' },
          { title: '时间长(天)', key: 'duration' },
          { title: '申请原因', key: 'cause' }
        ],
        BUSINESS_TRAVEL: [
          { title: '申请人', key: 'createName' },
          { title: '申请时间', key: 'createTime' },
          { title: '时间起', key: 'startTime' },
          { title: '时间止', key: 'endTime' },
          { title: '时间长(天)', key: 'duration' },
          { title: '地点', key: 'site' },
          { title: '申请原因', key: 'cause' }
        ],
        OVERTIME: [
          { title: '申请人', key: 'createName' },
          { title: '申请时间', key: 'createTime' },
          { title: '时间起', key: 'startTime' },
          { title: '时间止', key: 'endTime' },
          { title: '时间长(小时)', key: 'duration' },
          { title: '申请原因', key: 'cause' }
        ]
      },
      checkModal: false,
      checkId: '',
      checkDate: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    async initPage () {
      // let [dt1, dt2, dt3] =
      // await Promise.all([statistics(), statisticsByApproval(sauceType), statisticsByCheck()])
      this.spinShow = true

      this.filters.qCreateTime = new Date(this.filters.date).toHawkDateString()
      let rst = await statistics(this.filters)

      this.spinShow = false
      if (!rst) return this.$Message.error('获取数据失败')

      this.countData = rst.data

      // for (const k in this.countData) {
      //   if (k === 'NOURMAL') {
      //     this.normal = this.countData[k]
      //   } else {
      //     this.unnormal += this.countData[k]
      //   }
      // }
      this.normal = this.countData.NORMAL || 0
      this.unnormal = this.countData.ABNORMAL || 0

      this.percent = Math.round(this.normal / (this.normal + this.unnormal) * 100)
    },
    async checkList (attendanceStatus) {
      this.spinShow = true

      let flt = {
        type: this.filters.type,
        qCreateTime: new Date(this.filters.date).toHawkDateString()
      }

      if (attendanceStatus === 'OUT') {
        flt.attendanceType = 'OUT'
      } else {
        flt.attendanceStatus = attendanceStatus
      }

      try {
        let rst = await statisticsByCheck(flt)

        this.showRight = 'CHECK'

        if (!rst.data) {
          this.rightList.CHECK = []
          return
        }

        this.rightList.CHECK = rst.data
      } catch (err) {
        console.error('in statisticsByCheck', err)
      } finally {
        this.spinShow = false
      }
    },
    async approvalList (applicationType) {
      this.spinShow = true

      try {
        let rst = await statisticsByApproval({
          type: this.filters.type,
          qCreateTime: new Date(this.filters.date).toHawkDateString(),
          applicationType: applicationType
        })

        this.showRight = applicationType

        if (!rst.data) {
          this.rightList[applicationType] = []
          return
        }

        this.rightList[applicationType] = rst.data
      } catch (err) {
        console.error('in statisticsByApproval', err)
      } finally {
        this.spinShow = false
      }
    },
    showTimerecord (id) {
      this.checkDate = new Date(this.filters.date).toHawkDateString()
      this.checkId = id
      this.checkModal = true
    }
  },
  mounted () {
    if (['ADMINISTRATION', 'DEPARTMENT', 'SUPERADMIN'].includes(this.getUserInfo.role)) {
      this.filters.type = this.getUserInfo.role
    } else {
      this.filters.type = 'REPORTUSER'
    }
    this.initPage()
  }
}
</script>
<style lang="less" scoped>
.circle-ring {
  margin-top: 30px;
  .circle-data {
    .circle-info {
      display: flex;
      justify-content: center;
      i {
        margin-right: 0.5em;
      }
      .count-to-wrapper {
        margin: auto 0.5em;
      }
    }
  }
}
.data-items {
  height: 300px;

  .data-item {
    margin: 4px 20px 20px 0;
    width: 300px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;

    .data-item-divider {
      margin: 12px auto 0 auto;
    }
  }
}

.check_name {
  display: inline-block;
  margin-right: 2em;
}
</style>
