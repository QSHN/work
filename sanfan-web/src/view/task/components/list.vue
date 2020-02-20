<template>
  <div>
    <Modal v-model="modal"
           width="900"
           :footer-hide="true"
           :title="title + ':' + tasks.length ">
      <Spin v-if="loading"
            size="large"
            fix />
      <Alert v-show="err"
             type="error">列表加载失败</Alert>

      <h2 v-show="!tasks.length">暂无相关任务</h2>

      <div class="drag-tasks-flex"
           v-show="tasks.length">
        <div class="drag-list-item"
             v-for="task in tasks"
             :key="task.id">
          <drag-task :task="task" />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import DragTask from './drag-task.vue'
export default {
  name: 'tasklist',
  components: {
    DragTask
  },
  props: {
    title: {
      type: String,
      default: () => '任务列表'
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    tasks: {
      type: Array,
      default: () => []
    },
    err: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      modal: false
    }
  },
  methods: {
    show () {
      this.modal = true
    },
    cancel () {
      this.modal = false
    }
  }
}
</script>
<style lang="less">
@import "../drag.less";
</style>
