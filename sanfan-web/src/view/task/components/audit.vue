<template >
  <div class="task-form">
    <Spin v-if="spinShow"
          size="large"
          fix />

    <Card :bordered="false"
          style="width: 800px"
          dis-hover>
      <Alert slot="title">
        <span>任务完成后，记得拖拉到“已完成”后再填写任务总结</span>
        <Button v-if="hasPermission"
                @click="$emit('openEdit')"
                style="margin-left:2em;"
                type="info">编辑任务</Button>
      </Alert>

      <Form ref="task"
            :label-width="80">

        <Row>
          <Col span="8">
          <FormItem label="任务编号:">{{task.taskNumber}} </FormItem>
          <FormItem label="发起人:">{{task.createName}} </FormItem>
          <FormItem label="办理人:">{{task.executorName}} </FormItem>
          <FormItem label="审批人:">{{auditUserNames}} </FormItem>
          </Col>

          <Col span="8">
          <FormItem label="任务类型:">{{task.taskTypeName}} </FormItem>
          <FormItem label="任务等级:">
            <Tag :color="levelColor">{{levelTitle}}</Tag>
          </FormItem>
          <FormItem label="任务状态:">
            <Tag :color="statusBgColor">{{statusTitle}} </Tag>
          </FormItem>
          <FormItem label="审核状态:">
            <Tag :color="auditBgColor">{{auditTitle}}</Tag>
          </FormItem>
          </Col>

          <Col span="8">
          <FormItem label="">&nbsp;</FormItem>
          <FormItem label="创建时间:">{{task.createTime}} </FormItem>
          <FormItem label="截止时间:">{{task.endTime}}</FormItem>
          <FormItem label="完成时间:">{{task.accomplishTime}} </FormItem>
          </Col>
        </Row>

        <FormItem label="驳回原因:"
                  v-show="task.auditStatus==='NOPASS'">
          <p class="ivu-tag-text ivu-tag-color-error"
             v-text="task.result"></p>
        </FormItem>

        <FormItem label="任务内容:">
          <Input :value="task.content"
                 type="textarea"
                 readonly />
        </FormItem>

        <FormItem label="任务照片:">
          <images-viewer v-if="task.photos && task.photos.length"
                         v-model="task.photos" />
          <span v-else>无照片</span>
        </FormItem>

        <Divider />

        <FormItem label="任务总结:">
          <Input v-model="task.summarize"
                 type="textarea"
                 :readonly="!showSummary" />
        </FormItem>

        <Row :gutter="16">
          <Col span="18">
          <FormItem label="总结照片">
            <upload-pic v-if="showSummary"
                        v-model="task.summarizePhotos" />
            <images-viewer v-else-if="task.summarizePhotos && task.summarizePhotos.length"
                           :photos="task.summarizePhotos" />
            <span v-else>无照片</span>
          </FormItem>
          </Col>
        </Row>

        <FormItem :class="'task-btns'">
          <Row :gutter="20">
            <Col span="5"
                 v-if="showSummary">
            <Button type="primary"
                    size="large"
                    @click="saveSummary">保存总结</Button>
            </Col>

            <Col span="5"
                 v-if="hasPermission && task.auditStatus != 'PASS'">
            <Button type="error"
                    size="large"
                    @click="cancelTask">取消任务</Button>
            </Col>

            <Col span="16"
                 v-if="hasPermission && showAudit ">
            <template v-if="task.timeout">
              <ButtonGroup>
                <!-- 延时情况 -->
                <Button type="success"
                        size="large"
                        @click="passTask()">标记为已完成</Button>
                <Button type="warning"
                        size="large"
                        @click="failTask()">标记为未完成</Button>
                <Button type="primary"
                        size="large"
                        @click="delayTask()">延时让其完成</Button>
              </ButtonGroup>
            </template>
            <template v-else-if="task.taskStatus === 'ACCOMPLISH' ">
              <ButtonGroup>
                <!-- 已完成情况 -->
                <Button type="success"
                        size="large"
                        @click="passTask()">任务通过</Button>
                <Button type="warning"
                        size="large"
                        @click="failTask()">标记未完成</Button>
                <Button type="error"
                        size="large"
                        @click="rejectTask()">驳回</Button>
              </ButtonGroup>
            </template>
            <template v-else-if="task.taskStatus === 'UNACCOMPLISHED' ">
              <ButtonGroup>
                <!-- 未完成情况 -->
                <Button type="success"
                        size="large"
                        @click="passTask()">任务通过</Button>
                <Button type="primary"
                        size="large"
                        @click="delayTask()">延时让其完成</Button>
                <Button type="error"
                        size="large"
                        @click="rejectTask()">驳回任务</Button>
              </ButtonGroup>
            </template>
            </Col>

          </Row>

        </FormItem>

      </Form>

    </Card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'dayjs'
