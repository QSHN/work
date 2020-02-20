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
    url: '/nursing/oms/staff/cert/ofOrg',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/oms/staff/cert',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/oms/staff/cert/' + id,
    method: 'get'
  })
}

export function delObj(params) {
  return request({
    url: '/nursing/oms/staff/cert',
    method: 'delete',
    params: params
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/oms/staff/cert',
    method: 'put',
    data: obj
  })
}

export function process(params){
  return request({
    url: '/nursing/oms/staff/cert/process',
    method: 'post',
    data: params
  })
}