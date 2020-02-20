<template>
  <div class="user-manage-container">
    <user-table :title="'客户账号'" :role="'client'" />
  </div>
</template>

<script>
import userTable from './table'
export default {
  name: 'UserManageClient',
  components: {
    userTable
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.user-manage {
  &-container {
    margin: 30px;
  }
}
</style>
