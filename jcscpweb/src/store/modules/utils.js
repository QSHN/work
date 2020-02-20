import { getOssRole } from '@/api/utils'

const state = {
  uploadConf: {
    region: null,
    accessKeyId: null,
    accessKeySecret: null,
    bucket: null,
    stsToken: null
  }
}

const mutations = {
  SET_UPLOAD_CONF: (state, uploadConf) => {
    state.uploadConf = {
      region: uploadConf.oss.region,
      accessKeyId: uploadConf.credentials.AccessKeyId,
      accessKeySecret: uploadConf.credentials.AccessKeySecret,
      stsToken: uploadConf.credentials.SecurityToken,
      bucket: uploadConf.oss.bucket
    }
  }
}

const actions = {
  // 获取aliyun权限
  getOssRole({ commit }) {
    return new Promise((resolve, reject) => {
      getOssRole().then(res => {
        commit('SET_UPLOAD_CONF', res)
        setInterval(() => {
          getOssRole().then(res => {
            commit('SET_UPLOAD_CONF', res)
          })
        }, 30 * 60 * 1000)
        resolve()
      }).catch(error => {
        reject(error)
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

