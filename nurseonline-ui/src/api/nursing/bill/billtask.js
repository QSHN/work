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
    url: '/nursing/billtask/pageEx',
    method: 'get',
    params: query
  })
}

export function pageByOrg(query) {
  return request({
    url: '/nursing/billtask/pageByOrg',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/bill/billtask',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/bill/billtask/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/bill/billtask/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/bill/billtask',
    method: 'put',
    data: obj
  })
}

// 提供指定服务预约订单的分派服务人员情况
export function billAssign(taskId) {
  return request({
    url: '/nursing/billassign/pageByTask',
    method: 'get',
    params: {taskId}
  });
}
