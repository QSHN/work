export default {
  state: {
    cache: {
      allDepartmentEmployee: [],
      allEmployee: [],
      departmentEmployee: [],
      directlyAdmin: [],
      directlyEmployee: [],
      financialEmployee: [],
      administrativeEmployee: [],
      allManager: []
    },
    isLoad: {
      allDepartmentEmployee: false,
      allEmployee: false,
      departmentEmployee: false,
      directlyAdmin: false,
      directlyEmployee: false,
      financialEmployee: false,
      administrativeEmployee: false,
      allManager: false
    },
    loading: {
      allDepartmentEmployee: false,
      allEmployee: false,
      departmentEmployee: false,
      directlyAdmin: false,
      directlyEmployee: false,
      financialEmployee: false,
      administrativeEmployee: false,
      allManager: false
    },
    dynamic: {
      contacts: false
    }
  },
  getters: {
    allDepartmentEmployee: state => state.cache.allDepartmentEmployee,
    allEmployee: state => state.cache.allEmployee,
    departmentEmployee: state => state.cache.departmentEmployee,
    directlyAdmin: state => state.cache.directlyAdmin,
    directlyEmployee: state => state.cache.directlyEmployee,
    financialEmployee: state => state.cache.financialEmployee,
    administrativeEmployee: state => state.cache.administrativeEmployee,
    getSelectCache: state => key => state.cache[key],
    isSelectCache: state => key => state.isLoad[key],
    isSelectLoading: state => key => state.loading[key],
    isDynamicLoading: state => key => state.dynamic[key]
  },
  mutations: {
    updateSelectList (state, { key, value }) {
      state.cache[key] = value
      state.isLoad[key] = !!value
    },
    clearSelectCache (state, key) {
      if (key) {
        state.cache[key] = []
        state.isLoad[key] = false
      } else {
        Object.keys(state.cache).forEach(key => (state.cache[key] = []))
        Object.keys(state.isLoad).forEach(key => (state.isLoad[key] = false))
      }
    },
    selectLoading (state, { key, loading }) {
      state.loading[key] = loading
    },
    dynamicLoading (state, { key, loading }) {
      state.dynamic[key] = loading
    }
  },
  actions: {
    updateSelectList: ({ state, commit }, data) => {
      commit('updateSelectList', data)
    },
    clearSelectCache: ({ state, commit }, key) => {
      commit('clearSelectCache', key)
    },
    updateLoading: async ({ state, commit }, { key, callback }) => {
      // debugger
      console.log('updateLoading Key ', key, state.loading[key])
      if (state.loading[key]) return
      commit('selectLoading', { key, loading: true })
      console.log('updating ……', key)
      await callback()
      commit('selectLoading', { key, loading: false })
    },
    updateDynamic: async ({ state, commit }, { key, callback }) => {
      if (state.dynamic[key]) return
      commit('dynamicLoading', { key, loading: true })
      await callback()
      commit('dynamicLoading', { key, loading: false })
    }
  }
}
