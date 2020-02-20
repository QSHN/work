<template >
  <div class="apply-form">
    <Spin v-if="spinShow"
          size="large"
          fix />
    <Card :title="'出差申请'"
          class="apply-form-card">
      <Form ref="apply"
            :model="apply"
            :rules="rule"
            :label-width="80">

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

        <FormItem label="结束时间:"
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

        <FormItem label="出差时长:"
                  prop="duration">
          {{apply.duration}} 天
        </FormItem>

        <FormItem label="出差地点:"
                  prop="site">
          <Input v-model="apply.site"
                 placeholder="请填写出差地点" />
        </FormItem>
      </Form>

      <workflow ref="workflow"
                typeStr="出差"
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
  name: 'TravelApply',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    workflow
  },
  data () {
    return {
      rule: {
        site: [{ required: true, message: '请填写地址', trigger: 'change' }]
      }
    }
  },
  methods: {
  }
}
</script>
