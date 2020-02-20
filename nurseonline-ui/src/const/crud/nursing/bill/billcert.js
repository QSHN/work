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
      label: '资质id',
      prop: 'billCertId'
    },
	  {
      label: '相关订单id',
      prop: 'billId'
    },
	  {
      label: '用户Id，提交资质的用户',
      prop: 'userId'
    },
	  {
      label: '资质类别，参考item_class_code="cert_type"定义',
      prop: 'certType'
    },
	  {
      label: '资质名称【冗余】，默认=item.item_name，会员可以修改',
      prop: 'certTypeName'
    },
	  {
      label: '资质描述',
      prop: 'certDesc'
    },
	  {
      label: '图片路径',
      prop: 'certImgPath'
    },
	  {
      label: '创建时间，默认=当前时间',
      prop: 'createTime'
    },
	  {
      label: '修改时间',
      prop: 'updateTime'
    },
  ]
}
