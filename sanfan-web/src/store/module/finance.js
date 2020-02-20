const state = {
  financeValue: {},
  financeItem: {},
  financeNew: {},
  auditRefresh: 0
}
const getters = {
  financeValue: (state) => state.financeValue,
  financeItem: (state) => state.financeItem,
  financeNew: (state) => state.financeNew,
  auditRefresh: (state) => state.auditRefresh
}
const actions = {
  financeValueChange: async ({ dispatch, commit }, data) => {
    commit('SET_FINANCE_VALUE', data)
  },
  financeItemChange: async ({ dispatch, commit }, data) => {
    commit('SET_FINANCE_ITEM', data)
  },
  financeNewChange: async ({ dispatch, commit }, data) => {
    commit('SET_FINANCE_NEW', data)
  },
  handlerAuditRefresh: ({ dispatch, commit }, data) => {
    commit('AUDIT_REFRESH')
  }
}
const mutations = {
  SET_FINANCE_VALUE: (state, data) => {
    state.financeValue = data
  },
  SET_FINANCE_ITEM: (state, item) => {
    state.financeItem = item
  },
  SET_FINANCE_NEW: (state, item) => {
    state.financeNew = item
  },
  AUDIT_REFRESH: (state, item) => {
    state.auditRefresh = Date.now()
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
