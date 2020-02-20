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
const zoneUrl = `${baseUrl}/zone/zone/trees`
const DIC = {
  isDefault: [{
    label: '否',
    value: '0'
  }, {
    label: '是',
    value: '1'
  }]
}


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
      label: '系统流水id',
      prop: 'addressId',
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '服务人员id，引用org_staff.staff_id',
      prop: 'staffId',
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '标签',
      prop: 'label',
      rules: [{
        required: true, message: '请输入标签', trigger: 'blur'
      }]
    },
    {
      label: '所在区域',
      prop: 'zoneId',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: zoneUrl,
      props: {
        children: 'childNodes',
        label: 'zoneName',
        value: 'zoneId'
      },
      rules: [{
        required: true, message: '请选择所在区域', trigger: 'blur'
      }]
    },
    {
      label: '区域描述',
      prop: 'zoneLabel',
      rules: [{
        required: true, message: '请输入区域描述', trigger: 'blur'
      }]
      // disabled: true,
    },
    {
      label: '详细地址',
      prop: 'address',
      rules: [{
        required: true, message: '请输入详细地址', trigger: 'blur'
      }]
    },
    {
      label: '邮政编码',
      prop: 'zipcode',
      rules: [{
        required: true, message: '请输入邮政编码', trigger: 'blur'
      }]
    },
    {
      label: '电话格式',
      prop: 'phone',
      rules: [{
        required: true,
        message: '86-<区号>-<电话号码>/86-<手机号>',
        trigger: 'blur'
      }]
    },
    {
      label: '联系人',
      prop: 'linkman',
      rules: [{
        required: true, message: '请输入联系人姓名', trigger: 'blur'
      }]
    },
    {
      label: '位置',
      prop: 'position',
      slot: true,
      disabled: true,
      valueDefault: "0 0"
    },
    {
      label: '是否默认',
      prop: 'isDefault',
      type: 'radio',
      dicData: DIC.isDefault,
      valueDefault: "0",
    },
    // {
    //   label: '是否删除，0：正常（默认），1：已删除',
    //   prop: 'delFlag'
    // },
    {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false
    },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    {
      label: '版本号',
      prop: 'versionNo',
      hide: true,
      viewDisplay: false,
      editDisplay: false,
      addDisplay: false
    },
  ]
}
