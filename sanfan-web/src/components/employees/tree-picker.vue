<!-- ==========部门或员工选择器，在考勤组设置那里用到============== -->
<template>
  <Modal v-model="showModal"
         width="900"
         @on-ok="submit"
         @on-cancel="cancel">
    <p slot="header">{{title}} <span class="tree-tips"> {{multiple ? '可多选' : '只单选'}} </span></p>

    <Alert class="selectedTags">
      <h3>已选择的对象：</h3>

      <Tag v-for="(item, idx) in selected"
           :key="idx"
           :name="idx"
           type="border"
           :color="getTagInfo(item,'color')"
           @on-close="delSelectedTag"
           closable>
        <Icon :type="getTagInfo(item,'icon')" />
        <span> {{item.targetName}} </span>
      </Tag>
    </Alert>

    <Divider />

    <Row>
      <Col span="12">
      <h2>部门</h2>
      <div class="company-tree-view">
        <Tree ref="tree"
              :data="root"
              :render="renderContent"
              children-key="children"></Tree>
      </div>
      </Col>
      <Col span="12">
      <h2>员工</h2>
      <ul class="employee-list">
        <li v-for="(p, idx) in employeeList"
            :key="idx"
            class="employee-item"
            @click="selectItem(p, 'EMPLOYEE')">
          <Icon :type=" isSelected(p) ? 'md-checkbox' : 'md-square-outline'"
                :color=" isSelected(p) ? '#2d8cf0' : '#dcdee2'" />
          <span> {{p.name}} </span>
        </li>
      </ul>
      <h3 v-if="employeeList.length === 0"> 该部门无员工 </h3>
      </Col>
    </Row>
  </Modal>
</template>
<script>
import { mapGetters } from 'vuex'
// import * as employeeApi from '../../api/employee'
import { getOrganizationTree } from '../../api/company'

/**
 * selectList selected 应如下格式
 *
  [
    {
      targetId: '402880086950ab4c016950b1a4460002', // 人员或者是部门ID
      targetName: '管理员', // 人员或者是部门名称
      attendanceTargetType: 'EMPLOYEE' // EMPLOYEE("员工"), DEPARTMENT("部门")
    },
    {
      targetId: '402880086950ab4c016950b1a4380001',
      targetName: '总经办',
      attendanceTargetType: 'DEPARTMENT'
    }
  ]
 *
 *
 *
 */

const TAG_PICKERS = {
  'EMPLOYEE': {
    color: 'primary',
    icon: 'md-person'
  },
  'DEPARTMENT': {
    color: 'warning',
    icon: 'md-people'
  }
}

export default {
  name: 'EmployeeTreePicker',
  props: {
    'title': {
      type: String,
      default: () => '选择部门或员工'
    },
    // 提供已勾选了的值
    'selectList': {
      type: Array,
      default: () => []
    },
    // 多选
    'multiple': {
      type: Boolean,
      default: () => false
    },
    // 默认整个公司组织架构 不定义不生效
    'departmentId': {
      type: Object,
      default: () => null
    }
  },
  data: () => {
    return {
      showModal: false,
      root: [],
      // 已选择列表
      selected: [],
      employeeList: []
    }
  },
  watch: {
    selectList (val) {
      // console.log('New Tree selectList  %o', val)
      // 拷贝已选择的值
      this.selected = val.slice(0)
    }

  },
  computed: {
    ...mapGetters([])
  },
  mounted () {
    let self = this
    getOrganizationTree(self.departmentId)
      .then(rst => {
        if (!rst.data) throw new Error('组件架构为空')
        self.root = [rst.data]
      })
      .catch(error => {
        console.error('Error In mounted EmployeeTreePicker: %o', error)
        this.$Message.error('初始化错误')
      })

    if (this.selectList && this.selectList.length) this.selected = this.selectList.slice(0)
  },
  methods: {
    // 父级对象通过$ref.xxx.show()弹窗
    show () {
      this.showModal = true
    },
    isSelected (data) {
      return this.selected.some(item => item.targetId === data.id)
    },
    selectItem (data, type) {
      if (!data || !data.id || !type) return
      // 不重复添加
      if (this.isSelected(data)) return
      this.selected.push({
        targetId: data.id,
        targetName: data.name,
        attendanceTargetType: type
      })
    },

    delSelectedTag (event, idx) {
      this.selected.splice(idx, 1)
    },

    listEmployees (data) {
      if (data.employees && data.employees.length) {
        this.employeeList = data.employees
      } else {
        this.employeeList = []
      }
    },

    getTagInfo (data, key) {
      if (!data || !data.attendanceTargetType) return ''
      let item = TAG_PICKERS[data.attendanceTargetType]
      if (!item) return ''
      return item[key]
    },

    renderContent (h, { root, node, data }) {
      const isSelected = this.isSelected(data)
      let self = this
      return h('span',
        {
          class: ['node']
        },
        [
          h('Icon', {
            props: {
              type: isSelected ? 'md-checkbox' : 'md-square-outline',
              color: isSelected ? '#2d8cf0' : '#dcdee2'
            },
            on: {
              click: () => self.selectItem(data, 'DEPARTMENT')
            },
            class: ['icon-check']
          }),
          h('span', {
            class: ['department-name'],
            on: {
              click: () => {
                self.listEmployees(data)
              }
            }
          }, data.name)
        ]
      )
    },

    // 点击确定
    submit () {
      if (!this.multiple && this.selected.length > 1) {
        this.$Message.warning('只能单选')
        this.$emit('submit', [])
        return false
      }
      // 将勾选的节点抛出
      this.$emit('submit', this.selected)
    },
    // 点击取消
    cancel () {
      this.$emit('cancel')
    }
  }

}
</script>
<style lang="less">
.tree-tips {
  display: inline-block;
  margin-left: 1em;
  color: #ff9900;
}

.company-tree-view {
  .node {
    display: inline-block;
    width: 100%;
    line-height: 1.2em;
    font-size: 16px;

    .icon-check {
      margin: 0 0.5em;
      cursor: pointer;
    }

    &:hover {
      background: #f0f0f0;
    }
  }
}

.employee-list {
  // padding-left: 20px;
  // border-left: 1px solid #eee;

  .employee-item {
    list-style: none;
    font-size: 16px;
    line-height: 1.6em;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>
