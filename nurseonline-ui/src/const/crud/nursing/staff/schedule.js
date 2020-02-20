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
      prop: 'scheduleId'
    },
	  {
      label: '人员id，引用org_staff.staff_id',
      prop: 'staffId'
    },
	  {
      label: '起始日期（含该日），该日期对应的排班数据为data1',
      prop: 'beginDate'
    },
	  {
      label: '截至日期（含该日），一般按周排班，即from_date+6',
      prop: 'endDate'
    },
	  {
      label: '第1日排班数据，24个字符分别对应每日24个时段，每个字符用0/1分别表示该时段是空闲或者勿扰，下同。',
      prop: 'data1'
    },
	  {
      label: '第2日排班数据<同上>',
      prop: 'data2'
    },
	  {
      label: '第3日排班数据<同上>',
      prop: 'data3'
    },
	  {
      label: '第4日排班数据<同上>',
      prop: 'data4'
    },
	  {
      label: '第5日排班数据<同上>',
      prop: 'data5'
    },
	  {
      label: '第6日排班数据<同上>',
      prop: 'data6'
    },
	  {
      label: '第7日排班数据<同上>',
      prop: 'data7'
    },
    {
      label: '第1日(周1)排班数据，24个字符分别对应每日24个时段，每个字符用0/1/2分别表示该时段是空闲/勿扰/已派单',
      prop: 'data1a'
    },
    {
      label: '第2日排班数据<同上>',
      prop: 'data2a'
    },
    {
      label: '第3日排班数据<同上>',
      prop: 'data3a'
    },
    {
      label: '第4日排班数据<同上>',
      prop: 'data4a'
    },
    {
      label: '第5日排班数据<同上>',
      prop: 'data5a'
    },
    {
      label: '第6日排班数据<同上>',
      prop: 'data6a'
    },
    {
      label: '第7日排班数据<同上>',
      prop: 'data7a'
    },
    {
      label: '该排班对应的常用地址，引用staff_address.address_id',
      prop: 'addressId'
    },
    {
      label: '该地址的区域id',
      prop: 'addressZoneId'
    },
    {
      label: ' 该地址的GPS位置，来自staff_address.position，用于快速获取与目标地点的距离',
      prop: 'addressPosition'
    },
	  {
      label: '创建时间，默认=当前时间',
      prop: 'createTime'
    },
	  {
      label: '修改时间',
      prop: 'updateTime'
    },
	  {
      label: '版本号',
      prop: 'versionNo'
    },
  ]
}
