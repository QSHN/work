<template>
  <Card shadow style="height: 100%; overflow:hidden;" class="mu_card">
    <cost />
  </Card>
</template>

<script>
import cost from './main'
export default {
  name: 'index',
  components: {
    cost
  }
}
</script>

<style lang="less">
  .mu_card  .ivu-card-body {
    height: 100%;

    .mu_c {
      flex-grow: 1;
      position: relative;
      border: 1px solid #ccc;
    }

    .ivu-split-wrapper {
      position: absolute;
    }

    .ivu-split-horizontal {
      height: 100%;
    }

    .ivu-split-trigger-con {
      width: 6px;
      height: 100%;
    }
  }
</style>
