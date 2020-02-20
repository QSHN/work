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
      label: '系统流水id',
      prop: 'recId'
    },
	  {
      label: '服务人员id',
      prop: 'staffId'
    },
	  {
      label: '服务人员name',
      prop: 'staffName'
    },
	  {
      label: '相关订单id，引用bill_task.bill_id',
      prop: 'billId'
    },
	  {
      label: '相关任务id，引用bill_task.task_id',
      prop: 'taskId'
    },
	  {
      label: '相关服务机构id，引用bill_task.org_id',
      prop: 'orgId'
    },
	  {
      label: '服务对象id，引用cust.cust_id',
      prop: 'custId'
    },
	  {
      label: '服务对象姓名【冗余】，来自cust.cust_name',
      prop: 'custName'
    },
	  {
      label: '性别，0-未知，1-男，2-女，参见数据字典定义，默认=cust.sex',
      prop: 'sex'
    },
	  {
      label: '年龄，默认=0表示未定义，默认=cust.age',
      prop: 'age'
    },
	  {
      label: '身份证号，默认=cust.id_no',
      prop: 'idNo'
    },
	  {
      label: '联系电话，默认=cust.phone',
      prop: 'phone'
    },
	  {
      label: '状态，参见item_class_code="nurse_rec_state"定义，0-草稿，1-已提交，2-已作废',
      prop: 'state'
    },
	  {
      label: '主要诊断，从辅助资料item表中勾选',
      prop: 'mainDiagnosis'
    },
	  {
      label: '主要症状，从辅助资料item表中勾选',
      prop: 'mainSymptom'
    },
	  {
      label: '服务内容，默认=bill_task.service_label',
      prop: 'serviceContent'
    },
	  {
      label: '个人及家庭状况，引用sys_model.personal_and_family，首次上门填写',
      prop: 'personalAndFamily'
    },
	  {
      label: '既往史，，引用sys_model.disease_history，首次上门填写',
      prop: 'diseaseHistory'
    },
	  {
      label: '护理记录（必备部分），引用sys_model.nursing_assessment_required',
      prop: 'assessmentRequired'
    },
	  {
      label: '护理记录（选填部分），引用sys_model.nursing_assessment_option',
      prop: 'assessmentOption'
    },
	  {
      label: '服务完成记录',
      prop: 'finishedRecord'
    },
	  {
      label: '使用的耗材，默认=bill_task.kit_goods_label(即耗材包）',
      prop: 'consumables'
    },
	  {
      label: '服务完成时间',
      prop: 'finishTime'
    },
	  {
      label: '服务完成后相关图片链接地址',
      prop: 'imgUrl'
    },
	  {
      label: '确认码，服务完成后平台会发送确认码到会员手机，并告知上门护士填写该确认码，以示确认',
      prop: 'confirmationCode'
    },
	  {
      label: '是否删除，0：正常（默认），1：已删除  ',
      prop: 'delFlag'
    },
	  {
      label: '探访时间，即护士上门服务的时间',
      prop: 'visitingTime'
    },
	  {
      label: '记录时间，即提交评估表的时间',
      prop: 'recordingTime'
    },
	  {
      label: '建档人id，引用sys_user.user_id',
      prop: 'creatorId'
    },
	  {
      label: '建档人name，来自sys_user.username',
      prop: 'creatorName'
    },
	  {
      label: '创建时间，默认=当前时间',
      prop: 'createTime'
    },
	  {
      label: '提交时间，即提交服务完成记录的时间',
      prop: 'submitTime'
    },
	  {
      label: '提交人id，引用sys_user.user_id',
      prop: 'submitterId'
    },
	  {
      label: '提交人name，来自sys_user.username',
      prop: 'submitterName'
    },
	  {
      label: '修改时间',
      prop: 'updateTime'
    },
	  {
      label: '版本号，默认=1，每次变更递增',
      prop: 'versionNo'
    },
  ]
}
