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
    url: '/nursing/scms/stock/bill',
    method: 'get',
    params: query
  })
}

export function orgGoodsListByOrgId(query, orgId) {
  return request({
    url: '/nursing/scms/stock/bill/orgGoods/' + orgId,
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/nursing/scms/stock/bill/applyForGoodses',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/scms/stock/bill/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/scms/stock/bill/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/nursing/scms/stock/bill/dto',
    method: 'put',
    data: obj
  })
}

export function commit(id) {
  return request({
    url: '/nursing/scms/stock/bill/commit/' + id,
    method: 'put'
  })
}

export function successful(id) {
  return request({
    url: '/nursing/scms/stock/bill/successful/' + id,
    method: 'put'
  })
}

export function failed(id, reason) {
  return request({
    url: '/nursing/scms/stock/bill/failed/' + id,
    method: 'put',
    params : {
      reason : reason
    }
  })
}

export function onDelivery(id) {
  return request({
    url: '/nursing/scms/stock/bill/onDelivery/' + id,
    method: 'put'
  })
}

export function getStockDetail(billId) {
  return request({
    url: '/nursing/scms/stock/bill/stockBillDetail/' + billId,
    method: 'get'
  })
}

