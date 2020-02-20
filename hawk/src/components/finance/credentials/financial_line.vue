<template>
  <ul class="financial_line" :style="{
      color: isMinus ?  'red' : 'black',
      height: '100%',
      display: 'flex',
      listStyle: 'none',
      margin: '0',
      padding: '0'
    }">
    <li span="2"
        class="fl_col"
        v-for="(v, i) in 12"
        :key="i"
        :style="{
          width: '8.333333333333334%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '26px',
          position: 'relative'
        }">
      <span v-if="i > 0" :style="{
          position: 'absolute',
          left: '0',
          top: '0',
          bottom: '0',
          width: '1px',
          background: (i === 1 || i === 4 || i === 7) ? '#5cadff' : i === 10 ? '#ed4014' : '#dcdee2',
          overflow: 'hidden'
      }"></span>
      {{money[i]}}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'index',
  props: {
    value: {
      type: Array,
      default: Array
    }
  },
  data () {
    return {
      money: [],
      isMinus: false
    }
  },
  watch: {
    value: {
      handler () {
        let arr = Object.assign([], this.value)
        let length = this.value.length
        let isMinus = arr.includes('-')
        this.isMinus = isMinus
        if (isMinus) {
          arr.shift()
          length--
        }
        for (let i = 0; i < 12 - length; i++) {
          arr.unshift('')
        }
        this.money = arr
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<!--<style lang="less" scoped>-->
<!--.financial_line {-->
  <!--height: 100%;-->

  <!--.fl_col {-->
    <!--height: 100%;-->
    <!--border-left: 1px solid #dcdee2;-->
    <!--display: flex;-->
    <!--justify-content: center;-->
    <!--align-items: center;-->
    <!--min-height: 26px;-->

    <!--&:nth-child(1) {-->
      <!--border: none;-->
    <!--}-->

    <!--&:nth-child(2),-->
    <!--&:nth-child(5),-->
    <!--&:nth-child(8) {-->
      <!--border-color: #5cadff;-->
    <!--}-->

    <!--&:nth-child(11) {-->
      <!--border-color: #ed4014;-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</style>-->
