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
export const certOption = {
  showHeader: false,
  indexLabel: '序号',
  menu: false,
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: true,
  column: [
    {
      label: '资质类别',
      prop: 'certType',
      hide: true,
      type: 'tree',
      defaultExpandAll: false,
      dicUrl: `${treeUrl}/cust_cert_type`,
      parent: false,
      showColumn:false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{
        required: true,
        message: '请选择资质类别',
        trigger: 'blur'
      }],
      cascaderItem: ['certTypeName']
    },
    {
      label: '资质名称',
      prop: 'certTypeName',
      hide: true,
      showColumn:false,
      rules: [{
        required: true,
        message: '请填写资质名称',
        trigger: 'blur'
      }]
    },
    {
      label: '材料号码',
      prop: 'certNo',
      hide: true,
      showColumn:false,
      rules: [{
        required: true,
        message: '请输入材料号码',
        trigger: 'blur'
      }]
    },
    {
      label: '生效日期',
      prop: 'fromDate',
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      hide: true,
      showColumn:false,
      rules: [{
        required: true,
        message: '请选择生效日期',
        trigger: 'blur'
      }]
    },
    {
      label: '有效期至',
      prop: 'validDate',
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      hide: true,
      showColumn:false,
      rules: [{
        required: true,
        message: '请选择有效期至',
        trigger: 'blur'
      }]
    },
    {
      label: '资质描述',
      prop: 'certDesc',
      hide: true,
      showColumn:false,
      valueFormat: 'yyyy-MM-dd',
    },
    {
      label: '创建时间',
      prop: 'createTime',
      hide: true,
      showColumn:false,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '图片路径',
      prop: 'certImgPath',
      slot: true,
      type: 'upload',
      action: '/nursing/oms/cust/cert/upload',
      listType : 'picture-img',
      dataType: 'json',
      span:24,
      sort:1,
      limit: 1,
      propsHttp:{
        url: 'data'
      },
      props:{
        value: 'certImgPath'
      }
      ,
      rules: [{
        required: true,
        message: '请上传图片',
        trigger: 'blur'
      }],
    },
  ]
}
