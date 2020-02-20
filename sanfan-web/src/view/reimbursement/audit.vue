<template>
  <Card>
    <Tabs value="name1">
      <TabPane label="待我审批" name="name1">
        <Expense :data="waitAudit" @refresh="load" type="waitAudit"></Expense>
      </TabPane>
      <TabPane label="我已审批" name="name2">
        <Expense :data="myAudit" @refresh="load" type="myAudit"></Expense>
      </TabPane>
      <TabPane label="抄送列表" name="name3">
        <Expense :data="mysender" @refresh="load" type="mysender"></Expense>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import { getApprove, getCopyToMe } from '../../api/reimbursement'
import { mapGetters } from 'vuex'
import Expense from './expense'
export default {
  name: 'audit',
  data () {
    return {
      waitAudit: [],
      myAudit: [],
      mysponsor: [],
      mysender: []
    }
  },
  components: {
    Expense
  },
  computed: {
    ...mapGetters([
      'who'
    ])
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      getApprove({ approveStatus: 'UNAPPROVED' }).then(res => {
        this.waitAudit = res.data
        this.$forceUpdate()
      })
      getApprove({ approveStatus: 'APPROVED' }).then(res => {
        this.myAudit = res.data
        this.$forceUpdate()
      })
      getCopyToMe({}).then(res => {
        this.mysender = res.data
        this.$forceUpdate()
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import "expense";
</style>
