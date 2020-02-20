import { mapGetters } from 'vuex'
import {
  approval,
  withdraw,
  agreement,
  overruled,
  details
} from '@/api/approval'

const HOUR_MS = 3600000
const DAY_MS = 86400000

export default {
  props: {
    id: {
      type: String,
      default: () => ''
    }
  },
  data () {
    let self = this
    return {
      // 加载中
      spinShow: false,
      // 类型
      // applicationType: '',
      // 显示提交
      showSubmit: true,
      rule: {
        duration: [
          {
            validator: (rule, value, callback) => {
              if (!self.apply.duration) {
                return callback(new Error('时长不得为零'))
              }
              if (self.apply.duration < 0) {
                return callback(new Error('开始时间不得晚于结束时间'))
              }
              return callback()
            }
          }
        ]
      },
      // 临时编辑对象
      apply: {
        startAPM: 0,
        endAPM: 12
      }
    }
  },
  watch: {
    id (val) {
      if (val) this.initItem()
    }
  },
  methods: {
    calDuration () {
      this.apply.duration = 0
      if (this.approvalAppyType === 'OVERTIME') {
        let { startTime, endTime } = this.apply
        if (!startTime || !endTime) return
        let sd = new Date(startTime).getTime()
        let ed = new Date(endTime).getTime()
        this.apply.duration = Math.round((ed - sd) / HOUR_MS)
      } else {
        let { startTime, startAPM, endTime, endAPM } = this.apply
        if (!startTime || !endTime || isNaN(startAPM) || isNaN(endAPM)) return
        console.log('startTime  ,%o', startTime)
        console.log('endTime  ,%o', endTime)

        let sd = new Date(startTime).getTime()
        let ed = new Date(endTime).getTime()
        let st = parseInt(startAPM)
        let et = parseInt(endAPM)

        console.log('sd  ,%o', sd)
        console.log('ed  ,%o', ed)
        console.log('st  ,%o', st)
        console.log('et  ,%o', et)

        this.apply.duration = (ed + et * HOUR_MS - sd - st * HOUR_MS) / DAY_MS
      }
      this.$forceUpdate()
    },
    handleReset () {
      this.apply = {}
      this.showSubmit = true
    },
    async handleSubmit () {
      const valid1 = await new Promise(resolve => {
        this.$refs.apply.validate(async valid => resolve(valid))
      })

      const valid2 = await this.$refs.workflow.validate()

      if (!valid1 || !valid2) {
        this.$Message.error('请正确填写必填项')
        return
      }

      const submitObj = Object.assign({}, this.apply, this.$refs.workflow.apply)

      if (this.approvalAppyType !== 'OVERTIME') {
        let { startTime, startAPM, endTime, endAPM } = this.apply
        let st = new Date(startTime)
        let et = new Date(endTime)
        st.setHours(startAPM + 6)
        et.setHours(endAPM - 6)
        submitObj.startTime = st.toHawkString().slice(0, -3)
        submitObj.endTime = et.toHawkString().slice(0, -3)
      } else {
        submitObj.startTime = new Date(this.apply.startTime)
          .toHawkString()
          .slice(0, -3)
        submitObj.endTime = new Date(this.apply.endTime)
          .toHawkString()
          .slice(0, -3)
      }

      // 不要头像和名字
      submitObj.approvalProcessDTOS = submitObj.approvalProcessDTOS.map(ap => ({
        approvalNum: ap.approvalNum,
        auditUserId: ap.auditUserId
      }))

      // ./workflow.vue line:97 Object.assign 会产生部分问题，需要手工调整
      this.apply.site && (submitObj.site = this.apply.site)
      this.apply.leaveId && (submitObj.leaveId = this.apply.leaveId)
      this.apply.leaveType && (submitObj.leaveType = this.apply.leaveType)
      // 此处注入类型
      submitObj.applicationType = this.approvalAppyType

      this.spinShow = true

      try {
        const res = await approval(submitObj)
        if (res) this.$Message.success('申请成功')
        this.showSubmit = false
        this.$forceUpdate()
      } catch (error) {
        console.error(error)
        this.$Message.error('申请失败')
      } finally {
        this.spinShow = false
      }
    },
    async initItem () {
      console.log('init Item in mixin')

      if (!this.id) return this.$Message.error('缺少ID')

      this.spinShow = true

      try {
        let res = await details(this.id)
        if (!res || !res.data) {
          throw new Error('No data From Remote Server By this ID.')
        }
        this.apply = res.data

        if (this.approvalApplicationType === 'LEAVE' && this.apply.leaveType) {
          this.leaveStr = this.leaveTypes[this.apply.leaveType] || ''
        }
      } catch (error) {
        console.error(error)
        this.$Message.error('获取数据失败')
      } finally {
        this.spinShow = false
      }
    },
    async withdraw () {
      let self = this
      this.$Modal.confirm({
        title: '确定撤销该申请',
        onOk (evt) {
          self.changeStatus(withdraw(self.id), self, '撤销')
        }
      })
    },
    async agreement () {
      let self = this
      this.$Modal.confirm({
        title: '确定通过该申请',
        onOk (evt) {
          self.changeStatus(agreement(self.id), self, '审批')
        }
      })
    },
    async overruled () {
      let refuse = ''
      let self = this
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              autofocus: true,
              placeholder: '请输入拒绝原因'
            },
            on: {
              input: val => {
                refuse = val
              }
            }
          })
        },
        onOk: () => {
          if (!refuse) return self.$Message.warning('必须填写拒绝原因')
          self.changeStatus(
            overruled({
              approvalId: self.id,
              result: refuse
            }),
            self,
            '驳回'
          )
        }
      })
    },
    async changeStatus (promise, self, title) {
      self.$Loading.start()

      promise
        .then(res => {
          self.$Loading.finish()
          self.$emit('refresh')
          self.initItem()
          self.$Message.info(title + '成功')
        })
        .catch(err => {
          console.error(err)
          self.$Loading.error()
          self.$Message.error(title + '失败，请稍后再试')
        })
    },
    dateApmStr (date) {
      let dt = new Date(date)
      if (isNaN(dt.getTime())) return ''
      return (
        dt.toHawkDateString() + ' ' + (dt.getHours() < 12 ? '上午' : '下午')
      )
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'approvalApplicationType',
      'approvalActionType',
      'approvalAppyType'
    ])
  },
  created () {}
}
