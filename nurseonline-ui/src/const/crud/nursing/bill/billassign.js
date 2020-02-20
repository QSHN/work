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
      prop: 'assignId'
    },
	  {
      label: '订单id',
      prop: 'billId'
    },
	  {
      label: '任务id，引用bill_task.task_id',
      prop: 'taskId'
    },
	  {
      label: '服务机构id',
      prop: 'orgId'
    },
	  {
      label: '服务人员id，引用org_staff.staff_id',
      prop: 'staffId'
    },
	  {
      label: '优先次序，分为1~5级，按该优先级一次发送通知',
      prop: 'priority'
    },
	  {
      label: '状态，0-待确认，1-已确认，2-已拒绝，3-已失效',
      prop: 'state'
    },
	  {
      label: '拒绝原因（对拒绝操作有效）',
      prop: 'refuseReason'
    },
	  {
      label: '确认时间',
      prop: 'confirmTime'
    },
	  {
      label: '确认人id，引用sys_user.user_id',
      prop: 'confirmorId'
    },
	  {
      label: '是否删除，0：正常（默认），1：已删除',
      prop: 'delFlag'
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
      label: '修改时间',
      prop: 'updateTime'
    },
	  {
      label: '版本号，默认=1，每次变更递增',
      prop: 'versionNo'
    },
  ]
}
