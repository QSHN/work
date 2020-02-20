import { getOssRole } from '@/api/utils'

export default {
  state: {
    uploadConf: {
      region: null,
      accessKeyId: null,
      accessKeySecret: null,
      bucket: null,
      stsToken: null
    }
  },
  getters: {
    uploadConf: state => state.uploadConf
  },
  mutations: {
    updateConfig: (state, uploadConf) => {
      state.uploadConf = {
        region: uploadConf.oss.region,
        accessKeyId: uploadConf.credentials.AccessKeyId,
        accessKeySecret: uploadConf.credentials.AccessKeySecret,
        stsToken: uploadConf.credentials.SecurityToken,
        bucket: uploadConf.oss.bucket
      }
    }
  },
  actions: {
    // 获取aliyun权限
    getOssRole ({ commit }) {
      return new Promise((resolve, reject) => {
        getOssRole().then(res => {
          commit('updateConfig', res.data)
          setInterval(() => {
            getOssRole().then(res => {
              commit('updateConfig', res.data)
            })
          }, 30 * 60 * 1000)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
