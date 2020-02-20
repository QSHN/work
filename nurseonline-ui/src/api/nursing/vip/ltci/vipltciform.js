/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/nursing/vcs/vip/ltci/form',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/vcs/vip/ltci/form',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/vcs/vip/ltci/form' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/vcs/vip/ltci/form' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return stateAction(obj, 1)
}

export function stateAction(obj, actionCode) {
  return request({
    url: '/nursing/vcs/vip/ltci/form/action/' + actionCode,
    method: 'put',
    data: obj
  })
}

export function getCertByFormId(formId) {
  return request({
    url: '/nursing/vcs/vip/ltci/cert/byLtciFormId/' + formId,
    method: 'get'
  })
}

export function getImgByImgName(imgName) {
  return request({
    url: '/nursing/vcs/vip/ltci/cert/pic/' + imgName,
    method: 'get',
    responseType: 'blob'
  })
}

export function getQuestionsByFormId(formId) {
  return request({
    url: '/nursing/vcs/vip/ltci/test/selfcareQuestionResults/' + formId,
    method: 'get',
  })
}

export function currentCusts(vipId) {
  return request({
    url: '/nursing/vcs/vip/ltci/form/currentCusts',
    method: 'get',
    params: {
      vipId : vipId
    }
  })
}
