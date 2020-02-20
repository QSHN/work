<template>
  <client-table :classify="'商家'" />
</template>

<script>
import clientTable from './components/clientTable'
export default {
  name: 'merchant',
  components: { clientTable },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
