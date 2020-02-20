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

export const checkTableOption = {
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
    //   label: '发票流水id',
    //   prop: 'invoiceId'
    // },
	  {
      label: '发票号码',
      prop: 'invoiceNo',
      addDisplay: false,
    },
	  {
      label: '发票类别',
      prop: 'invoiceType',
      type: "select",
      dicUrl: `/nursing/oms/aid/itemtrees/invoice_type`,
      search: true,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
	  {
      label: '开票日期',
      prop: 'invoiceDate',
      type: 'date',
      format: 'yyyy-MM-dd',
      width: 100,
      valueFormat: 'yyyy-MM-dd',
      addDisplay: false,
      disabled: true,
      more: true,
      search: true
    },
	  {
      label: '发票介质',
      prop: 'invoiceMedia',
      hide: true,
      type: "select",
      valueDefault: '0',
      dicData: [
        {
          label: "电子票",
          value: "0"
        }, {
          label: "纸质发票",
          value: "1"
        }
      ],
      rules: [{
        required: true,
        message: '请选择发票介质'
      }]
    },
	  {
      label: '开票机构id',
      prop: 'orgId',
      addDisplay: false,
      disabled: true
    },
    {
      label: '开票机构',
      prop: 'orgName',
      addDisplay: false,
      disabled: true
    },
	  {
      label: '申请开票会员id',
      prop: 'vipId',
      formslot:true,
      rules: [{
        required: true,
        message: '开票会员不能为空'
      }]
    },
    {
      label: '开票订单',
      prop: 'billIds',
      formslot: true,
      hide: true,
      rules: [{
        required: true,
        message: '开票订单不能为空'
      }]
    },
	  {
      label: '单据状态',
      prop: 'billState',
      type: "select",
      addDisplay: false,
      disabled: true,
      dicUrl: `/nursing/oms/aid/itemtrees/invoice_bill_state`,
      search: true,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
	  {
      label: '发票抬头',
      prop: 'invoiceTitle'
    },
	  {
      label: '抬头类型',
      prop: 'invoiceTitleType',
      hide: true,
      type: "select",
      dicData: [
        {
          label: "企业单位",
          value: "0"
        }, {
          label: "个人/非企业单位",
          value: "1"
        }
      ]
    },
	  {
      label: '发票明细',
      prop: 'invoiceItem',
      hide: true,
    },
	  {
      label: '纳税人识别号',
      prop: 'invoiceTaxNo',
    },
	  {
      label: '地址',
      prop: 'invoiceAddress',
      hide: true,
    },
	  {
      label: '电话',
      prop: 'invoicePhone',
      hide: true
    },
	  {
      label: '开户行',
      prop: 'invoiceBank',
      hide: true
    },
	  {
      label: '账号',
      prop: 'invoiceBankAcc',
      hide: true,
    },
	  {
      label: '含税金额',
      prop: 'invoiceAmt',
      disabled: true,
    },
	  {
      label: '税额',
      prop: 'invoiceTaxAmt',
      hide: true,
    },
	  {
      label: '未税金额',
      prop: 'invoiceNotaxAmt',
    },
	  {
      label: '开票内容',
      prop: 'invoiceContent',
      hide: true,
    },
	  {
      label: '税率',
      hide: true,
      prop: 'taxRate',
    },
	  {
      label: '收件邮箱',
      hide: true,
      prop: 'email'
    },
	  {
      label: '收件人',
      prop: 'linkman',
      hide: true,
    },
	  {
      label: '手机号码',
      prop: 'mobile',
      hide: true,
    },{
      label: '异常原因',
      prop: 'reason',
    },
	  {
      label: '所在区域',
      prop: 'zoneId',
      type: 'tree',
      dicUrl: `/nursing/oms/zone/zone/trees`,
      defaultExpandAll:false,
      props: {
        children: 'childNodes',
        label: 'zoneName',
        value: 'zoneId'
      },
      rules: [{required: false, message: '请选择区域', trigger: 'blur'}]
    },
	  {
      label: '详细地址',
      prop: 'address',
      hide: true,
    },
	  {
      label: '发票下载地址',
      prop: 'fileUrl',
      hide: true,
    },
	  {
      label: '开票人确认时间',
      prop: 'checkTime',
      addDisplay: false,
      disabled: true,
      editDisplay: false,
      hide: true,
    },
	  // {
    //   label: '审核人id',
    //   prop: 'checkerId'
    // },
	  {
      label: '审核人',
      prop: 'checkerName',
      addDisplay: false,
      disabled: true,
      editDisplay: false,
    },
	  // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
	  {
      label: '提交时间',
      prop: 'submitTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      hide: true,
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisplay: false,
      disabled: true,
      more: true,
    },
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
