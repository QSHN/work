import axios from '@/libs/api.request'
// POST /office/file 上传文件、创建文件夹
// POST /office/file/delete 删除
// GET  /office/file/listFiles 列举文件
// POST /office/file/move 移动文件
// POST /office/file/rename 重命名

export const newFile = (data) => {
  return axios.request({
    url: '/office/file',
    method: 'post',
    data
  })
}

export const deleteFile = (data) => {
  return axios.request({
    url: '/office/file/delete',
    method: 'post',
    data
  })
}

export const listFiles = (data) => {
  return axios.request({
    url: '/office/file/listFiles',
    method: 'post',
    data
  })
}
export const move = (data) => {
  return axios.request({
    url: '/office/file/move',
    method: 'post',
    data
  })
}
export const rename = (data) => {
  return axios.request({
    url: '/office/file/rename',
    method: 'post',
    data
  })
}
