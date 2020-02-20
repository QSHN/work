export const TASK_LEVELS = {
  GENERAL: {
    title: '普通',
    class: 'default',
    color: '#2db7f5',
    bgcolor: '#ffffff'
  },
  URGENT: {
    title: '紧急',
    class: 'warning',
    color: '#ff9900',
    bgcolor: '#ff9900'
  },
  HIGHEST: {
    title: '非常紧急',
    class: 'error',
    color: '#ed4014',
    bgcolor: '#ed4014'
  }
}

export const TASK_STATUS = {
  PROCEED: {
    title: '进行中',
    class: 'primary',
    color: '#2d8cf0',
    bgcolor: '#2d8cf0'
  },
  UNPROVED: {
    title: '待进行',
    class: 'default',
    color: '#808695',
    bgcolor: '#2db7f5'
  },
  ACCOMPLISH: {
    title: '已完成',
    class: 'success',
    color: '#19be6b',
    bgcolor: '#19be6b'
  },
  UNACCOMPLISHED: {
    title: '未完成',
    class: 'error',
    color: '#ed4014',
    bgcolor: '#ed4014'
  },
  // 额外添加的状态，目前仅由前端判断
  OVERTIME: {
    title: '已超时',
    class: 'warning',
    color: '#ff9900',
    bgcolor: '#ff9900'
  }
}

export const AUDIT_STATUS = {
  PASS: {
    title: '已审核',
    class: 'success',
    color: '#19be6b',
    bgcolor: '#19be6b'
  },
  NOPASS: {
    title: '驳回',
    class: 'error',
    color: '#ed4014',
    bgcolor: '#ed4014'
  },
  UNFINISHED: {
    title: '标记未完成',
    class: 'error',
    color: '#ed4014',
    bgcolor: '#ed4014'
  },
  UNAUDITED: {
    title: '未审核',
    class: 'default',
    color: '#808695',
    bgcolor: '#2db7f5'
  },
  DELAYFINISHED: {
    title: '延时让其完成',
    class: 'warning',
    color: '#ff9900',
    bgcolor: '#ff9900'
  }
}
