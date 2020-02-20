import { queryBasicInfo, updateBasicInfo } from '@/api/basicInfo'

const state = {
  basicInfo: {},
  basicData: {}
}

const mutations = {
  SET_BASIC_INFO: (state, basicData) => {
    state.basicInfo = basicData.info
    state.basicData = basicData
  }
}

const actions = {
  // 获取基础资料
  queryBasicInfo({ commit }) {
    return new Promise((resolve, reject) => {
      queryBasicInfo().then(res => {
        commit('SET_BASIC_INFO', res)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取基础资料
  updateBasicInfo({ dispatch }) {
    return new Promise((resolve, reject) => {
      updateBasicInfo().then(res => {
        dispatch('queryBasicInfo')
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

