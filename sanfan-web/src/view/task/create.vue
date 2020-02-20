<template >
  <div class="task-form">
    <Spin v-if="spinShow"
          size="large"
          fix />
    <Card :title="isEdit ? '编辑任务' : '添加任务'"
          :bordered="false"
          style="width: 800px"
          dis-hover>
      <Form ref="task"
            :model="task"
            :rules="rule"
            :label-width="80">

        <FormItem v-show="isEdit"
                  label="任务编号:"
                  prop="taskNumber">
          <Input v-model="task.taskNumber"
                 readonly />
        </FormItem>

        <FormItem label="办理人:"
                  prop="executorId">
          <employee-selector v-model="task.executorId"
                             :multiple="false"
                             @change="changeExecutor"
                             range="createTask" />
        </FormItem>

        <FormItem label="审批人:"
                  prop="auditUserListIds">
          <employee-dynamic-selector v-model="task.auditUserListIds"
                                     :userID="task.executorId"
                                     :multiple="true"
                                     range="directlyAdmin" />
        </FormItem>

        <FormItem label="任务类型:"
                  prop="taskTypeId">
          <Select v-model="task.taskTypeId"
                  placeholder="选择任务类型">
            <Option v-for="tp in taskTypes"
                    :value="tp.id"
                    :key="tp.id">{{tp.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="任务等级:"
                  prop="level">
          <RadioGroup v-model="task.level">
            <Radio v-for=" (item, k) in TASK_LEVELS"
                   :key="k"
                   :label="k">
              <Tag :color="item.color">{{item.title}}</Tag>
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="截止时间:"
                  prop="endTime">
          <DatePicker type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      :options="dateOptiopn"
                      v-model="task.endTime" />
        </FormItem>

        <FormItem label="任务内容:"
                  prop="content">
          <Input v-model="task.content"
                 type="textarea"
                 :autosize="{minRows: 3}"
                 placeholder="请填写任务内容" />
        </FormItem>

        <FormItem label="任务照片">
          <upload-pic v-model="task.photos" />
        </FormItem>

        <FormItem>
          <Button type="success"
                  size="large"
                  @click="handleSubmit('task')"> {{isEdit ? '编辑' : '分配'}}任务</Button>
        </FormItem>

      </Form>
    </Card>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'dayjs'
import EmployeeSelector from '_c/employees/selector.vue'
import EmployeeDynamicSelector from '_c/employees/dynamic-selector.vue'
import UploadPic from '_c/upload/upload-pic'
import { createOne, update, taskDetail } from '@/api/task'
import { TASK_LEVELS } from './task.consts.js'

export default {
  name: 'taskcreate',
  components: {
    EmployeeSelector,
    EmployeeDynamicSelector,
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
      TASK_LEVELS: TASK_LEVELS,
      // 加载中
      spinShow: false,
      // 是否是编辑页面
      isEdit: false,
      // 审批人列表提交后需要缓存
      lastAuditUserListIds: [],
      task: {
        taskNumber: '',
        content: '',
        endTime: '',
        taskTypeId: '',
        taskTypeName: '',
        level: '',
        auditStatus: '',
        taskStatus: '',
        result: null,
        accomplishTime: null,
        summarize: null,
        summarizePhotos: [],
        photos: [],
        auditUserListIds: [],
        executorId: '',
        executorName: '',
        createId: '',
        createName: '',
        id: '',
        createTime: ''
      },
      rule: {
        taskTypeId: [
          { required: true, message: '请选择一种任务类型', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择一种任务等级', trigger: 'change' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请选择截至时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写任务内容', trigger: 'blur' }
        ],
        executorId: [
          { required: true, message: '请选择一名办理人' }
        ],
        auditUserListIds: [
          { required: true, type: 'array', message: '请选择一名审批人' }
        ]
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
      this.spinShow = true
      taskDetail(val).then(res => {
        console.log('get detail', res)
        this.task = res.data
        this.task.auditUserListIds = this.task.auditUserList.map(p => p.id)
        this.isEdit = true
      }).catch(err => {
        console.error(err)
        this.$Message.error('获取信息失败')
      }).then(() => {
        this.spinShow = false
      })
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'taskTypes'
    ])

  },
  methods: {
    ...mapMutations([
      'setHasUpdateTask',
      'closeTag'
    ]),

    ...mapActions([
      'initTaskTypes'
    ]),

    changeExecutor () {
      this.$set(this.task, 'auditUserListIds', [])
    },

    async handleSubmit () {
      const valid1 = await new Promise(resolve => {
        this.$refs.task.validate(async valid => resolve(valid))
      })

      if (!valid1) return this.$Message.error('请正确填写必填项')

      let action = this.isEdit ? update : createOne

      this.spinShow = true

      this.task.endTime = new Date(this.task.endTime).toHawkString()
      // 不能在此页面调整任务状态
      delete this.task.auditStatus
      delete this.task.taskStatus

      try {
        let rst = await action(this.task)
        if (!rst) throw new Error('发生错误')

        this.$Message.success('提交成功')
        // 全局更新
        this.setHasUpdateTask(true)

        if (!this.isEdit) {
          this.lastAuditUserListIds = this.task.auditUserListIds

          Object.assign(this.task, rst.data)

          console.log('endTime Fix', this.task.endTime)

          if (!this.task.auditUserListIds || !this.task.auditUserList) {
            this.task.auditUserListIds = this.lastAuditUserListIds
          } else if (this.task.auditUserList && this.task.auditUserList.length) {
            this.task.auditUserListIds = this.task.auditUserList.map(p => p.id)
          }

          this.isEdit = true
        }
      } catch (error) {
        console.error(error)
        this.$Message.error('提交失败')
      } finally {
        this.spinShow = false
        // 控件格式要求进行调整
        this.task.endTime = new Date(this.task.endTime)
      }
    }

  },
  created () {
    this.initTaskTypes()
  }
}
</script>
<style lang="less" scoped>
@import "./form.less";
</style>
