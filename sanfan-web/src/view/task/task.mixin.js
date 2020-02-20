import * as CONSTS from './task.consts'

export default {
  data () {
    return {
      consts: CONSTS
    }
  },
  computed: {
    levelTitle () {
      return this.levelProp('title')
    },
    levelClass () {
      return this.levelProp('class')
    },
    levelColor () {
      return this.levelProp('color')
    },
    levelBgColor () {
      return this.levelProp('bgcolor')
    },
    statusTitle () {
      return this.statusProp('title')
    },
    statusClass () {
      return this.statusProp('class')
    },
    statusColor () {
      return this.statusProp('color')
    },
    statusBgColor () {
      return this.statusProp('bgcolor')
    },
    auditTitle () {
      return this.auditProp('title')
    },
    auditClass () {
      return this.auditProp('class')
    },
    auditColor () {
      return this.auditProp('color')
    },
    auditBgColor () {
      return this.auditProp('bgcolor')
    }
  },
  methods: {
    constsProp (ct) {
      return (prop, key) => {
        let obj = this.consts[ct][this.task[prop]]
        if (obj) return obj[key]
        return ''
      }
    },
    levelProp (key) {
      return this.constsProp('TASK_LEVELS')('level', key)
    },
    statusProp (key) {
      // 已超时状况，手工处理
      if (this.task.timeout) {
        let obj = this.consts.TASK_STATUS['OVERTIME']
        if (obj) return obj[key]
        return ''
      }
      return this.constsProp('TASK_STATUS')('taskStatus', key)
    },
    auditProp (key) {
      return this.constsProp('AUDIT_STATUS')('auditStatus', key)
    }
  }
}
