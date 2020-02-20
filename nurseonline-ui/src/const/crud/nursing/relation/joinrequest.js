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
const zoneUrl = `${baseUrl}/zone/zone/trees`

const DIC = {
  state: [{
    label: '待审核',
    value: 0
  }, {
    label: '审核通过',
    value: 1
  }, {
    label: '审核未通过',
    value: 2
  }],
}


export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'left',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  column: [
	  {
      label: '流水id',
      prop: 'reqId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
    },
	  {
      label: '人员id',
      prop: 'staffId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  {
      label: '人员姓名',
      prop: 'staffName',
      search: true,
    },
	  {
      label: '机构id',
      prop: 'orgId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  {
      label: '机构名称',
      prop: 'orgName',
      hide: true,
    },
	  {
      label: '科室id',
      prop: 'deptId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  {
      label: '科室名称',
      prop: 'deptName',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
    {
      label: '申请状态',//0-已提交（默认），1-审核通过，2-驳回
      prop: 'state',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
      type: "select",
      dicData: DIC.state,
      search: true,
      searchDefault: 0,
    },
	  {
      label: '原因',
      prop: 'reason',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true,
      span: 24,
    },
	  {
      label: '核发时间',
      prop: 'checkTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  {
      label: '审核人id',
      prop: 'checkerId',
      hide: true,
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  {
      label: '审核人',
      prop: 'checkerName',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  {
      label: '创建时间',
      prop: 'createTime',
      viewDisplay: true,
      editDisplay: false,
      addDisplay: false,
      disabled: true
    },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime',
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
