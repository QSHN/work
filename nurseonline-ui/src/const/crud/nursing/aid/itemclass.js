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

const labelWidth=130
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 150,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      label: '辅助资料类别代码',
      prop: 'itemClassCode',
      overHidden: true,
      width: 150,
      span: 24,
      formHeight:36,
      labelWidth: labelWidth
    },
    {
      label: '辅助资料类别名称',
      prop: 'itemClassName',
      overHidden: true,
      width: 180,
      span: 24,
      labelWidth: labelWidth
    },
    {
      label: '详情',
      prop: 'remark',
      overHidden: true,
      span: 24,
      type:'textarea',
      labelWidth: labelWidth
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
      width: 150,
      editDisplay: false,
      addDisplay: false

    },
    {
      label: '修改时间',
      prop: 'updateTime',
      overHidden: true,
      width: 150,
      editDisplay: false,
      addDisplay: false
    }
  ]
}
