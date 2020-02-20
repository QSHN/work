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
      label: '服务人员id',
      prop: 'staffId'
    },
    {
      label: '服务人员名称',
      prop: 'staffName',
      'search': true,
      display:false
    },
	  {
      label: '账户类型',
      prop: 'accountType'
    },
	  {
      label: '账户名称',
      prop: 'accountName'
    },
	  {
      label: '账户',
      prop: 'accountNo'
    },
	  {
      label: '银行代码',
      prop: 'bankCode'
    },
	  {
      label: '银行名称',
      prop: 'bankName'
    },
	  {
      label: '处理状态',
      prop: 'state'
    },
	  {
      label: '提现金额',
      prop: 'amt'
    },
	  {
      label: '付款流水编号',
      prop: 'paymentId'
    },
	  {
      label: '创建时间',
      prop: 'createTime'
    }
  ]
}
