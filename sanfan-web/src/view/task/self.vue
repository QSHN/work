<!-- rewrite src/components/drag-list/drag-list.vue -->
<!-- 重写 src/components/drag-list/drag-list.vue 以适应三列-->
<template>
  <Card class="drag-main-card">

    <Alert show-icon>任务开始时拖到“进行中”，任务完成了拖到"已完成"</Alert>

    <div class="drag-box-card">
      <div class="drag-list-wrapper">
        <div class="drag-list-con">
          <h3>待进行:{{UNPROVED.length}}</h3>
          <draggable class="drop-outline"
                     v-model="UNPROVED"
                     group="draggroup"
                     :move="checkMove"
                     @change="handleChange($event, 'UNPROVED')"
                     @end="dragEnd()">
            <transition-group class="drag-area"
                              tag="div">
              <div class="drag-list-item"
                   v-for="task in UNPROVED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="drag-list-con">
          <h3>进行中:{{PROCEED.length}}</h3>
          <draggable class="drop-outline"
                     v-model="PROCEED"
                     group="draggroup"
                     :move="checkMove"
                     @change="handleChange($event, 'PROCEED')"
                     @end="dragEnd()">
            <transition-group class="drag-area"
                              tag="div">
              <div class="drag-list-item"
                   v-for="task in PROCEED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="drag-list-con">
          <h3>已完成:{{ACCOMPLISH.length}}
            <a @click="moreList('ACCOMPLISH')"
               href="#">查看</a>
          </h3>
          <draggable class="drop-outline"
                     v-model="ACCOMPLISH"
                     group="draggroup"
                     :move="checkMove"
                     @change="handleChange($event, 'ACCOMPLISH')"
                     @end="dragEnd()">
            <transition-group class="drag-area"
                              tag="div">
              <div class="drag-list-item"
                   v-for="task in ACCOMPLISH"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="drag-list-con">
          <h3>未完成:{{UNACCOMPLISHED.length}}
            <a @click="moreList('UNACCOMPLISHED')"
               href="#">查看</a>
          </h3>
          <draggable class="drop-outline"
                     v-model="UNACCOMPLISHED"
                     group="draggroup"
                     :move="checkMove"
                     @change="handleChange($event, 'UNACCOMPLISHED')"
                     @end="dragEnd()">
            <transition-group class="drag-area"
                              tag="div">
              <div class="drag-list-item"
                   v-for="task in UNACCOMPLISHED"
                   :key="task.id">
                <drag-task :task="task" />
              </div>
            </transition-group>
          </draggable>
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
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import DragTask from './components/drag-task.vue'
import TaskList from './components/list.vue'
import { myTaskList, changeTaskStatus, searchTask } from '@/api/task'
export default {
  name: 'taskself',
  components: {
    draggable,
    DragTask,
    TaskList
  },
  data () {
    return {
      UNPROVED: [],
      PROCEED: [],
      ACCOMPLISH: [],
      UNACCOMPLISHED: [],
      errorMove: '',

      taskList: [],
      listTitle: '',
      listLoading: false,
      listErr: false
    }
  },
  methods: {
    initPage () {
      myTaskList({ executorId: this.getUserInfo.id }).then(res => {
        if (!res.data) {
          return null
        }

        Object.assign(this.$data, res.data)
      })
    },
    handleChange (evt, st) {
      if (!evt['added']) return
      var task = evt['added'].element

      this.$Loading.start()

      changeTaskStatus({ id: task.id, taskStatus: st }).then(resp => {
        // 任务状态更新，调整显示
        task.taskStatus = st
        this.$Loading.finish()
      }).catch(error => {
        console.error(error)
        this.$Loading.error()
        this.$Modal.error({
          title: '状态变更失败，请稍后再试',
          onOk: () => {
            // 页面刷新
            this.$router.go(0)
          }
        })
      })
    },
    // 拖拽中，阻止拖拽
    checkMove ({ relatedContext, draggedContext }) {
      if (!['DELAYFINISHED', 'UNAUDITED'].includes(draggedContext.element.auditStatus)) {
        this.errorMove = '已审批不可移动'
        return false
      }
      if (new Date(draggedContext.element.endTime) < new Date()) {
        this.errorMove = '已超时不可移动'
        return false
      }
      return (
        (!relatedContext.element || !relatedContext.element.fixed) && !draggedContext.element.fixed
      )
    },
    // 非法操作提醒
    dragEnd () {
      if (this.errorMove) {
        this.$Message.warning(this.errorMove)
        this.errorMove = ''
      }
    },
    async moreList (state) {
      this.listTitle = (state === 'UNACCOMPLISHED' ? '未完成' : '已完成') + '列表'
      this.listLoading = true
      this.$refs.taskList.show()

      try {
        let rst = await searchTask({ executorId: this.getUserInfo.id, taskStatus: state })
        this.taskList = rst.data
      } catch (error) {
        console.error('Error in searchTask', error)
        this.listErr = true
      } finally {
        this.listLoading = false
      }
    }
  },
  mounted () {
    this.initPage()
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  }
}
</script>
<style lang="less">
@import "./drag.less";
</style>
