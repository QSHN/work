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
	  {
      label: '系统流水id',
      prop: 'itemId'
    },
	  {
      label: '订单id，引用bill.bill_id',
      prop: 'billId'
    },
	  {
      label: '服务项目id，引用org_service.service_id，关联该Id主要用于统计',
      prop: 'serviceId'
    },
	  {
      label: '服务项目id，引用org_service.org_service_id',
      prop: 'orgServiceId'
    },
	  {
      label: '服务项目名称，引用org_service.service_label',
      prop: 'serviceLabel'
    },
	  {
      label: '计价单位，默认=org_service.unit',
      prop: 'unit'
    },
	  {
      label: '服务单价，即公开报价',
      prop: 'price'
    },
	  {
      label: '数量，=1',
      prop: 'qty'
    },
	  {
      label: '金额，=服务单价 x 数量',
      prop: 'amt'
    },
	  {
      label: '工具包标识，0-无需工具包，1-需要工具包（工具包明细需要在org_service_goods定义）',
      prop: 'kitFlag'
    },
	  {
      label: '耗材包/工具包对应的商品id，对应org_goods.org_goods_id，如=0表示无需耗材包（如果kit_flag=1才有内容）',
      prop: 'kitGoodsId'
    },
	  {
      label: '耗材包/工具包标题（如果kit_flag=1才有内容）',
      prop: 'kitGoodsLabel'
    },
	  {
      label: '耗材包/工具包单价（如果kit_flag=1才有内容）',
      prop: 'kitPrice'
    },
	  {
      label: '创建时间，默认=当前时间',
      prop: 'createTime'
    },
  ]
}
