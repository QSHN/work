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
  insured_type: [{
    label: '在职',
    value: 0
  }, {
    label: '退休',
    value: 1
  }],
  medicare_type: [{
    label: '市职工医保（长护险）',
    value: '0'
  }, {
    label: '城镇医保',
    value: '1'
  }, {
    label: '公费医疗',
    value: '2'
  }, {
    label: '新农合医保',
    value: '3'
  }, {
    label: '其他类型',
    value: '4'
  }],
  shipping_method: [{
    label: '邮寄',
    value: 0
  }, {
    label: '自行领取',
    value: 1
  }],
  ltci_status:[{
    label: '草稿',
    value: 0
  },{
    label: '已提交',
    value: 1
  },{
    label: '已初评',
    value: 2
  },{
    label: '已递交',
    value: 3
  },{
    label: '已现场评估',
    value: 4
  },{
    label: '已集体评审',
    value: 5
  },{
    label: '审核通过',
    value: 6
  },{
    label: '已撤销',
    value: 8
  },{
    label: '已驳回',
    value: 9
  }]
}

const baseUrl = `/nursing`
const zoneUrl = `${baseUrl}/oms/zone/zone/trees`
const custUrl = `${baseUrl}/oms/cust`

function f() {
  console.log(111)
}

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
  viewBtn: true,
  column: [
	  // {
    //   label: '系统流水id',
    //   prop: 'formId'
    // },
	  // {
    //   label: '会员id',
    //   prop: 'vipId'
    // },
	  {
      label: '申请单状态',
      prop: 'formState',
      disabled: true,
      type: 'select',
      dicUrl: `/nursing/oms/aid/itemtrees/ltci_form_state`,
      addDisplay: false,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
	  {
      label: '服务对象',
      prop: 'custId',
      formslot:true
    },
	  {
      label: '参保人姓名',
      prop: 'insuredName'
    },
	  {
      label: '参保人身份证号',
      prop: 'insuredIdNo'
    },
	  {
      label: '参保人联系电话',
      prop: 'insuredPhone'
    },
	  {
      label: '参保人联系地址',
      prop: 'insuredAddress'
    },
	  {
      label: '参保人所在区域',
      prop: 'insuredZoneId',
      type: 'tree',
      dicUrl: `${zoneUrl}`,
      props: {
        children: 'childNodes',
        label: 'zoneName',
        value: 'zoneId'
      },
      rules: [{required: false, message: '请选择区域', trigger: 'blur'}]
    },
	  {
      label: '参保人员类别',
      prop: 'insuredType',
      valueDefault: "0",
      type: 'radio',
      dicData: DIC.insured_type
    },
	  {
      label: '医保类型',
      prop: 'medicare_type',
      valueDefault: "0",
      type: 'select',
      dicData: DIC.medicare_type,
      rules: [{
        required: true,
        message: '请选择医保类别',
        trigger: 'blur'
      }]
    },
	  {
      label: '医保卡号',
      prop: 'medicareNo'
    },
	  {
      label: '就诊卡号',
      prop: 'medicalCardNo'
    },
	  {
      label: '身高（单位：厘米/CM）',
      prop: 'height'
    },
	  {
      label: '体重（单位：公斤/KG）',
      prop: 'weight'
    },
	  {
	    //(后面加入二级管理)
      label: '语言种类',
      prop: 'language'
    },
	  {
      label: '补充说明',
      prop: 'remark'
    },
	  {
      label: '自评得分',
      prop: 'selfcareScore'
    },
	  {
      label: '联系人',
      prop: 'linkman'
    },
	  {
      label: '联系电话',
      prop: 'linkmanPhone'
    },
	  {
      label: '联系地址',
      prop: 'linkmanAddress'
    },
	  {
      label: '代理人姓名',
      prop: 'agentName'
    },
	  {
      label: '代理人联系电话',
      prop: 'agentPhone'
    },
	  {
      label: '代理人与参保人之间的关系',
      prop: 'agentRelation'
    },
	  {
      label: '长护险通过的告知书领取方式',
      prop: 'shippingMethod',
      valueDefault: "0",
      type: 'select',
      dicData: DIC.shipping_method
    },
	  {
      label: '原因(通常用于填写驳回理由)',
      prop: 'reason'
    },
	  // {
    //   label: '审核人id',
    //   prop: 'checkerId',
    //   disabled: true
    // },
	  // {
    //   label: '审核人name【冗余】',
    //   prop: 'checkerName',
    //   disabled: true
    // },
	  // {
    //   label: '审核时间',
    //   prop: 'checkTime',
    //   disabled: true
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
    //   label: '建档人name',
    //   prop: 'creatorName',
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
    //   display: false,
    // },
  ]
}
