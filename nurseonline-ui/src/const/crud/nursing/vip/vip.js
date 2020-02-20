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
  menuWidth: 250,
  height: 550,
  column: [
    {
      label: '会员代码',
      prop: 'vipCode',
      width: 80,
      overHidden: true,
      size:"small"
    },
    {
      label: '会员名称',
      prop: 'vipName',
      width: 90,
      overHidden: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '身份证号',
      prop: 'idNo',
      editDisabled: true,
      overHidden: true,
      size:"small"
      // editDisplay: false
    },
    {
      label: '性别',
      prop: 'sex',
      width: 80,
      type: 'select',
      editDisabled: true,
      overHidden: true,
      dicData: [{
        label: '未知',
        value: '0'
      }, {
        label: '男',
        value: '1'
      }, {
        label: '女',
        value: '2'
      }, {
        label: '保密',
        value: '3'
      }],
      size:"small"
    },
    {
      label: '年龄',
      prop: 'age',
      width: 80,
      overHidden: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '手机号',
      prop: 'phone',
      overHidden: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '用户名',
      prop: 'userName',
      overHidden: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '会员状态',
      prop: 'vipState',
      overHidden: true,
      type: 'select',
      width: 150,
      editDisabled: true,
      dicData: [{
        label: '草稿',
        value: 0
      }, {
        label: '待审核',
        value: 1
      }, {
        label: '审核通过',
        value: 2
      }, {
        label: '审核未通过',
        value: 3
      }],
      size:"small"
    },
    {
      label: '锁定状态',
      prop: 'isLock',
      width: 80,
      overHidden: true,
      type:"select",
      size:"small",
      dicData: [{
        label: '正常',
        value: 0
      }, {
        label: '锁定',
        value: 1
      }],
    },
    {
      label: '会员等级',
      prop: 'vipLevel',
      overHidden: true,
      hide: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '出生日期',
      prop: 'birthDate',
      overHidden: true,
      type: 'datetime',
      format: "yyyy-MM-dd",
      valueFormat: "yyyy-MM-dd",
      hide: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '电子邮箱',
      prop: 'email',
      overHidden: true,
      editDisabled: true,
      hide: true,
      size:"small"
    },
    {
      label: '当前积分',
      prop: 'point',
      overHidden: true,
      hide: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '账户余额',
      prop: 'balance',
      overHidden: true,
      hide: true,
      editDisabled: true,
      size:"small"
    },
    {
      label: '建档人',
      prop: 'creatorName',
      overHidden: true,
      editDisabled: true,
      hide: true,
      size:"small"
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
      editDisabled: true,
      hide: true,
      size:"small"
    },
    {
      label: '修改时间',
      prop: 'updateTime',
      overHidden: true,
      editDisabled: true,
      hide: true,
      size:"small"
    }
  ]
}
