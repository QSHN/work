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
    // url: '/nursing/oms/staff/withdrawal/req?descs=create_time',
    url: '/nursing/oms/staff/withdrawal/req/operateOrg?descs=create_time',
    method: 'get',
    params: query
  })
}

export function fetchAllList(query) {
  return request({
    url: '/nursing/oms/staff/withdrawal/req/all?descs=create_time',
    method: 'get',
    params: query
  })
}

export function currentStaff() {
  return request({
    url: '/nursing/oms/staff/withdrawal/req/currentStaff',
    method: 'get',
  })
}

export function processFinish(reqId, paymentId) {
  return request({
    url: '/nursing/oms/staff/withdrawal/req/action/' + reqId + "/" + 1,
    method: 'put',
    params : {
      paymentId : paymentId
    }
  })
}

export function processException(reqId, reason) {
  return request({
    url: '/nursing/oms/staff/withdrawal/req/action/' + reqId + "/" + 2,
    method: 'put',
    params : {
      reason : reason
    }
  })
}



export function addObj(obj) {
  return request({
    url: '/staff/staffwithdrawalreq',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/staff/staffwithdrawalreq/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/staff/staffwithdrawalreq/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/staff/staffwithdrawalreq',
    method: 'put',
    data: obj
  })
}
