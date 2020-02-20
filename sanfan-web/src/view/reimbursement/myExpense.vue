<template>
  <Card>
    <Expense :data="list" add-fn="true" @update="load"></Expense>
  </Card>
</template>

<script>
import Expense from './expense'
import { getMine } from '../../api/reimbursement'
export default {
  name: 'myExpense',
  components: {
    Expense
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      getMine().then(res => {
        this.list = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
