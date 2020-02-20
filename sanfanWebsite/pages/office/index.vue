<template lang="pug">
  .page_index
    FlowChart
    FloatModule

</template>

<script>
import FlowChart from '~/components/index/flowChart.vue'
import FloatModule from '~/components/modules/floatModule/floatModule.vue'
export default {
  components: {
    FlowChart,
    FloatModule
  }
}
</script>

<style lang="scss">
@import './index';
</style>
