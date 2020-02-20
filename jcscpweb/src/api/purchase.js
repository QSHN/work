import request from '@/utils/request'

export function updatePurchaseTemp(data) {
  return request({
    url: '/purchase/updatePurchaseTemp',
    method: 'post',
    data
  })
}

export function updatePurchaseContract(data) {
  return request({
    url: '/purchase/updatePurchaseContract',
    method: 'post',
    data
  })
}

export function updatePurchaseOrder(data) {
  return request({
    url: '/purchase/updatePurchaseOrder',
    method: 'post',
    data
  })
}

export function queryPurchaseTemp(data) {
  return request({
    url: '/purchase/queryPurchaseTemp',
    method: 'post',
    data
  })
}

export function queryPurchaseContract(data) {
  return request({
    url: '/purchase/queryPurchaseContract',
    method: 'post',
    data
  })
}

export function queryPurchaseOrder(data) {
  return request({
    url: '/purchase/queryPurchaseOrder',
    method: 'post',
    data
  })
}

export function deletePurchaseContract(data) {
  return request({
    url: '/purchase/deletePurchaseContract',
    method: 'delete',
    data
  })
}

export function deletePurchaseOrder(data) {
  return request({
    url: '/purchase/deletePurchaseOrder',
    method: 'delete',
    data
  })
}

export function summarySheet(data) {
  return request({
    url: '/purchase/summarySheet',
    method: 'post',
    data
  })
}

export function updatePurchaseSelfTemp(data) {
  return request({
    url: '/purchase/updatePurchaseSelfTemp',
    method: 'post',
    data
  })
}

export function queryPurchaseSelfTemp(data) {
  return request({
    url: '/purchase/queryPurchaseSelfTemp',
    method: 'post',
    data
  })
}

export function queryContractOrOrder(data) {
  return request({
    url: '/purchase/queryContractOrOrder',
    method: 'post',
    data
  })
}

export function exportData(data) {
  return request({
    url: '/purchase/exportData',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
