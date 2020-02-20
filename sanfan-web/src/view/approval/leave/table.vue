<template>
  <div ref="applicationTable">
    <!-- showList 是个Object,所以要用 showList.showList -->
    <Table border
           width="1400"
           height="600"
           no-data-text="没有符合的记录"
           @on-row-click="showDetail"
           :columns="columns"
           :data="showList.showList">
      <template slot-scope="{ row }"
                slot="leaveType">{{ leaveTypes[row.leaveType] || ''}}</template>
    </Table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../table.mixin'

export default {
  name: 'LeaveTable',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!

  computed: {
    ...mapGetters(['leaveTypes'])
  },
  methods: {
    ...mapActions(['initLeaveType'])
  },
  async created () {
    await this.initLeaveType()
    this.columns = this.columns.concat(this.defaultColumns)
    this.columns.splice(1, 0, { title: '请假类型', slot: 'leaveType', width: 100 })
  }
}
</script>
