<template>
  <div class="user-manage-container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style lang="scss" scoped>
  .user-manage {
    &-container {
      margin: 30px;
    }
  }
</style>
