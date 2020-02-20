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
      label: '单据明细流水编码',
      prop: 'itemId'
    },
	  {
      label: '单据id',
      prop: 'billId'
    },
	  {
      label: '机构-商品id',
      prop: 'orgGoodsId'
    },
	  {
      label: '商品',
      prop: 'goodsId'
    },
	  {
      label: '商品名称',
      prop: 'goodsLabel'
    },
	  {
      label: '规格',
      prop: 'spec'
    },
	  {
      label: '型号',
      prop: 'model'
    },
	  {
      label: '计量单位',
      prop: 'unit'
    },
	  {
      label: '单价',
      prop: 'price'
    },
	  {
      label: '数量',
      prop: 'qty'
    },
	  {
      label: '金额',
      prop: 'amt'
    },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
	  {
      label: '修改时间',
      prop: 'updateTime'
    },
	  // {
    //   label: '版本号',
    //   prop: 'versionNo'
    // },
  ]
}
