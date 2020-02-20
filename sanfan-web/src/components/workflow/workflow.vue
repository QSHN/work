<template>
  <div>
    <div class="process-list">

      <div v-for="(ap, idx) in approvalProcessDTOS"
           :key="ap.approvalNum"
           class="process-block">

        <div class="process-node">

          <div v-show="!readonly"
               @click="del(idx)"
               title="删除节点"
               class="remove-node">
            <Icon color="#ff9900"
                  size="16"
                  type="md-close-circle" />
          </div>
          <div v-show="isSuccess(ap)"
               class="success-node">
            <Icon color="#19be6b"
                  size="16"
                  type="md-checkmark-circle" />
          </div>
          <div v-show="isFaild(ap)"
               class="faild-node">
            <Icon color="#ed4014"
                  size="16"
                  type="md-remove-circle" />
          </div>
          <Avatar icon="md-person"
                  :src="ap.smallAvatar"
                  size="large" />
          <div class="node-name">{{ap.auditUserName}}</div>
          <div v-show="readonly"
               class="node-status"
               :style="'color:' + statusClr(ap)">
            {{ap[noteKey] ? ap[noteKey] : statusStr(ap)}}
          </div>
        </div>
        <div v-show="idx <= approvalProcessDTOS.length - 2"
             class="right-arrow">
          <Icon :color="isSuccess(ap) ? '#19be6b' : '#808695' "
                type="md-arrow-forward"
                size="24" />
        </div>

      </div>

      <!-- 添加按钮 -->
      <div v-if="!readonly"
           class="process-block add-btn">
        <div v-show="approvalProcessDTOS.length"
             class="right-arrow">
          <Icon color="#808695"
                type="md-arrow-forward"
                size="24" />
        </div>
        <div class="process-node">
          <Avatar icon="md-add"
                  @click.native="showAdd = true"
                  size="large" />
          <div class="node-name">添加</div>
        </div>
      </div>
    </div>
    <Modal @on-ok="add"
           v-model="showAdd"
           title="添加审核人员">
      <employee-selector v-model="employeesID"
                         :multiple="false"
                         range="allManager" />

    </Modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import EmployeeSelector from '../employees/selector.vue'
import { getAllEmployee } from '../../api/employee'

const STATUS_TYPES = {
  success: { title: '已通过', color: '#19be6b' },
  faild: { title: '已拒绝', color: '#ed4014' },
  wait: { title: '进行中', color: '#808695' }
}

export default {
  name: 'workflow',
  model: {
    'prop': 'approvalProcessDTOS',
    'event': 'change'
  },
  props: {
    // 默认值
    'approvalProcessDTOS': {
      type: Array,
      default: null
    },
    // 多选
    'multiple': {
      type: Boolean,
      default: () => true
    },
    // 可清除
    'clearable': {
      type: Boolean,
      default: () => true
    },
    // 查看状态，无法改变
    'readonly': {
      type: Boolean,
      default: false
    },
    // 状态关键词
    'statusKey': {
      type: String,
      default: () => 'applicationStatus'
    },
    // 通过关键词
    'successKeys': {
      type: Array,
      default: () => ['PASS', 'APPROVED']
    },
    // 拒绝关键词
    'faildKeys': {
      type: Array,
      default: () => ['UNPASS']
    },
    // 等待关键词
    'waitKeys': {
      type: Array,
      default: () => ['UNAUDITED']
    },
    // 当前节点说明，默认无
    'noteKey': {
      type: String,
      default: () => ''
    },
    // 允许重复节点
    'duplicateNode': {
      type: Boolean,
      default: () => false
    }

  },
  components: {
    'EmployeeSelector': EmployeeSelector
  },
  data () {
    return {
      showAdd: false,
      // 渲染使用
      employeesList: [],
      employeesID: ''
    }
  },
  mounted () {
    this.updateEmployee()
  },
  watch: {
  },
  methods: {
    ...mapActions([
      'updateSelectList'
    ]),
    // 参考 ../employees/selector.vue
    updateEmployee () {
      const key = 'allManager'
      if (this.isSelectCache(key)) {
        this.employeesList = this.getSelectCache(key)
        return
      }
      switch (key) {
        case 'allEmployee': // 获取所有公司员工
          this.load(getAllEmployee(), 'allEmployee')
          break
      }
    },
    load (api, key) {
      api.then(res => {
        this.employeesList = res.data
        this.updateSelectList({ key, value: res.data })
      })
    },
    isStatus (key) {
      return item => {
        // console.log('item %o,key %s', item, key)
        // console.log('statusList %o,status %s', this[key], item[this.statusKey])
        return this[key].includes(item[this.statusKey])
      }
    },
    isSuccess (item) {
      return this.isStatus('successKeys')(item)
    },
    isFaild (item) {
      return this.isStatus('faildKeys')(item)
    },
    isWait (item) {
      return this.isStatus('waitKeys')(item)
    },
    statusProp (key) {
      const JUGES = {
        success: { key: 'success', action: 'isSuccess' },
        faild: { key: 'faild', action: 'isFaild' },
        wait: { key: 'wait', action: 'isWait' }
      }
      let self = this
      return item => {
        // 默认是等待
        let ss = 'wait'
        for (const st in JUGES) {
          if (self[JUGES[st].action](item)) {
            ss = JUGES[st].key
            break
          }
        }
        let obj = STATUS_TYPES[ss]
        if (obj) return obj[key]
        return ''
      }
    },
    statusClr (item) {
      return this.statusProp('color')(item)
    },
    statusStr (item) {
      return this.statusProp('title')(item)
    },
    add () {
      if (!this.duplicateNode &&
        this.approvalProcessDTOS.some(p => p.auditUserId === this.employeesID)) {
        return this.$Message.error('审批人不允许重复')
      }

      let employee = this.allEmployee.find(ep => ep.id === this.employeesID)
      if (!employee) {
        employee = {
          id: this.employeesID,
          smallAvatar: '',
          name: ''
        }
      }

      this.approvalProcessDTOS.push({
        approvalNum: this.approvalProcessDTOS.length + 1,
        auditUserName: employee.name,
        smallAvatar: employee.smallAvatar,
        auditUserId: employee.id
      })
    },

    del (idx) {
      this.approvalProcessDTOS.splice(idx, 1)
      this.approvalProcessDTOS.forEach((node, j) => Object.assign({}, node, { approvalNum: j + 1 }))
    },
    handleChange (value) {
      console.log('chang', value)
      this.$emit('change', value || (Array.isArray(this.selectList) ? [] : ''))
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'myUserId',
      'getSelectCache',
      'isSelectCache',
      'allEmployee'
    ])
  }
  // created(){
  //   if (!this.isSelectCache('allEmployee')) {
  //     api.then(res => {
  //       this.updateSelectList({ key, value: res.data })
  //     })
  //   }
  // }
}
</script>
<style lang="less" scoped>
.process-list {
  display: flex;
  .process-block {
    display: flex;
  }

  .process-node {
    position: relative;
    margin: 4px 12px;
    text-align: center;
    width: 64px;
    .remove-node,
    .success-node,
    .faild-node {
      position: absolute;
      top: 24px;
      right: 0;
      z-index: 99;
    }
    .remove-node {
      cursor: pointer;
    }
    .node-name {
      // text-align: center;
    }
    .node-status {
      color: #c5c8ce;
    }
  }
  .right-arrow {
    margin: 12px 6px;
  }
}
</style>
