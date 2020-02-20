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

const baseUrl = `/nursing/oms`
const treeUrl = `${baseUrl}/aid/itemtrees`

const DIC = {
  ISENABLED: [{
    label: '禁用',
    value: '0'
  }, {
    label: '启用',
    value: '1'
  }]
}

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
  emptyBtn: false,
  column: [
    {
      label: '系统id',
      prop: 'iconfontId',
      display: false,
    },
    {
      label: '项目ID',
      prop: 'projectId',
      tip: '来自iconfont.cn中我的项目对应id',
      rules: [{required:true, message: '项目id不能为空'}],
    },
    {
      label: '项目版本',
      prop: 'projectVersion',
      tip: '来自iconfont.cn中我的项目对应版本',
      rules: [{required:true, message: '项目版本不能为空'}],
    },
    {
      label: '项目名称',
      prop: 'projectName',
      rules: [{required:true, message: '项目名称不能为空'}],
    },
    {
      label: '类别',
      prop: 'iconfontType',
      type: 'select',
      dicUrl: `${treeUrl}/iconfont_type`,
      parent: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required:true, message: '必须选择类别'}],
    },
    {
      label: '是否启用',
      prop: 'isEnabled',
      type: "radio",
      dicData: DIC.ISENABLED,
      formDefault: '0',
      rules: [{required:true, message: '必须选择是否启用'}],
    },
    {
      label: '创建时间',
      prop: 'createTime',
      display: false,
    }
  ]
}
