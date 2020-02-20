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
import {pageSize} from "@/config/env.js"

export function fetchList(query) {
  return request({
    url: '/nursing/oms/invoice/?descs=invoice_date',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  let billsStr = "";
  obj.billIds.forEach(b => {
    billsStr += "billIds=" + b + "&"
  });
  return request({
    url: '/nursing/oms/invoice?' + billsStr,
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/nursing/oms/invoice/' + id,
    method: 'get'
  })
}

export function getItems(id) {
  return request({
    url: '/nursing/oms/invoice/items/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/nursing/oms/invoice/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  let billsStr = "";
  obj.billIds.forEach(b => {
    billsStr += "billIds=" + b + "&"
  });
  return request({
    url: '/nursing/oms/invoice?' + billsStr + "isOrg=true",
    method: 'put',
    data: obj,
    params: {
      billIds: obj.billIds
    }
  })
}

export function commit(id) {
  return request({
    url: '/nursing/oms/invoice/commit/' + id.invoiceId,
    method: 'put',
  })
}

export function itemsByInvoiceId(id) {
  return request({
    url: '/nursing/oms/invoice/items/' + id,
    method: 'get',
  })
}

export function revoke(id) {
  return request({
    url: '/nursing/oms/invoice/revoke/' + id.invoiceId,
    method: 'put',
  })
}

export function processSuccess(query) {
  return request({
    url: '/nursing/oms/invoice/processSuccess/',
    method: 'put',
    data: query,
  })
}

export function processFail(query) {
  return request({
    url: '/nursing/oms/invoice/processFail/',
    method: 'put',
    data: query,
  })
}

/**
 * @description 获取会员列表
 * 可选参数：
  current：当前页
  size：每页大小
  搜索条件：
  vipCode、vipName、idNo、phone
 */
export const vips = (data={}) => {
  data.size = data.size || pageSize;
  return request({
    url: '/nursing/oms/vip/vips',
    method: 'get',
    params: data
  });
}

/**
 * @description  获取会员对应的订单列表
 * @param  vipId   会员id
 */
export const bills = vipId => {
  return request({
    url: '/nursing/oms/invoice/currentVipNonInvoicedBills',
    method: 'get',
    params: {vipId}
  });
}

/**
 * @description  获取订单状态名称
 */
export const billState = () => {
  return request({
    url: '/nursing/oms/aid/itemtrees/bill_state',
    method: 'get'
  });
}
