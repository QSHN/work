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
import store from "@/store"

let userId = store.getters.userInfo.userId;

export function fetchList(query) {
  return request({
    url: '/nursing/billassign/billassign/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/billassign/billassign',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/billassign/billassign/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/billassign/billassign/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/billassign/billassign',
    method: 'put',
    data: obj
  })
}

// 提供指定服务预约订单的推荐服务人员列表
export function recommender(params) {
  return request({
    url: '/nursing/oms/staff/recommender/list',
    method: 'get',
    params
  });
}

/**
 *范例：
    {
      "taskId":19050041,
      "userId":1,
      "staffIdList":[1,2,3]
    }
 */
export function createBillAssignList(taskId, staffIdList) {
  return request({
    url: '/nursing/billassign/createBillAssignList',
    method: 'put',
    data: {taskId, userId, staffIdList}
  });
}
