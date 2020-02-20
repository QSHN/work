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
      label: '科室id',
      prop: 'officeId',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '科室名称',
      prop: 'officeName',
      rules: [{
        required: true, message: '请输入科室名称', trigger: 'blur'
      }]
    },
	  {
      label: '机构名称',
      prop: 'orgName',
      editDisplay: false,
      addDisplay: false
    },
	  {
      label: '联系人',
      prop: 'linkman',
      rules: [{
        required: true, message: '请输入科室联系人', trigger: 'blur'
      }]
    },
	  {
      label: '联系电话',
      prop: 'phone',
      rules: [{
        required: true, message: '请输入联系电话', trigger: 'blur'
      }]
    },
	  {
      label: '科室简介',
      prop: 'intro'
    },
	  // {
    //   label: '是否删除',
    //   hide: true,
    //   prop: 'delFlag'
    // },
	  {
      label: '创建时间',
      hide: true,
      prop: 'createTime',
      addDisplay: false,
      editDisplay: false,
    },
	  // {
    //   label: '修改时间',
    //   hide: true,
    //   prop: 'updateTime'
    // },
	  // {
    //   label: '版本号',
    //   hide: true,
    //   prop: 'versionNo'
    // },
  ]
}
