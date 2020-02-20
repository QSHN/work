<template>
  <div v-if="row[which]">
    <template v-if="which === 'child'">
      <div v-for="(v1, i1) in row[which]" :key="'i' + i1" :style="{marginTop: i1 > 0 ? '10px' : 0}">
        <div style="line-height: 30px; overflow: hidden">
          <label style="width: 130px; display: inline-block; font-weight: bold">{{v1.name}}</label>
          <i-switch size="small" :value="v1.val" @on-change="change($event, 'financeFunction', v1.name)"></i-switch>
        </div>
        <div style="line-height: 30px; overflow: hidden" v-if="v1[which]">
          <p style="width: 20%; float: left;" v-for="(v2, i2) in v1[which]" :key="'i1' + i2">
            <label style="width: 130px; display: inline-block;">{{v2.name}}</label>
            <i-switch size="small" :value="v2.val" @on-change="change($event, 'financeFunction', v2.name)"></i-switch>
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="line-height: 30px; overflow: hidden">
        <p style="width: 20%; float: left;"  v-for="(v1, i1) in row[which]" :key="'i' + i1">
          <label style="width: 130px; display: inline-block;">{{v1.name}}</label>
          <i-switch size="small" :value="v1.val" @on-change="change($event, 'erpFunction', v1.name)"></i-switch>
        </p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'expandRow',
  props: {
    row: Object,
    change: Function,
    which: String
  }
}
</script>

<style scoped>

</style>
