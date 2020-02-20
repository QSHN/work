<template>
  <div class="user-manage-container">
    <user-table :title="'员工账号'" :role="'company'" />
  </div>
</template>

<script>
import userTable from './table'
export default {
  name: 'UserManageCompany',
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
