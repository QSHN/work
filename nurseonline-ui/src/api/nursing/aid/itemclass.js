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
    url: '/nursing/oms/aid/itemclasses',
//  http://localhost:8080/nursing/aid/itemclass/page 原url
//  http://192.168.1.135:7200/nursing-admin-hgx/aid/itemclass/page 实际url
    method: 'get',
    params: query
  })
}

export function fetchTreeByItemClassCode(code) {
  return request({
    url: '/nursing/oms/aid/itemtrees/'+code,
    method: 'get',
  })
}
export function resetTreeByItemClassCode(code) {
  return request({
    url: '/nursing/oms/aid/resetRedis?itemCode='+code,
    method: 'post'
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/oms/aid/itemclass',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/oms/aid/itemclass/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/oms/aid/itemclass/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/oms/aid/itemclass',
    method: 'put',
    data: obj
  })
}
