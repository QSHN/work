<template>
  <div>
    <Card width="900"
          :padding="5">
      <div style="max-width: 1200px;"
           slot="title">
        <Row :gutter="16">
          <Col span="8">
          <Input v-model="filter.taskNumber"
                 placeholder="任务编号" />
          </Col>
          <Col span="8">
          <Select v-model="filter.taskTypeId"
                  placeholder="选择任务类型">
            <Option v-for="tp in taskTypes"
                    :value="tp.id"
                    :key="tp.id">{{tp.name}}</Option>
          </Select>
          </Col>
          <Col span="8">
          <Select v-model="filter.level"
                  placeholder="选择任务级别">
            <Option v-for="(item, k) in TASK_LEVELS"
                    :value="k"
                    :key="k">{{item.title}}</Option>
          </Select>
          </Col>

        </Row>
        <div> &nbsp; </div>
        <Row :gutter="16">

          <Col span="8">
          <employee-selector v-model="filter.executorId"
                             :multiple="false"
                             placeholder="发起人"
                             :range=" getUserInfo.role === 'SUPERADMIN' ? 'allEmployee' : 'allDepartmentEmployee'" />
          </Col>
          <Col span="8">
          <employee-selector v-model="filter.auditUserId"
                             :multiple="false"
                             placeholder="审批人"
                             :range=" getUserInfo.role === 'SUPERADMIN' ? 'allEmployee' : 'directlyAdmin'" />
          </Col>
          <Col span="8">
          <employee-selector v-model="filter.createId"
                             :multiple="false"
                             placeholder="办理人"
                             :range=" getUserInfo.role === 'SUPERADMIN' ? 'allEmployee' : 'allDepartmentEmployee'" />
          </Col>
        </Row>
        <div> &nbsp; </div>
        <Row :gutter="16">
          <Col span="8">
          <DatePicker type="datetimerange"
                      format="yyyy-MM-dd HH:mm"
                      style="min-width: 300px;"
                      placeholder="创建时间"
                      v-model="filter.createTime" />
          </Col>
          <Col span="8">
          <DatePicker type="datetimerange"
                      format="yyyy-MM-dd HH:mm"
                      style="min-width: 300px;"
                      placeholder="截止时间"
                      v-model="filter.endTime" />
          </Col>
          <Col span="8">
          <Button type="success"
                  @click="search">搜索</Button>
          </Col>
        </Row>
      </div>
      <Spin v-if="spinShow"
            size="large"
            fix />
      <Alert v-show="err"
             type="error">列表加载失败</Alert>

      <h2 v-show="!tasks.length && !err">暂无相关任务</h2>

      <div class="drag-tasks-flex"
           v-show="tasks.length">
        <div class="drag-list-item"
             v-for="task in tasks"
             :key="task.id">
          <drag-task :task="task" />
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import EmployeeSelector from '_c/employees/selector.vue'
import DragTask from './components/drag-task.vue'
import { searchTask } from '@/api/task'
import { TASK_LEVELS } from './task.consts.js'

export default {
  name: 'tasksearch',
  components: {
    EmployeeSelector,
    DragTask
  },
  props: {},
  data () {
    return {
      TASK_LEVELS: TASK_LEVELS,
      tasks: [],
      spinShow: false,
      err: false,
      filter: {

      }
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'taskTypes'
    ])

  },
  methods: {
    ...mapActions([
      'initTaskTypes'
    ]),

    async search () {
      console.dir(this.filter)

      this.spinShow = true

      let flt = Object.assign({}, this.filter)

      if (this.filter.createTime[0]) flt.createStartTime = new Date(this.filter.createTime[0]).toHawkString().substr(0, 16)
      if (this.filter.createTime[1]) flt.createEndTime = new Date(this.filter.createTime[1]).toHawkString().substr(0, 16)
      if (this.filter.endTime[0]) flt.endStartTime = new Date(this.filter.endTime[0]).toHawkString().substr(0, 16)
      if (this.filter.endTime[1]) flt.endEndTime = new Date(this.filter.endTime[1]).toHawkString().substr(0, 16)

      delete flt.createTime
      delete flt.endTime

      try {
        let rst = await searchTask(flt)

        if (!rst) throw new Error('Unknow Error In deleteTask')

        this.tasks = rst.data
      } catch (err) {
        console.error('in cancelTask', err)
        this.err = true
      } finally {
        this.spinShow = false
      }
    }
  },
  created () {
    this.initTaskTypes()
  }
}
</script>
<style lang="less">
@import "./drag.less";
</style>
