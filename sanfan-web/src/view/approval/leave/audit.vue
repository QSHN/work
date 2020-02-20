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

        <FormItem label="请假类型:">
          {{leaveStr}}
        </FormItem>

        <FormItem label="开始时间:">
          {{dateApmStr(apply.startTime)}}
        </FormItem>

        <FormItem label="开始时间:">
          {{dateApmStr(apply.endTime)}}
        </FormItem>

        <FormItem label="请假时长:">
          {{apply.duration}} 天
        </FormItem>

      </Form>

      <workflow ref="workflow"
                typeStr="请假"
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
import { mapGetters, mapActions } from 'vuex'
import workflow from '../workflow.vue'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../apply.mixin'

export default {
  name: 'LeaveAudit',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    workflow
  },
  data () {
    return {
      // @ ./apply.mixin.js:154
      leaveStr: ''
    }
  },
  computed: {
    ...mapGetters(['leaveTypes'])
  },
  methods: {
    ...mapActions(['initLeaveType'])
  },
  created () {
    this.initLeaveType()
  }
}
</script>
