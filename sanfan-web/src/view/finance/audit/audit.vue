<template>
  <Card>
    <Tabs>
      <TabPane label="待我审批的" name="audit">
        <div class="title_con">待审批</div>
        <TableBase type="audit_un"></TableBase>
        <div class="title_con">已审批</div>
        <TableBase type="audit_ok"></TableBase>
      </TabPane>
      <TabPane label="我发起的" name="my">
        <div class="title_con">待审批</div>
        <TableBase type="my_un"></TableBase>
        <div class="title_con">已审批</div>
        <TableBase type="my_ok"></TableBase>
      </TabPane>
    </Tabs>
  </Card>
</template>
<style scoped>
  .page_con{
    width: 100%;
    text-align: right;
    padding-top: 10px;
    padding-bottom: 2px;
  }
  .title_con{
    margin: 10px;
    font-size: 16px;
  }
</style>
<script>
import TableBase from './table'

export default {
  name: 'audit',
  components: {
    TableBase
  },
  data () {
    return {
      auditType: '待审批',
      myType: '待审批'
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
