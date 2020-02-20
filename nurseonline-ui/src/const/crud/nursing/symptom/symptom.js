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
      label: '症状代码',
      prop: 'symptomCode',
      overHidden: true
    },
    {
      label: '症状名称',
      prop: 'symptomName',
      overHidden: true
    },
    {
      label: '症状缩写',
      prop: 'symptomAbbr',
      overHidden: true
    },
    {
      label: '症状分类',
      prop: 'symptomType',
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
      }
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
      addDisplay: false,
      editDisplay: false
    },
    {
      label: '症状详情',
      prop: 'symptomDesc',
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
      hide: true,
      props: {
        label: "itemName",
        value: 'itemId',
        children: 'childNodes'
      },
      nodeClick: (data) => {
      },
      checked: (data) => {
      }
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
