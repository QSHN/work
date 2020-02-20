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

export const tableOption = {
  // title:'疾病管理',
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  dicUrl: 'disease_type',
  size: 'small',
  column: [
    {
      label: '疾病代码',
      prop: 'diseaseCode',
      rules: [{
        required: true,
        message: '请输入疾病代码',
        trigger: 'blur'
      }]
    },
    {
      label: '疾病名称',
      prop: 'diseaseName',
      rules: [{
        required: true,
        message: '请输入疾病名称',
        trigger: 'blur'
      }]
    },
    {
      label: '疾病类型',
      prop: 'diseaseType',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/disease_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      search: true,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '疾病描述',
      prop: 'diseaseDesc',
      type: 'textarea',
      span: 24,
      hide: true,
      rules: [{
        required: true,
        message: '请输入疾病描述',
        trigger: 'blur'
      }]
    },
  ]
}
