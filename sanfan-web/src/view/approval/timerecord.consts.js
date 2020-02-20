export const ATTENDANCE_TYPE = {
  IN: { title: '正常打卡' },
  OUT: { title: '外出打卡' }
}

export const ATTENDANCE_STATUS = {
  NORMAL: {
    title: '正常',
    class: 'info',
    color: '#5cadff'
  },
  LATE: {
    title: '迟到',
    class: 'error',
    color: '#ed4014'
  },
  MISSING: {
    title: '漏卡',
    class: 'error',
    color: '#ed4014'
  },
  ABSENTEEISM: {
    title: '旷工',
    class: 'error',
    color: '#ed4014'
  },
  EARLY: {
    title: '早退',
    class: 'error',
    color: '#ed4014'
  }
}

export const AUDIT_STATUS = {
  PASS: {
    title: '已通过',
    class: 'success',
    color: '#19be6b'
  },
  NOPASS: {
    title: '未通过',
    class: 'error',
    color: '#ed4014'
  },
  UNAUDITED: {
    title: '待审批',
    class: 'success',
    color: '#19be6b'
  },
  DELAYFINISHED: {
    title: '审批超时-已通过',
    class: 'success',
    color: '#19be6b'
  }
}

export const POSITIONING_TYPE = {
  OUTRAGE: {
    title: '不在范围内',
    class: 'error',
    color: '#ed4014'
  },
  UNKNOWN: {
    title: '定位失败',
    class: 'error',
    color: '#ed4014'
  },
  NORMAL: {
    title: '在定范围内',
    class: 'success',
    color: '#19be6b'
  }
}

export const ATTENDANCE_WORK = {
  GOTOWORK: { title: '上班' },
  OFFDUTY: { title: '下班' },
  UPDATE: { title: '更新' }
}
