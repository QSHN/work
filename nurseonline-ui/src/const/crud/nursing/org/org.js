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

import {existUserName} from '@/api/nursing/org/employee'

var validateUserName = (rule, value, callback) => {

  var Regx = /^[A-Za-z]\w*$/;
  if (!Regx.test(value)) {
    callback(new Error('用户名只能包含：数字、‘_’、字母，并且首位必须是字母'));
    return;
  }

  existUserName(value).then(response => {
    let result = response.data.data;
    if (result === true) {
      callback(new Error('用户已经存在'));
      return;
    }
    callback();
  }).catch(e => {
    callback();
  })
};

var validatePassWord = (rule, value, callback) => {
  var regex1 = /^\d+$/;
  var regex2 = /^[A-Za-z]+$/;
  var regex3 = /^[^A-Za-z\d]+$/;

  if (regex1.test(value)) {
    callback(new Error('用户名不能为纯数字'));
    return;
  }

  if (regex2.test(value)) {
    callback(new Error('用户名不能为纯英文'));
    return;
  }

  if (regex3.test(value)) {
    callback(new Error('用户名不能为纯特殊字符'));
    return;
  }
  callback();
};

const treeUrl = `/nursing/oms/aid/itemtrees`
const zoneUrl = `/nursing/oms/zone/zone/trees`

const DIC = {

  isService: [{
    label: '否',
    value: '0'
  }, {
    label: '是',
    value: '1'
  }]
};
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 120,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    // {
    //   label: '机构id',
    //   prop: 'orgId'
    // },
    {
      label: '用户名',
      prop: 'username',
      hide: true,
      editDisplay: false,
      viewDisplay: false,
      showColumn: false,
      rules: [{
        required: true,
        message: '请输入用户名'
      },
        {
          min: 4,
          max: 20,
          message: '长度在 4 到 20 个字符',
          trigger: 'blur'
        },
        {validator: validateUserName, trigger: 'blur'}
      ]
    },
    {
      label: '密码',
      prop: 'password',
      showColumn: false,
      viewDisplay: false,
      hide: true,
      editDisplay: false,
      rules: [{
        required: true,
        message: '请输入密码'
      },
        {
          min: 8,
          max: 20,
          message: '长度在 8 到 20 个字符',
          trigger: 'blur'
        },
        {validator: validatePassWord, trigger: 'blur'}
      ]
    },
    {
      label: '机构代码',
      prop: 'orgCode'
    },
    {
      label: '机构名称',
      prop: 'orgName',
      width: 200,
      align: "left",
      rules: [{
        required: true,
        message: '请输入密码'
      }]
    },
    {
      label: '机构分类',
      prop: 'orgCategory',
      type: 'tree',
      dicUrl: `${treeUrl}/org_category`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请选择机构分类', trigger: 'blur'}]
    },
    {
      label: '机构类别',
      prop: 'orgType',
      type: 'select',
      dicUrl: `${treeUrl}/org_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择机构类别', trigger: 'blur'}]
    },
    {
      label: '单位级别',
      prop: 'orgLevel',
      type: 'select',
      dicUrl: `${treeUrl}/hospital_level`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请选择机构类别', trigger: 'blur'}]
    },
    {
      label: '详细地址',
      hide: true,
      prop: 'address'
    },
    {
      label: '负责人',
      prop: 'leader'
    },
    {
      label: '负责人联系电话',
      hide: true,
      prop: 'leaderPhone'
    },
    {
      label: '机构电话',
      prop: 'orgPhone'
    },
    {
      label: '所在区域',
      prop: 'zoneId',
      type: 'tree',
      dicUrl: `${zoneUrl}`,
      defaultExpandAll:false,
      props: {
        children: 'childNodes',
        label: 'zoneName',
        value: 'zoneId'
      },
      rules: [{required: false, message: '请选择区域', trigger: 'blur'}]
    },
    {
      label: '机构介绍',
      hide: true,
      prop: 'intro'
    },
    {
      label: '建档人名称',
      prop: 'creatorName',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      hide: true,
      disabled: true
    },
    {
      hide: true,
      label: '备注',
      prop: 'remark'
    },
    {
      label: '开户银行',
      hide: true,
      prop: 'bankName'
    },
    {
      label: '账户名称',
      hide: true,
      prop: 'bankAccountName'
    },
    {
      label: '账户号码',
      hide: true,
      prop: 'bankAccountNo'
    },
    {
      label: '税号',
      hide: true,
      prop: 'taxNo'
    },
    {
      label: '是否服务机构',
      prop: 'isService',
      dicData: DIC.isService,
      type: "select"
    },
    // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
    // {
    //   label: '建档人id',
    //   prop: 'creatorId',
    //   hide: true,
    //   viewDisplay: true,
    //   editDisplay: false,
    //   addDisplay: false,
    //   disabled: true
    // },
    // {
    //   label: '创建时间',
    //   prop: 'createTime'
    // },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    // {
    //   label: '版本号',
    //   prop: 'versionNo',
    //   hide: true,
    //   display: false
    // },
  ]
}
