<template>
  <client-table :classify="'客户'" />
</template>

<script>
import clientTable from './components/clientTable'
export default {
  name: 'client',
  components: { clientTable },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
