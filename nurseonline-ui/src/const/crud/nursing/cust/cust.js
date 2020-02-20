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
const DIC = {
  sex: [{
    label: '不填',
    value: "0"
  }, {
    label: '男',
    value: "1"
  }, {
    label: '女',
    value: "2"
  }],
}

const baseUrl = `/nursing/oms`
const treeUrl = `${baseUrl}/aid/itemtrees`
const zoneUrl = `${baseUrl}/zone/zone/trees`

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  menuType: 'icon',
  menuAlign: 'left',
  // menuWidth: 600,
  maxHeight: 690,
  column: [
    {
      label: '客户id',
      prop: 'custId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '客户代码',
      prop: 'custCode',
      rules: [{required: true, message: '请输入客户代码', trigger: 'blur'}]
    }, {
      label: '客户姓名',
      prop: 'custName',
      rules: [{required: true, message: '请输入客户姓名', trigger: 'blur'}]
    }, {
      label: '出生日期',
      prop: 'birthDate',
      hide: true,
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      rules: [{required: true, message: '请选择出生日期', trigger: 'blur'}]
    }, {
      label: '客户类型',
      prop: 'custType',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/cust_type`,
      parent: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择客户类型', trigger: 'blur'}]
    }, {
      label: '身份证号',
      prop: 'idNo',
      disabled: true,
      // rules: [
      //   {required: true, message: '请输入身份证号', trigger: 'blur'},
      //   {min: 15, max: 18, message: "身份证号长度为15-18位", trigger: "blur"}
      // ]
    }, {
      label: '性别',
      prop: 'sex',
      type: 'radio',
      dicData: DIC.sex,
      valueDefault: "0",
      rules: [{
        required: true,
        message: '请选择性别',
        trigger: 'blur'
      }]
    }, {
      label: '年龄',
      prop: 'age',
      type: 'number',
      rules: [{
        required: true,
        message: '请输入年龄',
        trigger: 'blur'
      }]
    }, {
      label: '婚姻状况',
      prop: 'maritalStatus',
      hide: true,
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/marital_status`,
      parent: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    }, {
      label: '民族',
      prop: 'nation',
      hide: true,
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/nation`,
      parent: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemName'
      },
    }, {
      label: '所在区域',
      prop: 'zoneId',
      parent: false,
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
    }, {
      label: '家庭住址',
      prop: 'address',
      hide: true,
      rules: [{required: true, message: '请输入家庭住址', trigger: 'blur'}]
    }, {
      label: '手机号码',
      prop: 'phone',
      hide: true,
      type: 'phone',
      rules: [{required: true, message: '请输入手机号码', trigger: 'blur'}]
    }, {
      label: '联系人',
      prop: 'linkman',
      hide: true,
      rules: [{
        required: true,
        message: '请输入联系人',
        trigger: 'blur'
      }]
    }, {
      label: '联系人手机',
      prop: 'linkmanPhone',
      hide: true,
      rules: [{
        required: true,
        message: '请输入联系人手机',
        trigger: 'blur'
      }]
    }, {
      label: '建档人id',
      prop: 'creatorId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    }, {
      label: '建档人名称',
      prop: 'creatorName',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    }, {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime',
    //   hide: true,
    //   addDisplay: false,
    //   disabled: true
    // },
    {
      label: '版本号',
      prop: 'versionNo',
      hide: true,
      display: false
    },
  ]
}
