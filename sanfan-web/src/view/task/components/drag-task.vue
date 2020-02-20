<template>
  <div @click="openDetail">
    <Card class="drag-item"
          :style="{'border-left-color':levelBgColor}">
      <div class="task-head"
           slot="title">
        <div class="item-name">{{task.taskNumber}}.{{task.taskTypeName}}</div>
        <div class="item-time"
             :style="{'color':statusColor}">截止：{{task.endTime}}</div>
      </div>
      <div class="task-executor">
        <div class="item-executor">办理人：{{task.executorName}}</div>
        <div class="item-status"
             :style="{'color':statusColor}"
             v-text="statusTitle"></div>
      </div>
      <div class="task-content">
        <div class="item-content">任务内容：{{task.content}} </div>
        <div class="item-status"
             :style="{'color':auditColor}"
             v-text="auditTitle"></div>
      </div>
    </Card>
    <Modal v-model="showAudit"
           footer-hide
           width="860">
      <task-audit :id="auditId"
                  @closeAudit="closeAudit"
                  @openEdit="openEdit" />
    </Modal>
    <Modal v-model="showCreate"
           footer-hide
           width="860">
      <task-create :id="editId" />
    </Modal>

  </div>
</template>
<script>
import mixin from '../task.mixin'
import TaskAudit from './audit.vue'
import TaskCreate from '../create.vue'

export default {
  name: 'DragTask',
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  mixins: [mixin],
  // !!!!!!!!!!!!!!!!!!!!!!有混入!!!!!!!!!!!!!!!!!!
  components: {
    'task-audit': TaskAudit,
    'task-create': TaskCreate
  },
  props: {
    'task': {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showAudit: false,
      showCreate: false,
      // Id置空是为了延迟加载。否则列表同时触发大量请求
      auditId: null,
      editId: null
    }
  },
  methods: {
    openDetail () {
      this.showAudit = true
      this.showCreate = false
      this.auditId = this.task.id
    },
    closeAudit () {
      this.showAudit = false
    },
    openEdit () {
      this.showAudit = false
      this.showCreate = true
      this.editId = this.task.id
    }
  }
}
</script>
<style lang="less">
.drag-item {
  min-width: 300px;
  max-width: 600px;
  border-left: 5px solid #fff;
  &:hover {
    border-color: #5cadff;
  }
}

.task-head,
.task-executor,
.task-content {
  display: flex;
  justify-content: space-between;
}

.task-head {
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.task-content {
  color: rgba(153, 153, 153, 1);
}

.item-content {
  width: 80%;
  font-size: 12px;
  text-overflow: ellipsis;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

// .item-status-red {
//   color: #ff715a;
// }
// .item-status-green {
//   color: #01b38b;
// }
// .item-status-orange {
//   color: #f5a623;
// }
</style>
