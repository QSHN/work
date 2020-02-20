<template>
  <div class="content">
    <div class="friend-wrapper">
      <search></search>
      <friendlist></friendlist>
    </div>
    <div class="friend-info">
      <info></info>
    </div>
  </div>
</template>

<script>
import search from './components/search.vue'
import friendlist from './components/friendlist.vue'
import info from './components/info.vue'
export default {
  name: 'Friend',
  components: {
    search,
    friendlist,
    info
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  width: 800px;
  height: 100%;

  .friend-wrapper {
    width: 250px;
    background: rgb(230, 230, 230);
  }

  .friend-info {
    flex: 1;
  }
}
</style>
