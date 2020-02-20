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
  menu: false,
  column: [
	  {
      label: '流水id',
      prop: 'staffServiceId',
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false,
    },
	  {
      label: '人员id',
      prop: 'staffId',
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false,
    },
	  {
      label: '服务项目',
      prop: 'serviceId',
      hide: true
    },
	  {
      label: '项目名称',
      prop: 'serviceName'
    },
	  {
      label: '熟练程度',
      prop: 'proficiency'
    },
	  {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
  ]
}
