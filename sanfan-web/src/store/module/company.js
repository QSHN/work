import {
  getOrganizationTree,
  getContacts,
  getCompanySetting,
  setCompanySetting,
  addCompanySetting,
  delCompanySetting,
  getCompany
} from '@/api/company'
import { getCityData } from '@/api/common'

const listD = d => {
  let list =
    d &&
    d.children &&
    d.children.slice(0).concat(
      d.children.reduce((accum, s) => {
        return accum.concat(listD(s))
      }, [])
    )
  return list || []
}

export default {
  state: {
    organization: null,
    contacts: [],
    POSITION: [],
    CLIENT_LEVEL: [],
    CLIENT_TYPE: [],
    INTENTION_TYPE: [],
    PHOTO_TYPE: [],
    TASK_TYPE: [],
    LEAVE_TYPE: [],
    REIMBURSEMENT_TYPE: [],
    cityData: [],
    myCompany: {}
  },
  getters: {
    organization: state => state.organization,
    contacts: state => state.contacts,
    departmentById: state => departmentId => {
      let dList = listD(state.organization).filter(d => d.id === departmentId)
      return dList.length > 0 ? dList[0] : null
    },
    who: state => uId => {
      let person = null
      state.contacts.forEach(p => {
        if (p.id === uId) {
          person = p
        }
      })
      return person
    },
    myCompany: state => state.myCompany,
    personnel: state => state.contacts,
    clientLevel: state => state.CLIENT_LEVEL,
    clientType: state => state.CLIENT_TYPE,
    clientIntention: state => state.INTENTION_TYPE,
    settingType: state => type => state[type],
    cityData: state => state.cityData
  },
  mutations: {
    updateOrg (state, data) {
      state.organization = data
    },
    updateContacts (state, data) {
      state.contacts = data
    },
    myCompany (state, data) {
      state.myCompany = data
    }
  },
  actions: {
    getOrganizationTree ({ commit }) {
      return new Promise((resolve, reject) => {
        getOrganizationTree()
          .then(res => {
            commit('updateOrg', res.data)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getContacts ({ commit }) {
      return new Promise((resolve, reject) => {
        getContacts({
          searchText: ''
        })
          .then(res => {
            commit('updateContacts', res.data)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCompanySetting ({ state }, type) {
      return new Promise((resolve, reject) => {
        getCompanySetting(type)
          .then(res => {
            state[type] = res.data
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCompany ({ state, commit }, type) {
      return new Promise((resolve, reject) => {
        getCompany(type)
          .then(res => {
            commit('myCompany', res.data)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    setCompanySetting ({ dispatch }, { type, id, name }) {
      return new Promise((resolve, reject) => {
        setCompanySetting({ id, name })
          .then(() => {
            dispatch('getCompanySetting', type).then(() => resolve())
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addCompanySetting ({ dispatch }, { type, name }) {
      return new Promise((resolve, reject) => {
        addCompanySetting({ type, name })
          .then(() => {
            // 新增之后没有返回ID，比较麻烦
            dispatch('getCompanySetting', type).then(() => resolve())
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    delCompanySetting ({ dispatch }, { type, id }) {
      return new Promise((resolve, reject) => {
        delCompanySetting(id)
          .then(() => {
            dispatch('getCompanySetting', type).then(() => resolve())
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCityData ({ state }) {
      return new Promise((resolve, reject) => {
        getCityData()
          .then(res => {
            let data = res.data
            let dir = list => {
              list.forEach(item => {
                if (item.children) {
                  dir(item.children)
                } else {
                  delete item.children
                }
              })
            }
            dir(data)
            state.cityData = data
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
