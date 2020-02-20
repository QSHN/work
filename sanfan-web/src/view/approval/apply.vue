<template>
  <Card>
    <Tabs v-model="tabname"
          @on-click="changeTab">
      <TabPane label="请假申请"
               name="LEAVE">
        <LeaveApply />
      </TabPane>
      <TabPane label="出差申请"
               name="BUSINESS_TRAVEL">
        <TravelApply />
      </TabPane>
      <TabPane label="加班申请"
               name="OVERTIME">
        <OvertimeApply />
      </TabPane>
    </Tabs>
  </Card>
</template>
<script>
import { mapActions } from 'vuex'
import OvertimeApply from './overtime/apply.vue'
import LeaveApply from './leave/apply.vue'
import TravelApply from './travel/apply.vue'

import { APPLICATION_TYPE } from './apply.consts'

export default {
  name: 'AttendaceApply',
  components: {
    OvertimeApply,
    LeaveApply,
    TravelApply
  },
  data () {
    return {
      APPLICATION_TYPE: APPLICATION_TYPE,
      tabname: 'LEAVE'
    }
  },
  methods: {
    ...mapActions([
      'changeApplyActionType'
    ]),

    changeTab (name) {
      if (this.APPLICATION_TYPE[name]) {
        this.changeApplyActionType(name)
      }
    }
  },
  mounted () {
    this.changeTab(this.tabname)
  }

}
</script>
<style lang="less">
@import "./form.less";
</style>
