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
const DIC = {
  kitFlag: [{
    label: '无',
    value: '0'
  }, {
    label: '有',
    value: '1'
  }],
  itemFlag: [{
    label: '无明细',
    value: '0'
  }, {
    label: '组成明细',
    value: '1'
  // }, {
  //   label: '报价明细',
  //   value: '2'
  }],
  drugFlag: [{
    label: '无需药品',
    value: '0'
  }, {
    label: '必备药品',
    value: '1'
  }],
  exclusive: [{
    label: '否',
    value: '0'
  }, {
    label: '是',
    value: '1'
  }],
}
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
      // fixed: true,
      label: '机构服务ID',
      prop: 'orgServiceId',
      hide: true,
      editDisabled: true,
      addDisplay: false
    },
	  // {
    //   label: '机构ID',
    //   prop: 'orgId'
    // },
	  {
      label: '平台服务ID',
      prop: 'serviceId',
      hide: true,
      formslot: true
    },
    {
      label: '服务名称',
      prop: 'serviceLabel'
    },
    {
      label: '服务类别',
      prop: 'serviceType',
      type: 'tree',
      formslot: true,
      width: 120,
      dicUrl: `${treeUrl}/service_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择服务类别', trigger: 'blur'}]
    },
	  {
      label: '计费方式',
      prop: 'chargeType',
      type: 'select',
      width: 120,
      dicUrl: `${treeUrl}/charge_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择计费方式', trigger: 'blur'}]
    },
	  {
      label: '计价单位',
      prop: 'unit'
    },
	  {
      label: '单价',
      prop: 'price',
    },
	  {
      label: '工具包',
      prop: 'kitFlag',
      type: "radio",
      // search: true,
      // slot: true,
      // span: 24,
      rules: [{
        required: true,
        message: '请选择是否需要工具包',
        trigger: 'blur'
      }],
      dicData: DIC.kitFlag
    },
	  {
      label: '工具包商品ID',
      prop: 'kitGoodsId',
      formslot: true,
      hide: true
    },
	  {
      label: '工具包标题',
      prop: 'kitGoodsLabel'
    },
	  {
      label: '工具包单价',
      prop: 'kitPrice',
      editDisabled: true,
      addDisabled: true
    },
	  {
      label: '工具包数量',
      prop: 'kitQty'
    },
	  {
      label: '明细标识',
      prop: 'itemFlag',
      hide: true,
      type: "radio",
      tip: "如果【否】，【服务ID】必须选择一个平台服务！",
      // search: true,
      // slot: true,
      // span: 24,
      rules: [{
        required: true,
        message: '请选择是否需要工具包',
        trigger: 'blur'
      }],
      dicData: DIC.itemFlag
    },
	  {
      label: '药品标识',
      prop: 'drugFlag',
      hide: true,
      type: "radio",
      // search: true,
      // slot: true,
      // span: 24,
      rules: [{
        required: true,
        message: '请选择是否需要药品',
        trigger: 'blur'
      }],
      dicData: DIC.drugFlag
    },
	  // {
    //   label: '是否删除，0：正常（默认），1：已删除  ',
    //   prop: 'delFlag'
    // },
	  {
      label: '创建时间',
      prop: 'createTime',
      hide: true,
      type: 'date',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisabled: true,
    },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
	  // {
    //   label: '版本号，默认=1，每次变更递增',
    //   prop: 'versionNo'
    // },
    {
      label: '住院专供',
      prop: 'exclusive',
      type: "radio",
      rules: [{
        required: true,
        message: '请选择是否住院专供',
        trigger: 'blur'
      }],
      dicData: DIC.exclusive
    },
  ]
}
