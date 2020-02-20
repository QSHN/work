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
      label: '流水id',
      prop: 'feedbackId'
    },
	  {
      label: '相关资质id',//，引用staff_cert.staff_cert_id
      prop: 'staffCertId'
    },
	  {
      label: '服务人员id',
      prop: 'staffId'
    },
	  {
      label: '审核结果',//，0-待审（默认），1-通过，2-未通过
      prop: 'result'
    },
	  {
      label: '原因',//，如果审核结果=2（即未通过），则需要填写原因
      prop: 'reason'
    },
	  {
      label: '审核人id',//，引用sys_user.user_id
      prop: 'checkerId'
    },
	  {
      label: '审核人',//【冗余】，来自sys_user.username
      prop: 'checkerName'
    },
	  // {
    //   label: '是否删除，0：正常（默认），1：已删除  ',
    //   prop: 'delFlag'
    // },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
  ]
}
