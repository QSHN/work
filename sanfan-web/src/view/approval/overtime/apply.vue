<template >
  <div class="apply-form">
    <Spin v-if="spinShow"
          size="large"
          fix />
    <Card :title="'加班申请'"
          class="apply-form-card">
      <Form ref="apply"
            :model="apply"
            :rules="rule"
            :label-width="80">

        <FormItem label="开始时间:"
                  prop="startTime">
          <DatePicker type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="请选择时间"
                      v-model="apply.startTime"
                      class="time-date"
                      @on-change="calDuration" />
        </FormItem>

        <FormItem label="结束时间:"
                  prop="endTime">
          <DatePicker type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="请选择时间"
                      v-model="apply.endTime"
                      class="time-date"
                      @on-change="calDuration" />
        </FormItem>

        <FormItem label="加班时长:"
                  prop="duration">
          {{apply.duration}} 小时
        </FormItem>

      </Form>

      <workflow ref="workflow"
                typeStr="加班"
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
import workflow from '../workflow.vue'
// !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
import mixin from '../apply.mixin'

export default {
  name: 'OvertimeApply',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    workflow
  },
  data () {
    return {
      rule: {
      }
    }
  },
  methods: {
  }
}
</script>
