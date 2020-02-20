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
  submitText: '完成',
  column: [
    {
      label: '系统流水id',
      prop: 'scheduleId',
      hide: true,
      display: false,
    },
    {
      label: '标签',
      prop: 'label',
      span: 24,
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }]
    },
    {
      label: '人员id',
      prop: 'staffId',
      hide: true,
      display: false,
    },
    {
      label: '所在服务机构id',
      prop: 'orgId',
      hide: true,
      display: false,
    },
    {
      label: '周日',
      prop: 'data1',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
    },
    {
      label: '周一',
      prop: 'data2',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
    },
    {
      label: '周二',
      prop: 'data3',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
    },
    {
      label: '周三',
      prop: 'data4',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
    },
    {
      label: '周四',
      prop: 'data5',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
    },
    {
      label: '周五',
      prop: 'data6',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
    },
    {
      label: '周六',
      prop: 'data7',
      rules: [{
        required: true,
        message: "请填写周一排班",
        trigger: "blur"
      }, {
        min: 24,
        max: 24,
        message: "内容为0和1组成的24位字符串",
        trigger: "blur"
      }]
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
      prop: 'createTime',
      disabled: true,
    },
    {
      label: '版本号',
      prop: 'versionNo',
      hide: true,
      display: false,
    },
  ]
}
