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

const DIC = {
  sex: [{
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
  isAdmin: [{
    label: '否',
    value: '0'
  }, {
    label: '是',
    value: '1'
  }]
};

const baseUrl = `/nursing`
const deptUrl = `${baseUrl}/oms/org/dept/allTreeRoot`
const excludeDeptUrl = `${baseUrl}/oms/org/dept/excludeNode/`

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
    // {
    //   label: '员工id',
    //   prop: 'employeeId'
    // },
    {
      label: '用户名',
      prop: 'username',
      editDisplay: false,
      hide: true,
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
      hide: true,
      editDisplay: false,
      rules: [{
        required: true,
        message: '请输入密码'
      },
        {
          min: 8,
          max: 20,
          message: '长度在 8 到 18 个字符',
          trigger: 'blur'
        },
        {validator: validatePassWord, trigger: 'blur'}
      ]
    },
    {
      label: '员工姓名',
      prop: 'employeeName',
      rules: [{
        required: true,
        message: '请输入部门名称'
      }]
    },
    // {
    //   label: '所在机构id',
    //   prop: 'orgId',
    //   addDisplay: false,
    //   editDisabled: true,
    //   more: true,
    // },
    {
      label: '所在部门',
      prop: 'deptId',
      type: 'tree',
      hide: true,
      dicUrl: `${deptUrl}`,
      props: {
        children: 'children',
        label: 'deptName',
        value: 'deptId'
      },
      rules: [{required: true, message: '请选择部门', trigger: 'blur'}]
    },
    {
      label: '身份证号',
      prop: 'idNo'
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      dicData: DIC.sex,
      rules: [{
        required: false,
        message: '请选择性别',
        trigger: 'blur'
      }]
    },
    {
      label: '年龄',
      prop: 'age'
    },
    {
      label: '联系电话',
      prop: 'phone'
    },
    // {
    //   label: '关联用户id',
    //   prop: 'userId'
    // },
    {
      label: '关联用户名',
      prop: 'userName',
      addDisplay: false,
      editDisplay: false,
      more: true,
    },
    {
      label: '是否超级管理员',
      prop: 'isAdmin',
      type: 'select',
      dicData: DIC.isAdmin,
      addDisplay: false,
      editDisplay: false,
      more: true,
      // valueDefault: 0,
      rules: [{
        required: false,
        message: '请选择机构类型',
        trigger: 'blur'
      }]
    },
    // {
    //   label: '建档人id',
    //   prop: 'creatorId'
    // },
    // {
    //   label: '建档人name',
    //   prop: 'creatorName'
    // },
    {
      label: '创建时间',
      prop: 'createTime',
      editDisplay : false,
      addDisplay : false
    },
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
