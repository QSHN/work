<!-- 查看员工页面，不允许操作 -->
<template>
  <Card class="drag-main-card">
    <div slot="title">
      <employee-selector v-model="currentStaff"
                         :multiple="false"
                         range="createTask"
                         @change="initPage" />
    </div>
    <div class="drag-box-card">
      <div class="drag-list-wrapper">
        <div class="drag-list-con">
          <h3>待进行:{{UNPROVED.length}}</h3>
          <div class="drop-outline">
            <div class="drag-area">
              <div class="drag-list-item"
                   v-for="task in UNPROVED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </div>
          </div>
        </div>
        <div class="drag-list-con">
          <h3>进行中:{{PROCEED.length}}</h3>
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
          <h3>已完成:{{ACCOMPLISH.length}}
            <a @click="moreList('ACCOMPLISH')"
               href="#">查看</a>
          </h3>
          <div class="drop-outline">
            <div class="drag-area">
              <div class="drag-list-item"
                   v-for="task in ACCOMPLISH"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </div>
          </div>
        </div>
        <div class="drag-list-con">
          <h3>未完成:{{UNACCOMPLISHED.length}}
            <a @click="moreList('UNACCOMPLISHED')"
               href="#">查看</a>
          </h3>
          <div class="drop-outline">
            <div class="drag-area">
              <div class="drag-list-item"
                   v-for="task in UNACCOMPLISHED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <task-list ref="taskList"
               :title="listTitle"
               :loading="listLoading"
               :err="listErr"
               :tasks="taskList" />
  </Card>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import DragTask from './components/drag-task.vue'
import TaskList from './components/list.vue'
import EmployeeSelector from '_c/employees/selector.vue'
import { myTaskList, searchTask } from '@/api/task'
export default {
  name: 'taskstaff',
  components: {
    DragTask,
    TaskList,
    EmployeeSelector
  },
  data () {
    return {
      // 员工搜索
      currentStaff: '',
      UNPROVED: [],
      PROCEED: [],
      ACCOMPLISH: [],
      UNACCOMPLISHED: [],

      taskList: [],
      listTitle: '',
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
    initPage () {
      myTaskList({ executorId: this.currentStaff }).then(res => {
        if (!res.data) {
          return null
        }

        Object.assign(this.$data, res.data)
      })
    },
    async moreList (state) {
      this.listTitle = (state === 'UNACCOMPLISHED' ? '未完成' : '已完成') + '列表'
      this.listLoading = true
      this.$refs.taskList.show()

      try {
        let rst = await searchTask({ executorId: this.currentStaff, taskStatus: state })
        this.taskList = rst.data
      } catch (error) {
        console.error('Error in searchTask', error)
        this.listErr = true
      } finally {
        this.listLoading = false
      }
    }
  }
}
</script>
<style lang="less">
@import "./drag.less";
</style>
