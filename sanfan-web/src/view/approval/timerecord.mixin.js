import * as CONSTS from './timerecord.consts'

export default {
  data () {
    return {
      consts: CONSTS
    }
  },
  computed: {
    textClr () {
      return this.record.attendanceStatus === 'NORMAL' &&
        this.record.positioningType === 'NORMAL'
        ? '#17233d'
        : '#ed4014'
    },
    workStr () {
      let obj = this.consts.ATTENDANCE_WORK[this.record.attendances]
      if (obj) return obj.title
      return ''
    },
    attendancesStr () {
      let obj
      if (this.record.attendanceStatus === 'NORMAL') {
        obj = this.consts.ATTENDANCE_WORK[this.record.attendances]
      } else {
        obj = this.consts.ATTENDANCE_STATUS[this.record.attendanceStatus]
      }
      if (obj) return obj.title
      return ''
    },
    auditStatusClr () {
      let obj = this.consts.AUDIT_STATUS[this.record.auditStatus]
      if (obj) return obj.color
      return ''
    },
    auditStatusStr () {
      let obj = this.consts.AUDIT_STATUS[this.record.auditStatus]
      if (obj) return obj.title
      return ''
    },
    positionStr () {
      if (this.record.attendanceType === 'OUT') {
        return this.record.positioningType === 'UNKNOWN'
          ? '外出定位失败'
          : '外出'
      } else {
        let obj = this.consts.POSITIONING_TYPE[this.record.positioningType]
        if (obj) return obj.title
        return ''
      }
    },
    // 是否审核
    isAuditing () {
      return (
        this.record.auditStatus === 'UNAUDITED' &&
        this.getUserInfo.id !== this.record.employeeId
      )
    }
  }
}
