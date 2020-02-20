
<template>
  <div style="height:600px;">
    <Card style="height:600px;">
      <Form ref="journalTemplate"
            class="journal-form"
            :model="journalTemplate"
            :rules="rule"
            :label-width="120">

        <FormItem label="提交周期:"
                  prop="period">
          <RadioGroup v-model="period"
                      type="button"
                      size="large">
            <Radio label="day">天</Radio>
            <Radio label="week">周</Radio>
            <Radio label="month">月</Radio>
          </RadioGroup>
        </FormItem>

        <!-- ============================== period === 'day'============================= -->

        <template v-if="period === 'day'">

          <div class="journal-tag">
            <FormItem label="启用日报:">
              <i-switch v-model="journalTemplate.dailyStatus"
                        class="setting-switch"
                        size="large">
                <span slot="open">已启用</span>
                <span slot="close">未启用</span>
              </i-switch>
            </FormItem>

            <div v-show="journalTemplate.dailyStatus">
              <FormItem label="提交周期:"
                        prop="dayDays"
                        class="ivu-form-item-required">
                <Tag v-for=" (day,idx) in weekDays "
                     :key="idx"
                     color="primary"
                     checkable
                     :checked="checkDay(idx)"
                     @on-change="setDay(idx,$event)">周{{day}}</Tag>
              </FormItem>
              <FormItem label="提交时间:"
                        prop="dayTimes"
                        class="ivu-form-item-required">
                <Row :gutter="10">
                  <Col span="4">
                  <InputNumber v-model="journalTemplate.startTime"
                               :max="24"
                               :min="0" />:00
                  </Col>
                  <Col span="1">
                  <div class="time-center"> 至 </div>
                  </Col>
                  <Col span="4">
                  <InputNumber v-model="journalTemplate.endTime"
                               :max="24"
                               :min="0" />:00
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Alert>
                  每天 {{sdtStr}} :00 开始写当天的日志，
                  当天 {{edtStr}} :00 前提交为正常提交，除此之外为未交
                </Alert>
              </FormItem>

              <FormItem label="提醒员工提交:"
                        prop="isRemindOfDay">
                <i-switch v-model="journalTemplate.isRemindOfDay"
                          class="setting-switch"
                          size="large">
                  <span slot="open">提醒</span>
                  <span slot="close">不提醒</span>
                </i-switch>
              </FormItem>

              <div v-show="journalTemplate.isRemindOfDay">
                <FormItem label="提醒员工提交:"
                          prop="remindTimeOfDay">
                  截止时间前
                  <InputNumber v-model="journalTemplate.remindTimeOfDay"
                               :max="8"
                               :min="1" />
                  小时
                </FormItem>
                <FormItem label="提醒内容:"
                          prop="contentOfDay">
                  <Input v-model="journalTemplate.contentOfDay"
                         type="textarea"
                         placeholder="请填写提醒内容" />
                </FormItem>
              </div>
            </div>
          </div>
        </template>

        <!-- ============================== period === 'week'============================= -->

        <template v-else-if="period === 'week'">

          <div class="journal-tag">
            <FormItem label="启用周报:">
              <i-switch v-model="journalTemplate.weeklyStatus"
                        class="setting-switch"
                        size="large">
                <span slot="open">已启用</span>
                <span slot="close">未启用</span>
              </i-switch>
            </FormItem>

            <div v-show="journalTemplate.weeklyStatus">
              <FormItem label="提交周期:"
                        prop="weekTimes"
                        class="ivu-form-item-required">
                <Row :gutter="10">
                  <Col span="8">
                  <Row>
                    <Col span="12">
                    <Select v-model="journalTemplate.weeklyStartDate">
                      <Option v-for="d in weekDays"
                              :key="d"
                              :value="'周' + d">周{{d}}</Option>
                    </Select>
                    </Col>
                    <Col span="12">
                    <InputNumber v-model="journalTemplate.weeklyStartTime"
                                 :max="24"
                                 :min="0" />:00
                    </Col>
                  </Row>
                  </Col>
                  <Col span="1">
                  <div class="time-center"> 至 </div>
                  </Col>
                  <Col span="8">
                  <Row>
                    <Col span="12">
                    <Select v-model="journalTemplate.weeklyEndDate">
                      <Option v-for="d in weekDays"
                              :key="d"
                              :value="'周' + d">周{{d}}</Option>
                    </Select>
                    </Col>
                    <Col span="12">
                    <InputNumber v-model="journalTemplate.weeklyEndTime"
                                 :max="24"
                                 :min="0" />:00
                    </Col>
                  </Row>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Alert>
                  每周 {{swdStr}} {{swtStr}} :00 开始写本周的日志，
                  {{ewdStr}} {{ewtStr}} :00 前提交为正常提交，除此之外为未交
                </Alert>
              </FormItem>

              <FormItem label="提醒员工提交:"
                        prop="isRemindOfWeekly">
                <i-switch v-model="journalTemplate.isRemindOfWeekly"
                          class="setting-switch"
                          size="large">
                  <span slot="open">提醒</span>
                  <span slot="close">不提醒</span>
                </i-switch>
              </FormItem>

              <div v-show="journalTemplate.isRemindOfWeekly">
                <FormItem label="提醒员工提交:"
                          prop="remindTimeOfWeekly">
                  截止时间前
                  <InputNumber v-model="journalTemplate.remindTimeOfWeekly"
                               :max="8"
                               :min="1" />
                  小时
                </FormItem>
                <FormItem label="提醒内容:"
                          prop="contentOfWeekly">
                  <Input v-model="journalTemplate.contentOfWeekly"
                         type="textarea"
                         placeholder="请填写提醒内容" />
                </FormItem>
              </div>
            </div>
          </div>
        </template>

        <!-- ============================== period === 'month'============================= -->

        <template v-else-if="period === 'month'">
          <div class="journal-tag">

            <FormItem label="启用月报:">
              <i-switch v-model="journalTemplate.monthlyStatus"
                        class="setting-switch"
                        size="large">
                <span slot="open">已启用</span>
                <span slot="close">未启用</span>
              </i-switch>
            </FormItem>

            <div v-show="journalTemplate.monthlyStatus">
              <FormItem label="提交周期:"
                        prop="monthTimes"
                        class="ivu-form-item-required">

                <Row :gutter="10">
                  <Col span="8">
                  <Row>
                    <Col span="12">
                    <InputNumber v-model="journalTemplate.monthlyStartDate"
                                 :max="31"
                                 :min="1" />号
                    </Col>
                    <Col span="12">
                    <InputNumber v-model="journalTemplate.monthlyStartTime"
                                 :max="24"
                                 :min="0" />:00
                    </Col>
                  </Row>
                  </Col>
                  <Col span="1">
                  <div class="time-center"> 至 </div>
                  </Col>
                  <Col span="8">
                  <Row>
                    <Col span="12">
                    <InputNumber v-model="journalTemplate.monthlyEndDate"
                                 :max="31"
                                 :min="1" />号
                    </Col>
                    <Col span="12">
                    <InputNumber v-model="journalTemplate.monthlyEndTime"
                                 :max="24"
                                 :min="0" />:00
                    </Col>
                  </Row>
                  </Col>
                </Row>

              </FormItem>
              <FormItem>
                <Alert>
                  本月 {{smdStr}}日 {{smtStr}} :00 开始写当天的日志，
                  本月 {{emdStr}}日 {{emtStr}} :00 前提交为正常提交，除此之外为未交
                </Alert>
              </FormItem>

              <FormItem label="提醒员工提交:"
                        prop="isRemindOfMonthly">
                <i-switch v-model="journalTemplate.isRemindOfMonthly"
                          class="setting-switch"
                          size="large">
                  <span slot="open">提醒</span>
                  <span slot="close">不提醒</span>
                </i-switch>
              </FormItem>

              <div v-show="journalTemplate.isRemindOfMonthly">
                <FormItem label="提醒员工提交:"
                          prop="remindTimeOfMonthly">
                  截止时间前
                  <InputNumber v-model="journalTemplate.remindTimeOfMonthly"
                               :max="8"
                               :min="1" />
                  小时
                </FormItem>

                <FormItem label="提醒内容:"
                          prop="contentOfMonthly">
                  <Input v-model="journalTemplate.contentOfMonthly"
                         type="textarea"
                         placeholder="请填写提醒内容" />
                </FormItem>
              </div>
            </div>
          </div>
        </template>

      </Form>
    </Card>
    <Button type="primary"
            class="submit-btn"
            @click="submit">提交{{periodStr}}设置</Button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { dailySetting, updateDailySetting, autoCreateDailyTemplate } from '@/api/dailySetting'

