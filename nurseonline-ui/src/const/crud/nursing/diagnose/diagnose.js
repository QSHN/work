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

export var tableOption = {
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
      label: '诊断代码',
      prop: 'diagnoseCode',
      overHidden: true,
      rules: [{
        required: true,
        message: "请输入区域名称",
        trigger: "blur"
      }]
    },
    {
      label: '诊断名称',
      prop: 'diagnoseName',
      overHidden: true,
      rules: [{
        required: true,
        message: "请输入区域名称",
        trigger: "blur"
      }]
    },
    {
      label: '缩写代码',
      prop: 'diagnoseAbbr',
      overHidden: true,
      rules: [{
        required: true,
        message: "请输入区域名称",
        trigger: "blur"
      }]
    },
	  {
      label: '诊断分类',
      prop: 'diagnoseType',
      overHidden: true,
      type: "tree",
      dicData: [],
      props: {
        label: "itemName",
        value: 'itemId',
        children: 'childNodes'
      },
      nodeClick: (data) => {
      },
      checked: (data) => {
      },
      rules: [{
        required: true,
        message: "请输入区域名称",
        trigger: "blur"
      }]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
      addDisplay: false,
      editDisplay: false
    },
	  {
      label: '诊断详情',
      prop: 'diagnoseDesc',
      overHidden: true,
      type:'textarea',
      hide: true
    },
	  {
      label: '医院科室',
      prop: 'clinicalDeptId',
      overHidden: true,
      type: "tree",
      dicData: [],
      props: {
        label: "itemName",
        value: 'itemId',
        children: 'childNodes'
      },
      nodeClick: (data) => {
      },
      checked: (data) => {
      },
      hide: true,
      rules: [{
        required: true,
        message: "请输入区域名称",
        trigger: "blur"
      }]
    },
	  {
      label: '修改时间',
      prop: 'updateTime',
      overHidden: true,
      hide: true,
      addDisplay: false,
      editDisplay: false
    }
  ]
}
