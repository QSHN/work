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
    </Table>
  </div>
</template>
<script>
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../table.mixin'

export default {
  name: 'OvertimeTable',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  created () {
    this.columns = this.columns.concat(this.defaultColumns)
  }

}
</script>
