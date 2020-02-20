<template >
  <div class="apply-form">
    <Spin v-if="spinShow"
          size="large"
          fix />
    <div class="apply-form-card">
      <Form ref="apply"
            :model="apply"
            :rules="rule"
            :label-width="80">

        <FormItem label="开始时间:"
                  prop="startTime">
          {{dateApmStr(apply.startTime)}}
        </FormItem>

        <FormItem label="结束时间:"
                  prop="endTime">
          {{dateApmStr(apply.endTime)}}
        </FormItem>

        <FormItem label="加班时长:"
                  prop="duration">
          {{apply.duration}} 小时
        </FormItem>
      </Form>

      <workflow ref="workflow"
                typeStr="加班"
                :readonlyAll="true"
                :initApply="apply" />
      <Form :label-width="80">
        <FormItem label="">
          <template v-if="approvalActionType === 'approvalManagerList' && apply.applicationStatus === 'UNAUDITED'">
            <Button type="error"
                    size="large"
                    @click="overruled">驳回</Button>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Button type="success"
                    size="large"
                    @click="agreement">通过</Button>
          </template>
          <template v-if="approvalActionType === 'myApprovalList' && apply.withdraw === false">
            <Button type="warning"
                    size="large"
                    @click="withdraw">撤销</Button>
          </template>

        </FormItem>
      </Form>

    </div>
  </div>
</template>
<script>
import workflow from '../workflow.vue'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../apply.mixin'

export default {
  name: 'OvertimeAudit',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    workflow
  }
}
</script>
