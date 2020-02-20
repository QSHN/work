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
	  {
      label: '随访订单号',
      overHidden: true,
      minWidth: 102,
      prop: 'fupBillId'
    },
	  {
      label: '随访订单类型',
      minWidth: 102,
      prop: 'fupBillType'
    },
	  // {
    //   label: '随访订单状态',
    //   prop: 'fupBillState'
    // },
	  {
      label: '支付状态',
      prop: 'payState'
    },
	  // {
    //   label: '随访订单执行状态',
    //   prop: 'executeState'
    // },
	  // {
    //   label: '联系人',
    //   prop: 'linkman'
    // },
	  // {
    //   label: '联系人电话',
    //   prop: 'linkmanPhone'
    // },
	  // {
    //   label: '下单会员id',
    //   prop: 'vipId'
    // },
	  {
      label: '下单会员',
      prop: 'vipName'
    },
	  {
      label: '服务对象',
      overHidden: true,
      prop: 'custName'
    },
	  // {
    //   label: '服务对象电话',
    //   prop: 'custPhone'
    // },
	  // {
    //   label: '',
    //   prop: 'custSex'
    // },
	  // {
    //   label: '',
    //   prop: 'custAge'
    // },
	  {
      label: '服务对象所在地址',
      minWidth: 120,
      overHidden: true,
      prop: 'custAddress'
    },
	  // {
    //   label: '住院时主医医生姓名',
    //   prop: 'doctorName'
    // },
	  // {
    //   label: '病床号',
    //   prop: 'bedNo'
    // },
	  // {
    //   label: '住院时间',
    //   prop: 'inDate'
    // },
	  // {
    //   label: '出院时间',
    //   prop: 'outDate'
    // },
	  // {
    //   label: '服务机构id',
    //   prop: 'orgId'
    // },
	  {
      label: '服务机构名称',
      overHidden: true,
      minWidth: 102,
      prop: 'orgName'
    },
	  // {
    //   label: '科室id',
    //   prop: 'officeId'
    // },
	  {
      label: '科室名称',
      overHidden: true,
      prop: 'officeName'
    },
	  // {
    //   label: '症状描述',
    //   prop: 'symptomsDesc'
    // },
	  // {
    //   label: '疾病描述',
    //   prop: 'diseaseDesc'
    // },
	  // {
    //   label: '接单的服务人员id',
    //   prop: 'staffId'
    // },
	  // {
    //   label: '接单的服务人员name',
    //   prop: 'staffName'
    // },
	  // {
    //   label: '接单的服务人员联系电话',
    //   prop: 'staffPhone'
    // },
	  // {
    //   label: '',
    //   prop: 'serviceName'
    // },
	  // {
    //   label: '单价',
    //   prop: 'followUpPrice'
    // },
	  // {
    //   label: '保险费单价',
    //   prop: 'premiumPrice'
    // },
	  // {
    //   label: '出诊费单价',
    //   prop: 'visitPrice'
    // },
	  // {
    //   label: '应付金额',
    //   prop: 'paymentAmt'
    // },
	  // {
    //   label: '服务机构应得收入',
    //   prop: 'orgAmt'
    // },
	  // {
    //   label: '服务人员应得收入',
    //   prop: 'staffAmt'
    // },
	  // {
    //   label: '运营机构应得收入',
    //   prop: 'operatorAmt'
    // },
	  // {
    //   label: '当前平台/区域的运营机构id',
    //   prop: 'operatorOrgId'
    // },
	  // {
    //   label: '图片路径',
    //   prop: 'proveImgPath'
    // },
	  // {
    //   label: '是否删除',
    //   prop: 'delFlag'
    // },
	  {
      label: '接单时间',
      prop: 'acceptTime'
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
    //   prop: 'versionNo'
    // },
	  {
      label: '预约日期',
      prop: 'reserveDate'
    },
	  // {
    //   label: '预约时间（起始）',
    //   prop: 'reserveTime1'
    // },
	  // {
    //   label: '预约时间（结束）',
    //   prop: 'reserveTime2'
    // },
	  // {
    //   label: '服务机构佣金比例',
    //   prop: 'orgRate'
    // },
	  // {
    //   label: '服务人员佣金比例',
    //   prop: 'staffRate'
    // },
	  // {
    //   label: '运营商佣金比例',
    //   prop: 'operatorRate'
    // },
  ]
}
