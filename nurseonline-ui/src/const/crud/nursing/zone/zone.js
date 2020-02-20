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
      label: '区域代码',
      prop: 'zoneCode',
      rules: [{
        required: true,
        message: "请输入区域代码",
        trigger: "blur"
      }]
    },
	  {
      label: '区域名称',
      prop: 'zoneName',
      rules: [{
        required: true,
        message: "请输入区域名称",
        trigger: "blur"
      }]
    },
	  {
      label: '邮政编码',
      prop: 'zipcode'
    },
	  {
      label: '创建时间',
      prop: 'createTime',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '修改时间',
      prop: 'updateTime',
      editDisplay: false,
      addDisplay: false
    },
  ]
}
