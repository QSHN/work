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
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menu: false,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      label: '服务对象id',
      prop: 'custId'
    },
    {
      label: '身高',//（单位：厘米/CM）
      prop: 'height',
      formatter: function (row, column, cellValue, index) {
        if (!cellValue || cellValue == '')
          return '-';
        return cellValue + ' 厘米';
      },
    },
    {
      label: '体重',//（单位：公斤/KG）
      prop: 'weight',
      formatter: function (row, column, cellValue, index) {
        if (!cellValue || cellValue == '')
          return '-';
        return cellValue + ' 公斤';
      },
    },
    {
      label: '血型',//，参见item_class_code='blood_type'定义
      prop: 'bloodType',
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/blood_type`,
      parent: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
    {
      label: '家族遗传史',
      prop: 'geneticHistory'
    },
    {
      label: '个人及家庭状况',//引用sys_model.personal_and_family，首次护士上门填写后更新，以后护理记录单从本表获取
      prop: 'personalAndFamily'
    },
    {
      label: '既往病史',
      prop: 'medicalHistory'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '修改时间',
      prop: 'updateTime',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
    {
      label: '版本号',
      prop: 'versionNo',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
  ]
}


export const detailOption = {
  group: [{
    column: [
      {
        label: '服务对象id',
        prop: 'custId'
      },
      {
        label: '身高',//（单位：厘米/CM）
        prop: 'height',
        formatter: function (row, column, cellValue, index) {
          if (!cellValue || cellValue == '')
            return '-';
          return cellValue + ' 厘米';
        },
      },
      {
        label: '体重',//（单位：公斤/KG）
        prop: 'weight',
        formatter: function (row, column, cellValue, index) {
          if (!cellValue || cellValue == '')
            return '-';
          return cellValue + ' 公斤';
        },
      },
      {
        label: '血型',//，参见item_class_code='blood_type'定义
        prop: 'bloodType',
        type: 'tree',
        defaultExpandAll: false,
        dicUrl: `${treeUrl}/blood_type`,
        parent: false,
        props: {
          children: 'childNodes',
          label: 'itemName',
          value: 'itemId'
        },
      },
      {
        label: '家族遗传史',
        prop: 'geneticHistory'
      },
      {
        label: '既往病史',
        prop: 'medicalHistory'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        hide: true,
        viewDisplay: true,
        editDisplay: false,
        addDisplay: false,
        disabled: true,
      },]
  },{
    column: []
  }]
}
