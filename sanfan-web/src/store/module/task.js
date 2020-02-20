export default {
  state: {
    hasUpdateTask: false,
    taskTypes: null,
    taskTypesUpdating: false
  },

  getters: {
    hasUpdateTask: state => state.hasUpdateTask,
    taskTypes: state => state.taskTypes
  },

  mutations: {
    setHasUpdateTask (state, status) {
      state.hasUpdateTask = status
    },
    initTaskTypes (state, types) {
      state.taskTypes = types
    },
    updating (state, { key, value }) {
      state[key] = value
    }
  },

  actions: {
    async initTaskTypes ({ state, getters, dispatch, commit }) {
      if (state.taskTypesUpdating) return
      if (state.taskTypes && state.taskTypes.length) return

      let types = getters.settingType('TASK_TYPE')

      if (!types || !types.length) {
        commit('updating', { key: 'taskTypesUpdating', value: true })
        await dispatch('getCompanySetting', 'TASK_TYPE')
        commit('updating', { key: 'taskTypesUpdating', value: false })
        types = getters.settingType('TASK_TYPE')
      }

      commit('initTaskTypes', types)
    }
  }
}
