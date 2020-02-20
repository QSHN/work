<template>
  <Card class="drag-main-card">

    <Alert show-icon>
      <span class="info-head">记得要及时点击处理第二栏的任务结果哦</span>
      <Button type="success"
              @click="goStaff">查看员工</Button>
    </Alert>

    <div class="drag-box-card">
      <div class="drag-list-wrapper">
        <div class="drag-list-con">
          <h3> 员工任务进行中:{{PROCEED.length}}</h3>
          <div class="drop-outline">
            <div class="drag-area">
              <div class="drag-list-item"
                   v-for="task in PROCEED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </div>
          </div>
        </div>
        <div class="drag-list-con">
          <h3>任务结果待处理:{{RESULT.length}}</h3>
          <div class="drop-outline">
            <div class="drag-area">
              <div class="drag-list-item"
                   v-for="task in RESULT"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </div>
          </div>
        </div>
        <div class="drag-list-con">
          <h3>任务已审批:{{APPROVED.length}}
            <a @click="moreList"
               href="#">查看</a>
          </h3>
          <div class="drop-outline">
            <div class="drag-area">
              <div class="drag-list-item"
                   v-for="task in APPROVED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <task-list ref="taskList"
               title="已审批列表"
               :loading="listLoading"
               :err="listErr"
               :tasks="taskList" />

  </Card>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import DragTask from './components/drag-task.vue'
import TaskList from './components/list.vue'
import { taskManager, searchTaskByAuditStatus } from '@/api/task'
export default {
  name: 'taskmanager',
  components: {
    DragTask,
    TaskList
  },
  data () {
    return {
      PROCEED: [], // 进行中
      RESULT: [], // 待处理
      APPROVED: [], // 已审批

      taskList: [],
      listLoading: false,
      listErr: false
    }
  },
  computed: {
    ...mapGetters([
      'hasUpdateTask'
    ])
  },
  watch: {
    hasUpdateTask: {
      handler: function (bool) {
        if (bool) {
          this.initPage()
          this.setHasUpdateTask(false)
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'setHasUpdateTask'
    ]),
    goStaff () {
      this.$router.push('taskstaff')
    },
    initPage () {
      taskManager().then(res => {
        if (!res.data) {
          return null
        }

        Object.assign(this.$data, res.data)
      })
    },
    async moreList () {
      this.listLoading = true
      this.$refs.taskList.show()

      try {
        let rst = await searchTaskByAuditStatus()
        this.taskList = rst.data
      } catch (error) {
        console.error('Error in searchTaskByAuditStatus', error)
        this.listErr = true
      } finally {
        this.listLoading = false
      }
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>
<style lang="less">
@import "./drag.less";
.info-head {
  display: inline-block;
  margin-right: 2em;
}
.drag-main-card {
  min-width: 1160px;
}
.drag-list-con:nth-last-child(3):first-child,
.drag-list-con:nth-last-child(3):first-child ~ .drag-list-con {
  width: 32% !important;
}
</style>
