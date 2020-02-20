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

const baseUrl = `/nursing`
const treeUrl = `${baseUrl}/oms/aid/itemtrees`
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuWidth: 130,
  maxWidth: 380,
  maxHeight: 520,
  size: 'small',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      fixed: true,
      label: '商品id',
      prop: 'goodsId',
      editDisabled: true,
      addDisplay: false,
      hide: true,
      width: 80
    },
    {
      label: '商品代码',
      prop: 'goodsCode',
      editDisabled: true,
      width: 120,
      // slot: true,
      // search: true,
      // span: 24,
      rules: [{
        required: true,
        message: '请输入商品代码',
        trigger: "blur"
      },
        {
          min: 3,
          max: 32,
          message: '长度在 3 到 32 个字符',
          trigger: 'blur'
        }
        // {validator: validateGoodsCode, trigger: 'blur'}
      ]
    },
    {
      label: '商品图片',
      prop: 'imgUrl',
      // slot: true,
      formslot: true,
      formWidth: "100%",
      // width: 250,
      hide: true,
      span: 24
    },
    {
      label: '商品名称',
      prop: 'goodsName',
      width: 200,
      overHidden: true,
      rules: [{
        required: true,
        message: '请输入机商品名称',
        trigger: "blur"
      }]
    },
    // 需要在树里面选择？
    {
      label: '商品类别',
      prop: 'goodsType',
      type: 'select',
      dicUrl: `${treeUrl}/goods_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: false, message: '请选择商品类别', trigger: 'blur'}]
    },
    {
      label: '生产企业',
      prop: 'manufacturer',
      overHidden: true,
      width: 200
    },
    {
      label: '包装规格',
      prop: 'spec'
    },
    {
      label: '型号',
      prop: 'model'
    },
    {
      label: '基本单位',
      prop: 'baseUnit'
    },
    {
      label: '参考价格',
      prop: 'refPrice',
      hide: true,
      rules: [{
        required: true,
        message: '请输入参考价格'
      }]
    },
    {
      label: '建档人',
      prop: 'creatorName',
      hide: true,
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '商品介绍',
      prop: 'intro',
      hide: true,
      type: 'textarea',
      overHidden: true,
      span: 24
    },
    // {
    //   label: '是否删除，0：正常（默认），1：已删除',
    //   prop: 'delFlag'
    // },
    // {
    //   label: '建档人id，引用sys_user.user_id',
    //   prop: 'creatorId'
    // },
    {
      label: '创建日期',
      prop: 'createTime',
      type: 'date',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisplay: false,
      more: true,
      search: true
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
