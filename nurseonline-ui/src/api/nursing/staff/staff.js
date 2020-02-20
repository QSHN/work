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
    url: '/nursing/oms/staff',
    method: 'get',
    params: query
  })
}

export function fetchListOfOrg(query) {
  return request({
    url: '/nursing/oms/staff/ofOrg',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/oms/staff',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/oms/staff/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/oms/staff',
    method: 'delete',
    params: {staffId:id}
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/oms/staff',
    method: 'put',
    data: obj
  })
}

/**
 * @param params 包含以下两个字段：
 *               <p>     action  操作，有：pass(审核通过)，reject(审批未通过)，lock(锁定)，unlock(解锁)</p>
 *               <p>     staffId 服务人员ID</p>
 */
export function certCheck(params) {
  return request({
    url: '/nursing/oms/staff/certCheck',
    method: 'post',
    data: params
  })
}

/**
 * @param params 包含以下两个字段：
 *               <p>     action  操作，有：pass(审核通过)，reject(审批未通过)，lock(锁定)，unlock(解锁)</p>
 *               <p>     staffId 服务人员ID</p>
 */
export function process(params) {
  return request({
    url: '/nursing/oms/staff/process',
    method: 'post',
    data: params
  })
}

