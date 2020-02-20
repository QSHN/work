export const APPLICATION_TYPE = {
  LEAVE: { title: '请假' },
  BUSINESS_TRAVEL: { title: '出差' },
  OVERTIME: { title: '加班' }
}
export const AUDIT_STATUS = {
  PASS: {
    title: '已通过',
    class: 'success',
    color: '#19be6b'
  },
  UNPASS: {
    title: '未通过',
    class: 'error',
    color: '#ed4014'
  },
  UNAUDITED: {
    title: '待审批',
    class: 'primary',
    color: '#2d8cf0'
  },
  APPROVED: {
    title: '已审批',
    class: 'info',
    color: '#2db7f5'
  },
  // 手工添加此项
  WITHDRAW: {
    title: '已撤销',
    class: 'disabled',
    color: '#c5c8ce'
  }
}
