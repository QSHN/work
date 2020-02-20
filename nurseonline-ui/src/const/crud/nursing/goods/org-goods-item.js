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
      label: '明细ID',
      prop: 'itemId',
      editDisabled: true,
      addDisplay: false
    },
	  {
      label: '机构商品ID',
      prop: 'orgGoodsId',
      editDisabled: true,
      addDisplay: false
    },
	  {
      label: '商品ID',
      prop: 'goodsId',
      editDisabled: true,
      addDisplay: false
    },
	  {
      label: '商品名称',
      prop: 'goodsLabel',
      width: 300,
      addDisplay: false
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
      label: '计价单位',
      prop: 'unit'
    },
	  {
      label: '数量',
      prop: 'qty'
    },
	  // {
    //   label: '创建时间',
    //   prop: 'createTime',
    //   type: 'date',
    //   format: 'yyyy-MM-dd',
    //   width: 100,
    //   valueFormat: 'yyyy-MM-dd HH:mm:ss',
    //   addDisplay: false,
    //   editDisplay: false
    // },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime',
    //   type: 'date',
    //   format: 'yyyy-MM-dd',
    //   width: 100,
    //   valueFormat: 'yyyy-MM-dd HH:mm:ss',
    //   addDisplay: false,
    //   editDisplay: false
    // },
  ]
}
