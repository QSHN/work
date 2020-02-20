<template>
  <div class="timecard-form">
    <template v-if="currentTimecard">
      <Form ref="timecard"
            :model="currentTimecard"
            :rules="rule"
            :label-width="90">
        <!-- =========================== 考勤组名称  ============================  -->

        <FormItem label="考勤组名称:"
                  prop="name">
          <Input v-model="currentTimecard.name"
                 placeholder="考勤组名称" />
        </FormItem>

        <!-- ===================================== 打卡时间 =======================================  -->

        <FormItem label="打卡时间:"
                  prop="attendanceDateDTOList">
          <div class="timecard-gap-main">
            <div class="timecard-gap-add">
              <Button @click="addWorkDate"
                      icon="md-add"
                      size="small"
                      type="success">添加打卡时间</Button>
            </div>

            <div class="timecard-gap-list">
              <div v-for="(td, idx) in currentTimecard.attendanceDateDTOList"
                   :key="idx">

                <Card title="打卡时间"
                      icon="md-calendar"
                      class="timecard-gap-card"
                      :padding="0">

                  <div slot="extra"
                       class="timecard-btns">
                    <Button ghost
                            icon="md-close"
                            size="small"
                            type="error"
                            @click="deleteWorkDate(td, idx)">删除打卡</Button>
                  </div>

                  <!-- ========================= 打卡时间:工作日 ===========================  -->

                  <div class="timecard-gap-row">
                    <div class="timecard-gap-row-hd">工作日:</div>
                    <div class="timecard-gap-row-bd">
                      <Tag v-for="(day,kdx) in weekDays "
                           :key="kdx"
                           color="primary"
                           checkable
                           :name=" idx + ':' + kdx "
                           :checked="td.days.includes(kdx + 1)"
                           @on-change="updateWorkDay">{{day}}</Tag>
                    </div>
                  </div>

                  <!-- ========================= 打卡时间:上下班时段 ===========================  -->

                  <div class="timecard-gap-placeholder">
                    <span>上下班时段</span>
                  </div>

                  <div v-for="(tt, jdx ) in td.attendanceTimeDTOList"
                       :key="jdx"
                       class="mini-group">
                    <div class="mini-group-row">
                      <div class="mini-group-bd">
                        <div class="timecard-gap-row">
                          <div class="timecard-gap-row-hd">上班:</div>
                          <div class="timecard-gap-row-bd">
                            <TimePicker format="HH:mm"
                                        :clearable="false"
                                        v-model="tt.startTime" />
                          </div>
                        </div>
                        <div class="timecard-gap-row">
                          <div class="timecard-gap-row-hd">下班:</div>
                          <div class="timecard-gap-row-bd">
                            <TimePicker format="HH:mm"
                                        :clearable="false"
                                        v-model="tt.endTime" />
                          </div>
                        </div>
                      </div>
                      <div class="mini-group-ft">
                        <Button @click="deleteWorkTime(td, tt, jdx)"
                                ghost
                                icon="md-trash"
                                size="small"
                                type="error" />
                      </div>
                    </div>

                    <div class="mini-group-bt">
                      <Divider class="mini-group-divider"
                               dashed />
                    </div>

                  </div>

                  <div class="timecard-gap-placeholder">

                    <Button @click="addWorkTime(td, idx)"
                            ghost
                            icon="md-add"
                            size="small"
                            type="success">添加时段</Button>
                  </div>

                  <!-- ========================= 打卡时间:允许迟到分钟数 ===========================  -->

                  <Divider class="timecard-gap-divider" />

                  <div class="timecard-gap-row">
                    <div class="timecard-gap-row-hd">允许迟到</div>
                    <div class="timecard-gap-row-bd">
                      <InputNumber :max="60"
                                   :min="0"
                                   v-model="td.lateMinutes" /> 分钟
                    </div>
                  </div>

                  <!-- ========================= 打卡时间:允许早退分钟数 ===========================  -->

                  <Divider class="timecard-gap-divider" />

                  <div class="timecard-gap-row">
                    <div class="timecard-gap-row-hd">允许早退</div>
                    <div class="timecard-gap-row-bd">
                      <InputNumber :max="60"
                                   :min="0"
                                   v-model="td.earlyMinutes" /> 分钟
                    </div>
                  </div>

                  <!-- ========================= 打卡时间:提前打卡限制 ===========================  -->

                  <Divider class="timecard-gap-divider" />

                  <div class="timecard-gap-row">
                    <div class="timecard-gap-row-hd">上班提前</div>
                    <div class="timecard-gap-row-bd">
                      <InputNumber :max="180"
                                   :min="0"
                                   v-model="td.beforeMinutes" /> 分钟可以打卡
                    </div>
                  </div>

                  <!-- ========================= 打卡时间:视为旷工 ===========================  -->

                  <Divider class="timecard-gap-divider" />

                  <div class="timecard-gap-row">
                    <div class="timecard-gap-row-hd">迟到时长</div>
                    <div class="timecard-gap-row-bd">
                      <InputNumber :max="1440"
                                   :min="0"
                                   v-model="td.absenteeismMinutes" /> 分钟视为旷工
                    </div>
                  </div>

                </Card>
              </div>
            </div>
          </div>
        </FormItem>

        <!-- =========================== 打卡人员  ============================  -->

        <FormItem label="打卡人员:"
                  prop="attendancePersonnelDTOList">
          <Input :value="getPersonnnelNames"
                 @click.native="$refs.treepicker.show()"
                 type="textarea"
                 :rows="2"
                 readonly />
          <employee-tree-picker ref="treepicker"
                                :selectList="currentTimecard.attendancePersonnelDTOList"
                                @submit="updatePersonnel"
                                @cancle="showTreePicker = false"
                                :multiple="true" />
        </FormItem>

        <!-- =========================== 汇报对象  ============================  -->

        <FormItem label="汇报对象:"
                  prop="reportUserList">
          <employee-selector v-model="currentTimecard.reportUserIds"
                             :multiple="true"
                             range="allEmployee" />
        </FormItem>

        <!-- =========================== 打卡位置  ============================  -->

        <FormItem label="打卡位置:"
                  prop="addressDTOList">

          <div class="timecard-gap-main">
            <div class="timecard-gap-add">
              <Button @click="addLocation"
                      icon="md-add"
                      size="small"
                      type="primary">添加打卡位置</Button>
              <Button @click="deleteLocation"
                      icon="md-close"
                      size="small"
                      type="error">删除打卡位置</Button>
            </div>

            <!-- {{currentTimecard.addressDTOList.map(a=>JSON.stringify(a)).join(',')}} -->

            <div class="timecard-gap-list">
              <div v-for="(ad, idx) in currentTimecard.addressDTOList"
                   :key="idx">
                <amap-range @location="getLocation"
                            :initlat="ad.latitude"
                            :initlng="ad.longitude"
                            :initRange="ad.scope"
                            :initAddress="ad.address"
                            :idx="idx" />
              </div>
            </div>

          </div>

          <!-- <Alert>打卡位置如果不设置，就可以在任意地点进行打卡</Alert> -->
        </FormItem>

        <!-- =========================== 打卡提醒  ============================  -->

        <FormItem label="打卡提醒:">
          <div class="form-ipts">
            <span>上班：</span>
            <InputNumber :max="15"
                         :min="0"
                         v-model="currentTimecard.startRemind" />
            <span> 分钟;&nbsp;&nbsp;</span>

            <span>下班：</span>
            <InputNumber :max="15"
                         :min="0"
                         v-model="currentTimecard.endRemind" />
            <span> 分钟</span>
          </div>

          <Alert>
            <span class="form-notice">
              上班<span v-if="currentTimecard.startRemind">提前{{currentTimecard.startRemind}}分钟</span><span v-else>准点</span>提醒；
              下班<span v-if="currentTimecard.endRemind">提前{{currentTimecard.endRemind}}分钟</span><span v-else>准点</span>提醒
            </span>
          </Alert>
        </FormItem>

        <!-- =========================== 拍照打卡  ============================  -->

        <FormItem label="拍照打卡:">

          <i-switch v-model="currentTimecard.photoCheck"
                    size="large">
            <span slot="open">必须</span>
            <span slot="close">不须</span>
          </i-switch>

          <span class="form-swich-tips">
            员工打卡时{{currentTimecard.photoCheck ? '必须' : '不须'}}拍照
          </span>

        </FormItem>

        <!-- ======================================== 特殊日期  =======================================  -->

        <!-- =========================== 必须打卡日期============================  -->

        <FormItem label="特殊日期:"
                  prop="specialDateDTOList">
          <div class="timecard-gap-main">
            <div class="timecard-gap-add">
              <Button @click="addCheckinDate"
                      icon="md-add"
                      size="small"
                      type="warning">添加必须打卡日期</Button>
            </div>

            <div class="timecard-gap-list">
              <div v-for="(td, idx) in currentTimecard.specialDateDTOList"
                   :key="idx">
                <template v-if="td.specialDateType === 'CHECKIN'">
                  <Card title="打卡日期"
                        icon="md-calendar"
                        class="timecard-gap-card"
                        :padding="0">

                    <div slot="extra"
                         class="timecard-btns">
                      <Button ghost
                              icon="md-close"
                              size="small"
                              type="error"
                              @click="delSpecialDate(td, idx)">删除日期</Button>
                    </div>

                    <div class="timecard-gap-row">
                      <div class="timecard-gap-row-hd">日期:</div>
                      <div class="timecard-gap-row-bd">
                        <DatePicker type="date"
                                    :clearable="false"
                                    v-model="td.specialDate"
                                    placeholder="选择日期" />
                      </div>
                    </div>

                    <!-- =========================== 特殊日期: 上下班时段 ============================  -->

                    <div class="timecard-gap-placeholder">
                      <span>上下班时段</span>
                    </div>

                    <div v-for="(tt, jdx ) in td.attendanceTimeDTOList"
                         :key="jdx"
                         class="mini-group">
                      <div class="mini-group-row">
                        <div class="mini-group-bd">
                          <div class="timecard-gap-row">
                            <div class="timecard-gap-row-hd">上班:</div>
                            <div class="timecard-gap-row-bd">
                              <TimePicker format="HH:mm"
                                          :clearable="false"
                                          v-model="tt.startTime" />
                            </div>
                          </div>
                          <div class="timecard-gap-row">
                            <div class="timecard-gap-row-hd">下班:</div>
                            <div class="timecard-gap-row-bd">
                              <TimePicker format="HH:mm"
                                          :clearable="false"
                                          v-model="tt.endTime" />
                            </div>
                          </div>
                        </div>
                        <div class="mini-group-ft">
                          <Button @click="deleteWorkTime(td, tt, jdx)"
                                  ghost
                                  icon="md-trash"
                                  size="small"
                                  type="error" />
                        </div>
                      </div>

                      <div class="mini-group-bt">
                        <Divider class="mini-group-divider"
                                 dashed />
                      </div>

                    </div>

                    <div class="timecard-gap-placeholder">

                      <Button @click="addWorkTime(td, idx)"
                              ghost
                              icon="md-add"
                              size="small"
                              type="success">添加时段</Button>
                    </div>

                    <!-- =========================== 特殊日期: 事由 ============================  -->

                    <div class="timecard-gap-row">
                      <div class="timecard-gap-row-hd">事由:</div>
                      <div class="timecard-gap-row-bd">
                        <Input v-model="td.reason" />
                      </div>
                    </div>

                  </Card>
                </template>
              </div>
            </div>

            <!-- =========================== 不须打卡日期============================  -->

            <div class="timecard-gap-add">
              <Button @click="addNocheckDate"
                      icon="md-add"
                      size="small"
                      type="info">添加不须打卡日期</Button>
            </div>

            <div class="timecard-gap-list">
              <div v-for="(td, idx) in currentTimecard.specialDateDTOList"
                   :key="idx">
                <template v-if="td.specialDateType === 'NOCHECK'">
                  <Card title="打卡日期"
                        icon="md-calendar"
                        class="timecard-gap-card"
                        :padding="0">

                    <div slot="extra"
                         class="timecard-btns">
                      <Button ghost
                              icon="md-close"
                              size="small"
                              type="error"
                              @click="delSpecialDate(td, idx)">删除日期</Button>
                    </div>

                    <div class="timecard-gap-row">
                      <div class="timecard-gap-row-hd">日期:</div>
                      <div class="timecard-gap-row-bd">
                        <DatePicker type="date"
                                    :clearable="false"
                                    v-model="td.specialDate"
                                    placeholder="选择日期" />
                      </div>
                    </div>

                    <div class="timecard-gap-row">
                      <div class="timecard-gap-row-hd">事由:</div>
                      <div class="timecard-gap-row-bd">
                        <Input v-model="td.reason" />
                      </div>
                    </div>

                  </Card>
                </template>
              </div>
            </div>
          </div>
        </FormItem>

        <!-- =========================== 同步中国节假日  ============================  -->

        <FormItem label="中国节假日:">
          <i-switch v-model="currentTimecard.holidays"
                    size="large">
            <span slot="open">同步</span>
            <span slot="close">取消</span>
          </i-switch>

          <span class="form-swich-tips">
            中国法定节假日{{currentTimecard.holidays ? '不用' : '需要'}}打卡
          </span>
        </FormItem>

      </Form>
    </template>

    <Spin size="large"
          v-if="spinShow"
          fix />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import amapSearch from '_c/amap/city.vue'
