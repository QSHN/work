<template >
  <div class="apply-form">
    <Spin v-if="spinShow"
          size="large"
          fix />
    <Card :title="'请假申请'"
          class="apply-form-card">
      <Form ref="apply"
            :model="apply"
            :rules="rule"
            :label-width="80">

        <FormItem label="请假类型:"
                  prop="leaveType">
          <Select v-model="apply.leaveType"
                  class="time-apm"
                  placeholder="请选择请假类型">
            <Option v-for="(t, k) in leaveTypes"
                    :key="k"
                    :value="k">{{t}}</Option>
          </Select>
        </FormItem>

        <FormItem label="开始时间:"
                  prop="startTime">
          <DatePicker type="date"
                      placeholder="请选择日期"
                      v-model="apply.startTime"
                      class="time-date"
                      @on-change="calDuration" />
          <Select v-model="apply.startAPM"
                  placeholder="请选择时间"
                  class="time-apm"
                  @on-change="calDuration">
            <Option :value="0">上午</Option>
            <Option :value="12">下午</Option>
          </Select>
        </FormItem>

        <FormItem label="开始时间:"
                  prop="endTime">
          <DatePicker type="date"
                      placeholder="请选择日期"
                      v-model="apply.endTime"
                      class="time-date"
                      @on-change="calDuration" />
          <Select v-model="apply.endAPM"
                  placeholder="请选择时间"
                  class="time-apm"
                  @on-change="calDuration">
            <Option :value="12">上午</Option>
            <Option :value="24">下午</Option>
          </Select>
        </FormItem>

        <FormItem label="请假时长:"
                  prop="duration">
          {{apply.duration}} 天
        </FormItem>

      </Form>

      <workflow ref="workflow"
                typeStr="请假"
                :initApply="apply" />

      <Form :label-width="80">
        <FormItem v-if="showSubmit">
          <Button type="success"
                  size="large"
                  @click="handleSubmit">提交</Button>
        </FormItem>
        <FormItem v-if="!showSubmit">
          <Button type="warning"
                  size="large"
                  @click="handleReset">再申请</Button>
        </FormItem>
      </Form>

    </Card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import workflow from '../workflow.vue'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../apply.mixin'

export default {
  name: 'LeaveApply',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    workflow
  },
  data () {
    return {
      rule: {
        leaveType: [{ required: true, message: '请选择请假类型', trigger: 'change' }]
      }
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
