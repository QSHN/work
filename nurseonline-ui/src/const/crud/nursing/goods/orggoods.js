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
  combo: [{
    label: '否',
    value: '0'
  }, {
    label: '是',
    value: '1'
  }]
}
const baseUrl = `/nursing`
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  maxWidth: 380,
  maxHeight: 520,
  size: 'small',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      label: '机构商品ID',
      prop: 'orgGoodsId',
      hide: true,
      width: 100,
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '机构商品代码',
      prop: 'orgGoodsCode',
      width: 110,
      rules: [{
        required: true,
        message: '请输入机构商品代码'
      }]
    },
    {
      label: '套餐',
      prop: 'comboFlag',
      // type: 'select',
      type: "radio",
      search: true,
      dicData: DIC.combo,
      mock:{
        type:'dic'
      },
      tip: "如果【否】，【商品ID】必须选择一个平台商品！",
      rules: [{
        required: true,
        message: '请选择是否套餐'
      }]
    },
    // {
    //   label: '机构id，引用org.org_id',
    //   prop: 'orgId'
    // },
    {
      label: '商品ID',
      prop: 'goodsId',
      formslot: true
    },
    {
      label: '商品标题',
      prop: 'goodsLabel',
      width: 180,
      overHidden: true,
      rules: [{
        // required: true,
        message: '请输入商品标题'
      }],
      tip: "套餐为否时，如果不填默认值为平台商品的标题",
    },
    {
      label: '规格',
      prop: 'spec'
    },
    {
      label: '型号',
      prop: 'model'
    },
    {
      label: '计价单位',
      prop: 'unit'
    },
    {
      label: '价格',
      prop: 'price',
      rules: [{
        required: true,
        message: '请输入价格'
      }]
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'date',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisabled: true,
      // more: true,
      // search: true
    },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
    // {
    //   label: '版本号，默认=1，每次变更递增',
    //   prop: 'versionNo'
    // },
  ]
}
