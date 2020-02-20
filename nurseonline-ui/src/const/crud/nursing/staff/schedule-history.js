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
      prop: 'scheduleId',
      hide: true,
    },
	  {
      label: '人员id',
      prop: 'staffId',
      hide: true,
    },
	  {
      label: '起始日期',
      prop: 'beginDate'
    },
	  {
      label: '截至日期',
      prop: 'endDate'
    },
	  {
      label: '第1日排班数据',
      prop: 'data1'
    },
	  {
      label: '第2日排班数据',
      prop: 'data2'
    },
	  {
      label: '第3日排班数据',
      prop: 'data3'
    },
	  {
      label: '第4日排班数据',
      prop: 'data4'
    },
	  {
      label: '第5日排班数据',
      prop: 'data5'
    },
	  {
      label: '第6日排班数据',
      prop: 'data6'
    },
	  {
      label: '第7日排班数据',
      prop: 'data7'
    },
    {
      label: '常用地址',
      prop: 'addressId'
    },
    {
      label: '限定区域',
      prop: 'addressZoneId'
    },
    {
      label: 'GPS位置',
      prop: 'addressPosition'
    },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
  ]
}
