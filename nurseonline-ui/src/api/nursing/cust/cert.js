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

export function getCertList(params) {
  return request({
    url: '/nursing/oms/cust/cert',
    method: 'get',
    params: params
  })
}

export function addCert(obj) {
  return request({
    url: '/nursing/oms/cust/cert',
    method: 'post',
    data: obj
  })
}

export function getCert(id) {
  return request({
    url: '/nursing/oms/cust/cert/' + id,
    method: 'get'
  })
}

export function delCert(params) {
  return request({
    url: '/nursing/oms/cust/cert',
    method: 'delete',
    params: params
  })
}

export function putCert(obj) {
  return request({
    url: '/nursing/oms/cust/cert',
    method: 'put',
    data: obj
  })
}

export function getPic(obj) {
  return request({
    url: '/nursing/oms/file/'+obj.bucketName+"-"+obj.fileName,
    method: 'put',
    data: obj
  })
}
