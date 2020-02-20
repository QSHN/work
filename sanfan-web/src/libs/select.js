export const selectData = ({ list, id, name, children }) => {
  if (!list) return []
  let allList = []
  const listFilter = (child, newList) => {
    if (child && child.length) {
      child.map((v, i) => {
        newList.push({
          id: v[id].toString(),
          name: v[name]
        })
        if (v[children]) listFilter(v[children], newList)
      })
    }
  }
  listFilter(list, allList)
  // console.log(allList)
  return allList || []
}

export const daysOfWeek = {
  displays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  values: ['1', '2', '3', '4', '5', '6', '7']
}

export const daysOfMonth = {
  displays: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号'],
  values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
}

export const times = {
  displays: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
  values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
}

export const remindTime = {
  displays: ['截止时间前1小时', '截止时间前2小时', '截止时间前4小时', '截止时间前8小时'],
  values: [60, 120, 240, 480]
}

export default {
  selectData,
  daysOfWeek,
  daysOfMonth,
  times,
  remindTime
}