import EmployeeSelector from '_c/employees/selector.vue'
import EmployeeTreePicker from '_c/employees/tree-picker.vue'
import amapRange from '_c/amap/range.vue'

const timeStrToMinutes = t => {
  // 不能使用eval
  // try {
  //   let v = eval("return "+t.replace(':', '*60+'))
  //   return isNaN(v) ? -1 : v
  // } catch (error) {
  //   console.error(error)
  //   return -1
  // }

  return t.split(':').map((val, idx) => parseInt(val, 10) * (idx ? 1 : 60)).reduce((p, n) => p + n, 0)
}

// 转换时间数组
const getWorkTimesValue = wts => {
  return wts.map(tc => {
    return {
      startTime: timeStrToMinutes(tc.startTime),
      endTime: timeStrToMinutes(tc.endTime)
    }
  })
}
// 校验是否按顺序 上班开始 < 上班结束 < 下班开始 < 下班结束
const checkWorkTimesOrder = wts => {
  return wts.every(tc => tc.startTime < tc.endTime)
}
// 校验是否重叠
const checkWorkTimesCross = wts => {
  for (let i = 0; i < wts.length; i++) {
    for (let j = i + 1; j < wts.length; j++) {
      if (wts[j].endTime >= wts[i].startTime && wts[i].endTime >= wts[j].startTime) return false
    }
  }
  return true
}

