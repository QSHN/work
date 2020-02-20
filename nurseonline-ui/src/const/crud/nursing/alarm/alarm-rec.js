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
  alarmState: [{
    // label: '已提交（待处理）',
    label: '待处理',
    value: 0
  }, {
    // label: '已受理（处理中）',
    label: '处理中',
    value: 1
  }, {
    label: '已处理',
    value: 2
  }],
  userType: [{
    label: '会员',
    value: '0'
  }, {
    label: '服务人员',
    value: '1'
  }],
}
const baseUrl = `/nursing`
const treeUrl = `${baseUrl}/oms/aid/itemtrees`
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
      label: '报警id',
      prop: 'recId',
      hide: true,
      editDisabled: true,
      addDisplay: false
    },

	  {
      label: '用户id',
      prop: 'userId',
      hide: true
    },
	  {
      label: '用户名称',
      prop: 'userName'
    },
	  {
      label: '用户类别',
      prop: 'userType',
      type: "radio",
      search: true,
      // editDisabled: true,
      // addDisplay: false,
      dicData: DIC.userType
    },
    {
      label: '手机号',
      prop: 'phone'
    },
	  {
      label: '报警区域ID',
      prop: 'zoneId',
      hide: true
    },
	  {
      label: '报警区域',
      prop: 'zoneName'
    },
	  {
      label: '报警经纬度',
      prop: 'position',
      hide: true
    },
	  {
      label: '报警地址',
      prop: 'address'
    },
	  {
      label: '受理人ID',
      prop: 'accepterId',
      hide: true
    },
    {
      label: '报警类型',
      prop: 'alarmType',
      type: 'select',
      width: 120,
      // search: true,
      dicUrl: `${treeUrl}/alarm_type`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
      rules: [{required: true, message: '请选择报警类型', trigger: 'blur'}]
    },
	  {
      label: '受理人',
      prop: 'accepterName'
    },
	  {
      label: '受理时间',
      prop: 'acceptTime',
      hide: true
    },
	  {
      label: '受理内容描述',
      prop: 'acceptDesc',
      hide: true
    },
	  {
      label: '处理机构ID',
      prop: 'handleOrgId',
      hide: true
    },
	  {
      label: '处理机构',
      prop: 'handleOrgName',
      hide: true
    },
	  {
      label: '处理用户ID',
      prop: 'handlerId',
      hide: true
    },
	  {
      label: '处理人',
      prop: 'handlerName'
    },
	  {
      label: '处理时间',
      prop: 'handleTime',
      hide: true
    },
	  {
      label: '处理内容描述',
      prop: 'handleDesc',
      hide: true
    },
	  {
	    // 存储机构id列表，格式为【,orgId,orgId,orgId,】，前后都有","
      label: '相关机构列表',
      prop: 'relOrgList',
      formslot: true,
      hide: true
    },
    {
      label: '状态',
      prop: 'alarmState',
      type: "radio",
      search: true,
      dicData: DIC.alarmState,
    },
	  {
      label: '创建时间',
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
    //   prop: 'updateTime',
    //   hide: true
    // },
	  // {
    //   label: '版本号，默认=1，每次变更递增',
    //   prop: 'versionNo'
    // },
  ]
}