import ImagesViewer from '_c/images/viewer.vue'
import UploadPic from '_c/upload/upload-pic'
import { taskDetail, changeAuditStatus, submitTaskSummary, deleteTask } from '@/api/task'
import mixin from '../task.mixin'

export default {
  name: 'TaskAudit',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    ImagesViewer,
    UploadPic
  },
  props: {
    id: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      // 加载中
      spinShow: false,
      task: {
        accomplishTime: null,
        auditStatus: null,
        auditUserList: [],
        companyId: null,
        content: null,
        createId: null,
        createName: null,
        createTime: null,
        endTime: null,
        executorId: null,
        executorName: null,
        id: null,
        level: null,
        photos: [],
        result: null,
        summarize: null,
        summarizePhotos: [],
        taskNumber: null,
        taskStatus: null,
        taskTypeId: null,
        taskTypeName: null
      },
      dateOptiopn: {
        disabledDate (date) {
          return date && date.valueOf() < moment().startOf('day')
        }
      }
    }
  },
  watch: {
    id (val) {
      if (!val) return
      this.initPage()
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    // 管理权限
    hasPermission () {
      return this.task.auditUserList.some(p => p.id === this.getUserInfo.id)
    },
    // 是否显示操作处理结果
    showAudit () {
      if (this.task.auditStatus === 'PASS') return false
      if (['ACCOMPLISH', 'UNACCOMPLISHED'].includes(this.task.taskStatus)) return true
      if (this.task.timeout) return true
      return false
    },
    // 显示是否可以保存总结
    showSummary () {
      return this.task.taskStatus === 'ACCOMPLISH' && this.task.executorId === this.getUserInfo.id
    },
    auditUserNames () {
      return this.task.auditUserList.map(p => p.name).join('，')
    }
  },
  methods: {
    ...mapMutations(['setHasUpdateTask']),

    initPage () {
      console.log('task id : %s', this.id)
      this.spinShow = true
      taskDetail(this.id).then(res => {
        console.log('get detail', res)
        this.task = res.data
        this.task.photos = this.task.photos.filter(p => !!p)
        this.task.summarizePhotos = this.task.summarizePhotos.filter(p => !!p)
        this.result = this.task.result
      }).catch(err => {
        console.error('in ', err)
        this.$Message.error('获取信息失败')
      }).then(() => {
        this.spinShow = false
      })
    },
    // 保存总结
    async saveSummary () {
      let accomplishTime = await new Promise((resolve, reject) => {
        let atime
        this.$Modal.confirm({
          render: (h) => {
            return h('DatePicker', {
              props: {
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                placeholder: '请选择完成时间'
              },
              style: { width: '100%' },
              on: {
                'on-change': (val) => {
                  atime = val
                }
              }
            })
          },
          onOk: () => {
            resolve(atime)
          },
          onCancel: () => {
            resolve(false)
          }
        })
      })

      if (accomplishTime === false) return
      if (!accomplishTime) return this.$Message.info('需要填入完成时间')

      this.spinShow = true

      try {
        let rst = await submitTaskSummary({
          id: this.task.id,
          accomplishTime: accomplishTime,
          summarize: this.task.summarize,
          summarizePhotos: this.task.summarizePhotos
        })

        if (!rst) throw new Error('Unknow Error In submitTaskSummary')

        this.$set(this.task, 'accomplishTime', accomplishTime)
        this.$Message.info('任务总结保存成功')
      } catch (err) {
        console.error('in ', err)
        this.$Message.error('提交失败，请稍后再试')
      } finally {
        this.spinShow = false
      }
    },
    // 取消任务
    async cancelTask () {
      let yn = await new Promise((resolve, reject) => {
        this.$Modal.confirm({
          title: '是否取消任务',
          onOk () { resolve(true) },
          onCancel () { resolve(false) }
        })
      })

      if (!yn) return

      this.spinShow = true

      try {
        let rst = await deleteTask(this.task.id)

        if (!rst) throw new Error('Unknow Error In deleteTask')

        this.$emit('closeAudit')

        // 全局更新
        this.setHasUpdateTask(true)

        this.$Message.info('任务成功取消')
      } catch (err) {
        console.error('in cancelTask', err)
        this.$Message.error('任务取消失败，请稍后再试')
      } finally {
        this.spinShow = false
      }
    },

    // 统一操作按钮
    async doAudit (auditStatus, result, endTime) {
      this.spinShow = true

      try {
        let rst = await changeAuditStatus({ id: this.task.id, auditStatus, result, endTime })

        if (!rst) throw new Error('Unknow Error In changeAuditStatus')

        this.$set(this.task, 'auditStatus', auditStatus)
        this.$set(this.task, 'result', result)
        this.$set(this.task, 'endTime', endTime)
        this.$Message.success('操作成功')

        // 全局更新
        this.setHasUpdateTask(true)
      } catch (err) {
        console.error('in doAudit', err)
        this.$Message.error('操作失败，请稍后再试')
      } finally {
        this.spinShow = false
      }
    },
    // 已完成
    passTask () {
      let self = this
      this.$Modal.confirm({
        title: '确认将该任务标记为已完成',
        onOk () {
          self.doAudit('PASS')
        }
      })
    },
    // 未完成
    failTask () {
      let self = this
      this.$Modal.confirm({
        title: '确认将该任务标记成未完成',
        onOk () {
          self.doAudit('UNFINISHED')
        }
      })
    },
    // 任务延时
    async delayTask () {
      let delayTime = await new Promise((resolve, reject) => {
        let atime
        this.$Modal.confirm({
          render: (h) => {
            return h('DatePicker', {
              props: {
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                placeholder: '请选择延期时间'
              },
              style: { width: '100%' },
              on: {
                'on-change': (val) => {
                  atime = val
                }
              }
            })
          },
          onOk: () => {
            resolve(atime)
          },
          onCancel: () => {
            resolve(false)
          }
        })
      })

      if (delayTime === false) return
      if (!delayTime) return this.$Message.info('需要填入完成时间')

      this.doAudit('DELAYFINISHED', null, delayTime)
    },
    // 任务驳回
    async rejectTask (title = '驳回理由') {
      let result = await new Promise((resolve, reject) => {
        let note
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                autofocus: true,
                placeholder: '请输入驳回理由'
              },
              on: {
                input: (val) => {
                  note = val
                }
              }
            })
          },
          onOk: () => {
            resolve(note)
          },
          onCancel: () => {
            resolve(false)
          }
        })
      })
      if (result === false) return
      result = result.trim()
      if (!result) return this.$Message.info('需要填入驳回理由')
      this.doAudit('NOPASS', result)
    }
  },
  mounted () {
  }
}
</script>
<style lang="less">
@import "../form.less";
</style>
