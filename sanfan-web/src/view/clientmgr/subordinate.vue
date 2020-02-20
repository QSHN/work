<template>
  <client-table :classify="'下属'" />
</template>

<script>
import clientTable from './components/clientTable'
export default {
  name: 'subordinate',
  components: { clientTable },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
