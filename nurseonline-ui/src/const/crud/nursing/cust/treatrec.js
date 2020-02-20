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
  menu: false,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
	  // {
    //   label: '流水编码',
    //   prop: 'recId'
    // },
	  // {
    //   label: '服务对象id',
    //   prop: 'custId'
    // },
	  // {
    //   label: '医院id',
    //   prop: 'orgId'
    // },
	  {
      label: '医院名称',
      prop: 'orgName'
    },
	  // {
    //   label: '科室id',
    //   prop: 'deptId'
    // },
	  {
      label: '科室名称',
      prop: 'deptName'
    },
	  {
      label: '主要诊断',
      prop: 'mainDiagnosis',
      hide: true,
    },
	  {
      label: '主要症状',
      prop: 'mainSymptom'
    },
	  {
      label: '出院小结',
      prop: 'imgUrl',
      type:'upload',
      dataType:'array',
      listType:'picture-card',
      imgFullscreen:true,
      span:24,
      imgType: 'card',
      // span: 24,
      // imgFullscreen: true,
      // formatter后于listType的处理，所以不能此处格式换字符串
      // formatter:function(row, column, cellValue, index){
      //   let str = cellValue.replace(/;$/g,'').split(';')
      //   console.logt("strsafasdfsdfsd ", str)
      //   return str;
      // },
    },
    {
      label: '治疗日期',
      prop: 'treatDate'
    },
	  // {
    //   label: '建档人id',
    //   prop: 'creatorId'
    // },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
	  {
      label: '版本号',
      prop: 'versionNo',
      hide: true
    },
  ]
}
