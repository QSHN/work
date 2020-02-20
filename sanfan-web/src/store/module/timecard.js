import { getTemplateList, saveTemplate, templateDetail } from '@/api/attendance'

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日']

export default {
  state: {
    timecardList: [],
    currentTimecard: null
  },

  getters: {
    timecardList: state => state.timecardList,
    currentTimecard: state => state.currentTimecard
  },

  mutations: {
    setCurrentTimecard (state, data) {
      state.currentTimecard = Object.assign({}, data)
    }
  },

  actions: {
    // 下面的action都不catch,异常外抛
    async getTimecardList ({ state }) {
      let rst = await getTemplateList()
      if (rst && rst.data) {
        state.timecardList = rst.data
        return state.timecardList
      }
      return []
    },
    async getTimecard ({ commit }, id) {
      let rst = await templateDetail(id)
      if (rst && rst.data) {
        commit('setCurrentTimecard', rst.data)
        return rst.data
      }
      return null
    },
    async saveTimecard ({ dispatch }, data) {
      let rst = await saveTemplate(data)
      if (rst) {
        // 异步更新
        dispatch('getTimecardList')
        return data
      }
      return null
    },
    // 格式化后的列表，会影响state的列表
    // 获取格式化后的列表
    timecardListFormated ({ state }) {
      state.timecardList.forEach(tc => {
        let cnt = []
        tc.workDays = ''
        tc.workTimes = ''
        tc.location = '不限制打卡地点'
        tc.owners = ''
        // 多个考勤时间
        if (tc.attendanceDateDTOList && tc.attendanceDateDTOList.length) {
          for (const td of tc.attendanceDateDTOList) {
            if (td.days && td.days.length) {
              for (const d of td.days) {
                if (!cnt.includes(d)) cnt.push(d)
              }
            }

            if (td.attendanceTimeDTOList && td.attendanceTimeDTOList.length) {
              for (let i = 0; i < td.attendanceTimeDTOList.length; i++) {
                tc.workTimes +=
                  td.attendanceTimeDTOList[i].startTime +
                  '-' +
                  td.attendanceTimeDTOList[i].endTime
                tc.workTimes +=
                  i === td.attendanceTimeDTOList.length - 1 ? '； ' : '、 '
              }
            }
          }
        }
        tc.workDays = WEEK_DAYS.filter((v, index) =>
          cnt.includes(index + 1)
        ).join('、 ')

        if (tc.addressDTOList && tc.addressDTOList.length) {
          tc.location = ''
          for (const ta of tc.addressDTOList) {
            tc.location +=
              (ta.addresskeyword ? ta.addresskeyword : ta.address) + '； '
          }
        }

        if (
          tc.attendancePersonnelDTOList &&
          tc.attendancePersonnelDTOList.length
        ) {
          for (const tp of tc.attendancePersonnelDTOList) {
            tc.owners += tp.targetName + '； '
          }
        }

        // return tc
      })

      return state.timecardList
    }
  }
}
