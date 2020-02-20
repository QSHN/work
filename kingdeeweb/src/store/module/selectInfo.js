import { querySelectInfo } from '../../api/selectInfo'
export default {
  state: {
    selectInfoList: []
  },
  getters: {
    selectInfoList: state => state.selectInfoList
  },
  mutations: {
    setSelectInfoList (state, data) {
      state.selectInfoList = data
    }
  },
  actions: {
    // 获取套账用户列表
    getSelectInfo ({ state, commit }, accountId) {
      return new Promise((resolve, reject) => {
        try {
          querySelectInfo({ accountSetId: accountId }).then(res => {
            commit('setSelectInfoList', res.data)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
