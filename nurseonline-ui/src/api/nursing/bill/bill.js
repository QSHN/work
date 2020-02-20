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
    url: '/nursing/bill/pageEx',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/bill/bill',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/bill/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/bill/bill/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/bill/bill',
    method: 'put',
    data: obj
  })
}

export function check(billId) {
  return request({
    url: '/nursing/bill/check',
    method: 'put',
    params: {billId, userId}
  });
}

// 评价详情
export function billReview(billId) {
  return request({
    url: '/nursing/oms/bill/review/billId/' + billId,
    method: 'get'
  });
}


export function invoiceState() {
  return request({
    url: '/nursing/oms/aid/itemtrees/invoice_state',
    method: 'get'
  });
}

export function payState() {
  return request({
    url: '/nursing/oms/aid/itemtrees/pay_state',
    method: 'get'
  });
}

export function billState() {
  return request({
    url: '/nursing/oms/aid/itemtrees/bill_state',
    method: 'get'
  });
}

export function relationForCust() {
  return request({
    url: '/nursing/oms/aid/itemtrees/relation_for_cust',
    method: 'get'
  });
}

export function billType() {
  return request({
    url: '/nursing/oms/aid/itemtrees/bill_type',
    method: 'get'
  });
}

export function billCerts(billId) {
  return request({
    url: '/nursing/bill/billcerts',
    method: 'get',
    params: {billId}
  });
}