// 用于返回数组的排序
const DAY_SORT = (a, b) => ((parseInt(a, 10) + 6) % 7 - (parseInt(b, 10) + 6) % 7)

export default {
  name: '',
  components: {},
  props: {},
  data () {
    // 用于校验表单
    let self = this
    return {
      // 固定数组，用于选择
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      period: 'day',

      journalTemplate: {
        days: []
      },
      rule: {
        dayDays: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'day') return callback()
            if (!self.journalTemplate.dailyStatus) return callback()
            if (!self.journalTemplate.days || !self.journalTemplate.days.length) return callback(new Error('请选择天数'))
            return callback()
          }
        }],
        dayTimes: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'day') return callback()
            if (!self.journalTemplate.dailyStatus) return callback()
            let { st, et } = {
              st: parseInt(self.journalTemplate.startTime, 10),
              et: parseInt(self.journalTemplate.endTime, 10)
            }
            if (isNaN(st) || isNaN(et)) return callback(new Error('请填写时间'))
            if (st >= et) return callback(new Error('开始时间不得大于结束时间'))
            return callback()
          }
        }],
        weekTimes: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'week') return callback()
            if (!self.journalTemplate.weeklyStatus) return callback()
            let sdIdx = self.weekDays.indexOf(self.journalTemplate.weeklyStartDate[1])
            let edIdx = self.weekDays.indexOf(self.journalTemplate.weeklyEndDate[1])

            if (sdIdx < 0 || edIdx < 0) return callback(new Error('请填写日期'))

            let { sd, st, ed, et } = {
              sd: sdIdx,
              st: parseInt(self.journalTemplate.weeklyStartTime, 10),
              ed: edIdx,
              et: parseInt(self.journalTemplate.weeklyEndTime, 10)
            }

            if (isNaN(sd) || isNaN(st) || isNaN(ed) || isNaN(et)) return callback(new Error('请填写时间'))

            if (sd * 100 + st >= ed * 100 + et) return callback(new Error('开始时间不得大于结束时间'))
            return callback()
          }
        }],
        monthTimes: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'month') return callback()
            if (!self.journalTemplate.monthlyStatus) return callback()
            let { sd, st, ed, et } = {
              sd: parseInt(self.journalTemplate.monthlyStartDate, 10),
              st: parseInt(self.journalTemplate.monthlyStartTime, 10),
              ed: parseInt(self.journalTemplate.monthlyEndDate, 10),
              et: parseInt(self.journalTemplate.monthlyEndTime, 10)
            }

            if (isNaN(sd) || isNaN(st) || isNaN(ed) || isNaN(et)) return callback(new Error('请填写时间'))

            if (sd * 100 + st >= ed * 100 + et) return callback(new Error('开始时间不得大于结束时间'))
            return callback()
          }
        }],
        remindTimeOfDay: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'day' || !self.journalTemplate.dailyStatus || !self.journalTemplate.isRemindOfDay) return callback()
            if (isNaN(parseInt(self.journalTemplate.remindTimeOfDay, 10))) return callback(new Error('请填写提醒时间'))
            return callback()
          }
        }],
        remindTimeOfWeekly: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'week' || !self.journalTemplate.weeklyStatus || !self.journalTemplate.isRemindOfWeekly) return callback()
            if (isNaN(parseInt(self.journalTemplate.remindTimeOfWeekly, 10))) return callback(new Error('请填写提醒时间'))
            return callback()
          }
        }],
        remindTimeOfMonthly: [{
          validator: (rule, value, callback) => {
            if (self.period !== 'month' || !self.journalTemplate.monthlyStatus || !self.journalTemplate.isRemindOfMonthly) return callback()
            if (isNaN(parseInt(self.journalTemplate.remindTimeOfMonthly, 10))) return callback(new Error('请填写提醒时间'))
            return callback()
          }
        }]

      }

    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ]),

    // 显示参数
    periodStr () {
      switch (this.period) {
        case 'day': return '日报'
        case 'week': return '周报'
        case 'month': return '月报'
        default: return ''
      }
    },
    sdtStr () { return this.journalTemplate.startTime },
    edtStr () { return this.journalTemplate.endTime },
    swdStr () { return this.journalTemplate.weeklyStartDate },
    ewdStr () { return this.journalTemplate.weeklyEndDate },
    swtStr () { return this.journalTemplate.weeklyStartTime },
    ewtStr () { return this.journalTemplate.weeklyEndTime },
    smdStr () { return this.journalTemplate.monthlyStartDate },
    emdStr () { return this.journalTemplate.monthlyEndDate },
    smtStr () { return this.journalTemplate.monthlyStartTime },
    emtStr () { return this.journalTemplate.monthlyEndTime }

  },
  methods: {
    checkDay (idx) {
      return this.journalTemplate.days.some(v => (v + 6) % 7 === idx)
    },

    setDay (idx, val) {
      console.log('idx %s , weekDay %s , dayValue %s, val %o ', idx, this.weekDays[idx], (idx + 1) % 7, val)
      console.log('before set Days', this.journalTemplate.days.join(','))
      if (val) {
        console.log('add one')
        this.journalTemplate.days = this.journalTemplate.days.concat([(idx + 1) % 7]).sort(DAY_SORT)
      } else {
        console.log('delete one')
        this.journalTemplate.days = this.journalTemplate.days.filter(d => d !== (idx + 1) % 7).sort(DAY_SORT)
      }

      console.log('after set Days', this.journalTemplate.days.join(','))
    },

    async submit () {
      let valid = await new Promise(resolve => this.$refs.journalTemplate.validate(valid => resolve(valid)))

      if (!valid) {
        return this.$Message.error('请检查所有选项已正确填入')
      }

      // 只能分部提交
      switch (this.period) {
        case 'day':
          this.journalTemplate.dailyType = 'DAILY'
          break
        case 'week':
          this.journalTemplate.dailyType = 'WEEKLY'
          break
        case 'month':
          this.journalTemplate.dailyType = 'MONTHLY'
          break
        default: break
      }

      let self = this
      this.$Modal.confirm({
        title: `确定保存并更新日报设置`,
        onOk () {
          self.$Loading.start()
          updateDailySetting(self.journalTemplate).then(res => {
            self.$Loading.finish()
            self.$Message.success(`更新${self.periodStr}设置成功`)
          }).catch(err => {
            console.error(err)
            self.$Loading.error()
            self.$Message.error(`更新${self.periodStr}设置失败`)
          })
        }

      })
    },

    test (event) {
      console.dir(event)
      debugger
    }

  },
  created () {
    let self = this

    self.$Loading.start()
    // 按手机版来
    dailySetting().then(res => {
      self.$Loading.finish()
      if (res.data) {
        res.data.startTime = parseInt(res.data.startTime, 10) || 0
        res.data.endTime = parseInt(res.data.endTime, 10) || 0
        res.data.weeklyStartTime = parseInt(res.data.weeklyStartTime, 10) || 0
        res.data.weeklyEndTime = parseInt(res.data.weeklyEndTime, 10) || 0
        res.data.monthlyStartTime = parseInt(res.data.monthlyStartTime, 10) || 0
        res.data.monthlyEndTime = parseInt(res.data.monthlyEndTime, 10) || 0
        self.journalTemplate = res.data
      } else {
        autoCreateDailyTemplate(this.getUserInfo.departmentId)
      }
    }).catch(err => {
      console.error(err)
      self.$Loading.error()
      self.$Message.error(`获取日报失败`)
    })
  }
}
</script>
<style lang="less" scoped>
.journal-form {
  max-width: 900px;
  min-width: 900px;
}
.journal-tag {
  min-height: 100px;
}
.time-center {
  text-align: center;
}

.submit-btn {
  position: relative;
  bottom: 90px;
  left: 120px;
}

@hd: ~".setting-switch.ivu-switch-large";
@{hd} {
  width: 76px;
}
@{hd}:active:after {
  width: 46px;
}
@{hd}:active:after {
  width: 50px;
}
@{hd}.ivu-switch-checked:after {
  left: 55px;
}
@{hd}.ivu-switch-checked:before {
  left: 57px;
}
@{hd}:active.ivu-switch-checked:after {
  left: 43px;
}
</style>
