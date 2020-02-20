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
  certState: [{
    label: '待审',
    value: 0
  }, {
    label: '审核通过',
    value: 1
  }, {
    label: '审核不通过',
    value: 2
  }]
}

const baseUrl = `/nursing/oms`
const treeUrl = `${baseUrl}/aid/itemtrees`

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'left',
  maxHeight: 620,
  size: 'small',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      label: '系统流水id',
      prop: 'staffCertId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
    },
    {
      label: '服务人员id',
      prop: 'staffId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '人员名称',
      prop: 'staffName',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
      search: true,
    },
    {
      label: '资质类别',
      prop: 'certType',
      disabled: true,
      search: true,
      type: 'select',
      dicUrl: `${treeUrl}/staff_cert_type`,
      parent: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
    {
      label: '资质名称',
      prop: 'certTypeName'
    },
    {
      label: '资质标签',
      prop: 'certTag'
    },
    {
      label: '材料号码',
      prop: 'certNo'
    },
    {
      label: '生效日期',
      prop: 'fromDate'
    },
    {
      label: '有效期至',
      prop: 'validDate'
    },
    {
      label: '资质描述',
      prop: 'remark'
    },
    {
      label: '图片路径',
      prop: 'imgUrl',
      slot: true,
      // type: 'upload',
      // imgFullscreen: true,
      // imgType: 'card',
      // listType: 'picture-card',
      // span: 24,
    },
    {
      label: '资质状态',
      prop: 'certState',
      type: 'select',
      dicData: DIC.certState,
      valueDefault: 0,
      searchDefault:0,
      search: true,
    },
    // {
    //   label: '是否删除，0：正常（默认），1：已删除  ',
    //   prop: 'delFlag'
    // },
    {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
      sortable: true,
    },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    {
      label: '版本号',
      prop: 'versionNo',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
  ]
}

export const detailOption = {
  group: [
    {
      column: [{
        label: '资质名称',
        prop: 'certTypeName'
      }],
    },
    {
      column: [{
        label: '资质类别',
        prop: 'certType',
        dicUrl: `${treeUrl}/staff_cert_type`,
        props: {
          children: 'childNodes',
          label: 'itemName',
          value: 'itemId'
        },
      }],
    },
    {
      column: [{
        label: '资质标签',
        prop: 'certTag',
      }],
    },
    {
      column: [{
        label: '材料号码',
        prop: 'certNo'
      }],
    },
    {
      column: [{
        label: '资质状态',
        prop: 'certState',
        dicData: DIC.certState,
      }],
    },
    {
      column: [{
        label: '备注信息',
        prop: 'remark',
      }],
    },
    {
      column: [{
        label: '生效日期',
        prop: 'fromDate',
      }],
    },
    {
      column: [{
        label: '有效期至',
        prop: 'validDate',
      }],
    },
    {
      column: [{
        label: '上传时间',
        prop: 'createTime',
      }],
    }
  ]
}
