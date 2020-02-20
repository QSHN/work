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
    url: '/nursing/oms/zone/zone/treeRoots',
    method: 'get',
    params: query
  })
}

export function refreshTree() {
  return request({
    url: '/nursing/oms/zone/zone/tree/reset',
    method: 'post'
  })
}

export function getRootTree(rootCode) {
  return request({
    url: '/nursing/oms/zone/zone/rootTree/' + rootCode,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/oms/zone/zone',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/oms/zone/zone/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/oms/zone/zone',
    method: 'delete',
    params: {id: id}
  })
}

export function delSubObj(id) {
  return request({
    url: '/nursing/oms/zone/zone/sub',
    method: 'delete',
    params: {id: id}
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/oms/zone/zone',
    method: 'put',
    data: obj
  })
}
