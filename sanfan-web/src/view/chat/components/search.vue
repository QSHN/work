<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <input type="text"
             class="searchInput"
             v-model="search"
             @keyup="change"
             placeholder="搜索">
      <Icon class="icon-search"
            type="ios-search"
            v-show="noText" />
      <Icon class="icon-search"
            type="ios-close-circle-outline"
            v-show="haveText"
            @click="del" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      active: false
    }
  },
  methods: {
    change () {
      this.$store.dispatch('IM_SEARCH', this.search)
    },
    del () {
      this.search = ''
      this.change()
    }
  },
  computed: {
    noText () {
      if (this.search === '') return true
      return false
    },
    haveText () {
      if (this.search === '') return false
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  padding: 22px 12px 12px 12px;

  .search-wrapper {
    position: relative;
    display: flex;
    box-sizing: border-box;
    height: 26px;
    width: 100%;
    background-color: #e5e3e2;
    border: 1px solid #d9d7d6;
    border-radius: 2px;

    .searchInput {
      margin: 0;
      padding: 0;
      border: 0;
      font-weight: normal;
      vertical-align: baseline;

      flex: 1;
      font-size: 12px;
      padding: 6px;
      background-color: #e5e3e2;
      outline: none;
      &:focus {
        background-color: #f2efee;
      }
    }
    .icon-search {
      display: inline-block;
      width: 24px;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      text-align: center;

      cursor: pointer;
    }
  }
}
</style>
