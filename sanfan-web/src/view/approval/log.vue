<template>
  <Tabs type="card"
        v-model="tabname"
        @on-click="changeTab">
    <!-- ===============打卡记录============= -->
    <TabPane label="打卡记录"
             name="TIMERECORD">
      <TimerecordList />
    </TabPane>

    <!-- ===============请假记录============= -->
    <TabPane label="请假记录"
             name="LEAVE">
      <ApplyList ref="LEAVE">
        <template v-slot:table="showList">
          <LeaveTable :showList="showList"
                      @showDetail="leaveDetail" />
        </template>
        <template v-slot:audit="detail">
          <LeaveAudit :id="detail.id"
                      @refresh="leaveRefresh" />
        </template>
      </ApplyList>
    </TabPane>

    <!-- ===============出差记录============= -->

    <TabPane label="出差记录"
             name="BUSINESS_TRAVEL">
      <ApplyList ref="BUSINESS_TRAVEL">
        <template v-slot:table="showList">
          <TravelTable :showList="showList"
                       @showDetail="travelDetail" />
        </template>
        <template v-slot:audit="detail">
          <TravelAudit :id="detail.id"
                       @refresh="travelRefresh" />
        </template>
      </ApplyList>
    </TabPane>

    <!-- ===============加班记录============= -->
    <TabPane label="加班记录"
             name="OVERTIME">
      <ApplyList ref="OVERTIME">
        <template v-slot:table="showList">
          <OvertimeTable :showList="showList"
                         @showDetail="overtimeDetail" />
        </template>
        <template v-slot:audit="detail">
          <OvertimeAudit :id="detail.id"
                         @refresh="overtimeRefresh" />
        </template>
      </ApplyList>
    </TabPane>
  </Tabs>
</template>
<script>
import { mapActions } from 'vuex'
import TimerecordList from './timerecord/list.vue'
import ApplyList from './list.vue'
import OvertimeTable from './overtime/table.vue'
import OvertimeAudit from './overtime/audit.vue'
import LeaveTable from './leave/table.vue'
import LeaveAudit from './leave/audit.vue'
import TravelTable from './travel/table.vue'
import TravelAudit from './travel/audit.vue'

import { APPLICATION_TYPE } from './apply.consts'

export default {
  name: 'AttendanceLog',
  components: {
    TimerecordList,
    ApplyList,
    OvertimeTable,
    OvertimeAudit,
    LeaveTable,
    LeaveAudit,
    TravelTable,
    TravelAudit
  },
  data () {
    return {
      APPLICATION_TYPE: APPLICATION_TYPE,
      tabname: 'TIMERECORD'
    }
  },
  methods: {
    ...mapActions([
      'changeApplicationActionType'
    ]),

    changeTab (name) {
      if (this.APPLICATION_TYPE[name]) {
        this.changeApplicationActionType(name)
        this.$refs[name].initPage(true)
      }
    },
    // 方法桥，找不到上抛监听方法，也不采用store的写法
    overtimeDetail (row) {
      this.$refs.OVERTIME.detail(row)
    },
    overtimeRefresh () {
      this.$refs.OVERTIME.initPage(true)
    },
    leaveDetail (row) {
      this.$refs.LEAVE.detail(row)
    },
    leaveRefresh () {
      this.$refs.LEAVE.initPage(true)
    },
    travelDetail (row) {
      this.$refs.BUSINESS_TRAVEL.detail(row)
    },
    travelRefresh () {
      this.$refs.BUSINESS_TRAVEL.initPage(true)
    }
  },
  mounted () {
    this.changeTab(this.tabname)
  }
}
</script>
<style lang="less">
</style>
