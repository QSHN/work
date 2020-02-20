import { leaveType } from '@/api/approval'

export default {
  state: {
    applicationType: 'LEAVE',
    applyType: 'LEAVE',
    actionType: {
      BUSINESS_TRAVEL: 'myApprovalList',
      LEAVE: 'myApprovalList',
      OVERTIME: 'myApprovalList'
    },
    leaveTypes: null
  },
  mutations: {
    setApplicationType (state, applicationType) {
      console.log('applicationType is ', applicationType)
      state.applicationType = applicationType
    },
    setApplyType (state, applyType) {
      console.log('applyType is ', applyType)
      state.applyType = applyType
    },
    setApprovalActionType (state, actionType) {
      console.log(
        'approvalActionType is %o / %o ',
        state.applicationType,
        actionType
      )
      state.actionType[state.applicationType] = actionType
    },
    setLeaveTypes (state, types) {
      state.leaveTypes = types
    }
  },
  getters: {
    approvalApplicationType: state => state.applicationType,
    approvalAppyType: state => state.applyType,
    approvalActionType: state => state.actionType[state.applicationType],
    leaveTypes: state => state.leaveTypes
  },
  actions: {
    changeApplicationActionType ({ commit }, applicationType) {
      commit('setApplicationType', applicationType)
    },
    changeApplyActionType ({ commit }, applyType) {
      commit('setApplyType', applyType)
    },
    changeApprovalActionType ({ commit }, actionType) {
      commit('setApprovalActionType', actionType)
    },
    async initLeaveType ({ state, commit }, force = false) {
      if (state.leaveTypes && !force) return

      let rst = await leaveType()

      if (!rst.data) {
        console.error('请假类型为空')
        return
      }
      commit('setLeaveTypes', rst.data)
    }
  }
}
