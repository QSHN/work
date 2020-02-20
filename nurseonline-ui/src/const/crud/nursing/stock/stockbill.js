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

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
	  // {
    //   label: '单据id',
    //   prop: 'billId'
    // },
	  {
      label: '单号',
      prop: 'billId',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '单据日期',
      prop: 'billDate',
      editDisplay: false,
      addDisplay: false,
      type: 'date',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd',
      more: true,
      search: true
    },
	  {
      label: '订单类型',
      prop: 'billType',
      type: 'select',
      dicUrl: `/nursing/oms/aid/itemtrees/stock_bill_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
	  {
      label: '订单状态',
      prop: 'billState',
      type: 'select',
      dicUrl: `/nursing/oms/aid/itemtrees/stock_bill_state`,
      search: true,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '支付状态',
      prop: 'payState',
      type: 'select',
      dicUrl: `/nursing/oms/aid/itemtrees/pay_state`,
      search: true,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '配送方式',
      prop: 'shipmentType',
      type: 'select',
      dicUrl: `/nursing/oms/aid/itemtrees/shipment_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      }
    },
	  {
      label: '配送状态',
      prop: 'shipmentState',
      search: true,
      type: 'select',
      dicUrl: `/nursing/oms/aid/itemtrees/shipment_state`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '卖家机构',
      prop: 'sellOrgId',
      formslot: true,
      hide: true
    },
	  {
      label: '出入库商品明细',
      prop: 'stockBillItems',
      formslot: true,
      viewDisplay : false,
      hide: true
    },
	  {
      label: '卖家机构名称',
      prop: 'sellOrgName',
      editDisplay: false,
      addDisplay: false
    },
	  // {
    //   label: '买家机构id',
    //   prop: 'buyOrgId'
    // },
	  {
      label: '买家机构名称',
      prop: 'buyOrgName',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '相关服务订单id',
      prop: 'relBillId'
    },
	  // {
    //   label: '相关服务人员id',
    //   prop: 'relStaffId',
    //   editDisplay: false,
    //   addDisplay: false
    // },
	  {
      label: '相关服务人员名称',
      prop: 'relStaffName',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '关联单据类型',
      prop: 'relBillType',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '关联任务id',
      prop: 'relTaskId',
      hide: true,
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '单据金额',
      prop: 'amt',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '联系人（或收货人）',
      prop: 'linkman',
      hide: true
    },
	  {
      label: '联系电话',
      prop: 'phone',
      hide: true
    },
	  {
      label: '收货地址所在区域',
      prop: 'zoneId',
      type: 'tree',
      dicUrl: `/nursing/oms/zone/zone/trees`,
      defaultExpandAll:false,
      hide: true,
      props: {
        children: 'childNodes',
        label: 'zoneName',
        value: 'zoneId'
      },
    },
	  {
      label: '详细地址',
      prop: 'address',
      hide: true
    },
	  // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
	  {
      label: '审核时间',
      prop: 'checkTime',
      hide: true,
      editDisplay: false,
      addDisplay: false
    },
	  // {
    //   label: '审核人id',
    //   prop: 'checkerId'
    // },
	  // {
    //   label: '审核人name',
    //   prop: 'checkerName'
    // },
	  // {
    //   label: '制单人id',
    //   prop: 'creatorId'
    // },
	  {
      label: '制单人name',
      prop: 'creatorName',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '创建时间',
      prop: 'createTime',
      editDisplay: false,
      addDisplay: false
    },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
	  // {
    //   label: '版本号',
    //   prop: 'versionNo',
    //   hide: true,
    //   viewDisplay: false,
    //   editDisplay: false,
    //   addDisplay: false
    // },
  ]
}
