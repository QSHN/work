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

const DIC = {
  recType: [{
    label: '<span style="color:darkgreen">收入</span>',
    value: 1
  }, {
    label: '<span style="color:orangered">支出</span>',
    value: -1
  }]
}
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
  menu: false,
  column: [
	  {
      label: '余额变动id',
      prop: 'recId',
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false
    },
	  // {
    //   label: '会员id',
    //   prop: 'staffId'
    // },
	  {
      label: '变动标识',
      prop: 'recType',
      type: 'radio',
      dicData: DIC.recType,
    },
	  {
      label: '金额',
      prop: 'amt'
    },
    {
      label: '变动描述',
      prop: 'descr'
    },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
  ]
}