export default {
  name: 'Timecard',
  components: {
    amapSearch,
    EmployeeSelector,
    EmployeeTreePicker,
    amapRange
  },
  data () {
    let self = this
    return {
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      getPersonnnelNames: '',
      rule: {
        name: [{ required: true, message: '请填写考勤组名称' }],
        attendanceDateDTOList: [{
          validator: (rule, value, callback) => {
            let List = self.currentTimecard.attendanceDateDTOList
            if (!List || !List.length) return callback(new Error('至少要添加一个打卡时间'))
            let countDays = []
            for (const data of List) {
              if (!data.days || !data.days.length) return callback(new Error('至少要选择一个工作日'))

              if (countDays.some(d => data.days.includes(d))) return callback(new Error('工作日不能重叠'))
              // 添加到列表
              countDays = countDays.concat(data.days)

              if (data.attendanceTimeDTOList && data.attendanceTimeDTOList.length) {
                let wtc = getWorkTimesValue(data.attendanceTimeDTOList)
                if (!checkWorkTimesOrder(wtc)) return callback(new Error('上班时间不得晚于下班时间'))
                if (!checkWorkTimesCross(wtc)) return callback(new Error('时间出现重叠'))
              } else {
                return callback(new Error('至少添加一个时段'))
              }
            }
            return callback()
          }
        }],
        attendancePersonnelDTOList: [{
          validator: (rule, value, callback) => {
            let List = self.currentTimecard.attendancePersonnelDTOList
            if (!List || !List.length) return callback(new Error('至少要添加一名打卡人员'))
            return callback()
          }
        }],
        specialDateDTOList: [{
          validator: (rule, value, callback) => {
            let List = self.currentTimecard.specialDateDTOList
            if (!List || !List.length) return callback()
            for (const data of List) {
              if (data.attendanceTimeDTOList && data.attendanceTimeDTOList.length) {
                let wtc = getWorkTimesValue(data.attendanceTimeDTOList)
                if (!checkWorkTimesOrder(wtc)) return callback(new Error('上班时间不得晚于下班时间'))
                if (!checkWorkTimesCross(wtc)) return callback(new Error('时间出现重叠'))
              }
            }
            return callback()
          }
        }],
        addressDTOList: [{
          validator: (rule, value, callback) => {
            let List = self.currentTimecard.addressDTOList
            if (!List || !List.length) return callback(new Error('至少要添加一处打卡地点'))
            return callback()
          }
        }],
        reportUserList: [{
          validator: (rule, value, callback) => {
            let List = self.currentTimecard.reportUserIds
            if (!List || !List.length) return callback(new Error('至少要添加一名汇报对象'))
            return callback()
          }
        }]
      },
      spinShow: false
    }
  },
  watch: {
    currentTimecard (val) {
      console.log('change currentTimecard %o', val)
      if (val) {
        if (val.reportUserList && val.reportUserList.length) {
          val.reportUserIds = val.reportUserList.map(p => p.id)
        }
        if (val.attendancePersonnelDTOList && val.attendancePersonnelDTOList.length) {
          this.updatePersonnel(val.attendancePersonnelDTOList)
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentTimecard'])
  },
  methods: {
    ...mapActions(['saveTimecard']),

    // 设置打卡工作日
    updateWorkDay (checked, name) {
      if (!name) return this.$Message.error('发生错误')

      let ids = name.split(':')
      if (!ids || ids.length !== 2 || isNaN(ids[0]) || isNaN(ids[1])) return this.$Message.error('发生错误')

      let td = this.currentTimecard.attendanceDateDTOList[ids[0]]
      if (!td) return this.$Message.error('发生错误')

      if (!td.days || !td.days.length) td.days = []
      // 天数等于序号加一
      let d = parseInt(ids[1], 10) + 1
      if (d < 1 || d > 7) return this.$Message.error('发生错误')
      if (checked === true && !td.days.includes(d)) {
        td.days.push(d)
      } else if (checked === false && td.days.includes(d)) {
        td.days = td.days.filter(i => i !== d)
      }
      td.days.sort()
      this.$forceUpdate()
    },

    // 添加时段
    addWorkTime (td, idx) {
      if (!td.attendanceTimeDTOList) td.attendanceTimeDTOList = []
      td.attendanceTimeDTOList.push({
        timeNumber: td.attendanceTimeDTOList.length + 1,
        startTime: '08:00',
        endTime: '18:00'
      })
      this.$forceUpdate()
    },

    // 删除时段
    deleteWorkTime (td, tt, jdx) {
      td.attendanceTimeDTOList.splice(jdx, 1)
      this.$forceUpdate()
    },

    // 添加打卡时间
    addWorkDate () {
      if (!this.currentTimecard.attendanceDateDTOList) this.currentTimecard.attendanceDateDTOList = []
      this.currentTimecard.attendanceDateDTOList.push({
        days: [],
        absenteeismMinutes: 30,
        beforeMinutes: 30,
        lateMinutes: 30,
        earlyMinutes: 0,
        // 重置打卡先不用传
        // resetTime: 4,
        attendanceTimeDTOList: []
      })
      this.$forceUpdate()
    },

    // 删除打卡时间
    deleteWorkDate (td, idx) {
      this.currentTimecard.attendanceDateDTOList.splice(idx, 1)
      this.$forceUpdate()
    },

    // 添加必须打卡日期
    addCheckinDate () {
      if (!this.currentTimecard.specialDateDTOList) this.currentTimecard.specialDateDTOList = []
      this.currentTimecard.specialDateDTOList.push({
        specialDate: new Date().toHawkDateString(),
        reason: '',
        specialDateType: 'CHECKIN',
        attendanceTimeDTOList: []
      })
      this.$forceUpdate()
    },
    // 添加不须打卡日期
    addNocheckDate () {
      if (!this.currentTimecard.specialDateDTOList) this.currentTimecard.specialDateDTOList = []
      this.currentTimecard.specialDateDTOList.push({
        specialDate: new Date().toHawkDateString(),
        reason: '',
        specialDateType: 'NOCHECK'
      })
      this.$forceUpdate()
    },
    // 删除打卡日期
    delSpecialDate (td, idx) {
      this.currentTimecard.specialDateDTOList.splice(idx, 1)
      this.$forceUpdate()
    },

    // 添加打卡位置
    addLocation () {
      if (!this.currentTimecard.addressDTOList) this.currentTimecard.addressDTOList = []
      this.currentTimecard.addressDTOList.push({
        addresskeyword: '',
        address: '',
        longitude: 123.1,
        latitude: 21.11,
        scope: 300
      })
      this.$forceUpdate()
    },

    deleteLocation () {
      this.currentTimecard.addressDTOList.splice(0, 1)
      this.$forceUpdate()
    },

    // 获取地址
    getLocation ({ marker, index, range }) {
      if (!this.currentTimecard.addressDTOList) return this.$Message.error('获取地址出错')
      if (!marker || isNaN(index) || isNaN(range)) return this.$Message.error('获取地址出错')

      let location = this.currentTimecard.addressDTOList[index]
      if (!location) return this.$Message.error('获取地址出错')

      location = Object.assign(location, {
        longitude: marker.position[0],
        latitude: marker.position[1],
        scope: range,
        addresskeyword: marker.addresskeyword,
        address: marker.address
      })

      this.$forceUpdate()
    },

    updatePersonnel (list) {
      if (list && list.length) {
        this.currentTimecard.attendancePersonnelDTOList = list
      } else {
        this.currentTimecard.attendancePersonnelDTOList = []
      }

      this.getPersonnnelNames = this.currentTimecard.attendancePersonnelDTOList.map(p => p.targetName || '').join('，')
    },

    // 提交表单
    submit () {
      let self = this
      return new Promise(resolve => {
        this.$refs.timecard.validate((valid) => {
          if (valid) {
            console.log('Current TimeCard : %o', self.currentTimecard)
            // 必填字段
            if (!this.currentTimecard.startRemind) this.currentTimecard.startRemind = 0
            if (!this.currentTimecard.endRemind) this.currentTimecard.endRemind = 0
            if (!this.currentTimecard.holidays) this.currentTimecard.holidays = false
            if (!this.currentTimecard.photoCheck) this.currentTimecard.photoCheck = false

            // 插入id
            if (this.currentTimecard.id) {
              let listKey = ['addressDTOList', 'specialDateDTOList', 'attendancePersonnelDTOList', 'attendanceDateDTOList']
              for (const key of listKey) {
                if (this.currentTimecard[key] && this.currentTimecard[key].length) {
                  this.currentTimecard[key].forEach(obj => { obj.templateId = this.currentTimecard.id })
                }
              }
            }

            this.spinShow = true
            this.saveTimecard(this.currentTimecard)
              .then(() => {
                this.spinShow = false
                this.$Message.success('考勤组设置保存成功')
                resolve(true)
              }).catch((err) => {
                console.error(err)
                this.$Message.error('无法保存考勤组设置')
                this.spinShow = false
                resolve(false)
              })
          } else {
            // this.$Message.error('请填写必须的内容')
            resolve(false)
          }
        })
      })
    }

  }

}
</script>
<style lang="less" scoped>
@hd: ~".timecard-gap";
@{hd}-add {
  margin-bottom: 10px;
  button {
    margin-right: 10px;
  }
}
@{hd}-list {
  width: 100%;
  padding: 5px;
  display: flex;
  flex-flow: row wrap;
  background: #fdfdfd;

  @{hd}-card {
    width: 320px;
    margin: 5px;

    @{hd}-row {
      display: flex;
      justify-content: flex-start;
      margin: 4px auto;
      padding: 0 10px;

      &-hd {
        margin-right: 10px;
      }

      &-bd {
        flex: 1 1 auto;
      }
    }

    @{hd}-placeholder {
      padding-left: 2em;
      font-size: 12px;
      line-height: 2.4;
      background: #fafafa;
      color: #999;
    }

    @{hd}-divider {
      margin: 6px 0;
    }
  }
}

.location-notice {
  color: red;
}

.del-location {
  float: right;
  margin-right: 10px;
}

.timecard-error-msg {
  color: #f33;
  width: 300px;
}

.form-ipts {
  margin: 0 auto 10px auto;
}
.form-notice {
  letter-spacing: 2px;
}
.form-swich-tips {
  display: inline-block;
  padding: 4px 12px;
  margin-left: 10px;
  font-size: 12px;
  background: #fafafa;
  color: #999;
  border-radius: 4px;
}

@hd2: ~".mini-group";
@{hd2} {
  @{hd2}-row {
    display: flex;

    @{hd2}-ft {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1 1 auto;
    }
  }

  @{hd2}-bt {
    margin: auto;
    width: 90%;

    @{hd2}-divider {
      margin: 6px 0;
    }
  }
}
</style>
