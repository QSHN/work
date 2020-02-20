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

import {currentStaff} from '@/api/nursing/staff/staffwithdrawalreq'

let validateAmt = (rule, value, callback) => {

  //判断是否整数或小数，不允许点后面为空，允许点前面为空
  let regex1 = /^\d*(\.\d+)?$/;
  //判断小数是否不超出两位
  let regex2 = /^\d*(\.\d{1,2})?$/;
  if (!regex1.test(value)) {
    callback(new Error('格式错误，请输入大于0的数字!'));
  }
  if (!regex2.test(value)) {
    callback(new Error('提现金额只能精确到小数点后两位!'));
  }
  if (value <= 0) {
    callback(new Error('提现金额必须大于0!'));
  }

  currentStaff().then(res => {
    if (res.data.data.balance >= value) {
      callback();
    } else {
      callback(new Error('提现金额不能大于账户余额，当前账户余额：' + res.data.data.balance));
    }
  })
};

const DIC = {
  account_type: [
    {
      label: "支付宝",
      value: "0"
    }, {
      label: "微信支付",
      value: "1"
    }, {
      label: "银行卡",
      value: "2"
    }
  ],
  state: [
    {
      label: "处理中",
      value: 0
    }, {
      label: "处理完毕",
      value: 1
    }, {
      label: "处理异常",
      value: 2
    }
  ]
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
  column: [
	  // {
    //   label: '系统流水id',
    //   prop: 'reqId'
    // },
	  // {
    //   label: '服务人员id',
    //   prop: 'staffId'
    // },
	  {
      label: '服务人员名称',
      prop: 'staffName'
    },
	  {
      label: '账户类型',
      prop: 'accountType',
      type: "select",
      dicData: DIC.account_type,
      rules: [{
        required: true,
        message: '请输入账户类型'
      }]
    },
	  {
      label: '账户名称',
      prop: 'accountName',
      rules: [{
        required: true,
        message: '请输账户名称'
      }]
    },
	  {
      label: '账户',
      prop: 'accountNo',
      rules: [{
        required: true,
        message: '请输入账户'
      }],
      overHidden: true,
    },
    {
      label: '提现金额',
      prop: 'amt',
      rules: [
        {
          required: true,
          message: '请输入金额'
        },
        {validator: validateAmt, trigger: 'blur'},
      ]
    },
	  {
      label: '银行代码',
      prop: 'bankCode',
      type: "select",
      hide: true,
      dicUrl: `/nursing/oms/aid/itemtrees/bank`,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId'
      },
    },
	  {
      label: '银行名称',
      prop: 'bankName'
    },
	  {
      label: '处理状态',
      prop: 'state',
      type: "select",
      addDisplay: false,
      searchDefault: 0,
      dicData: DIC.state,
      search: true
    },
	  {
      label: '原因描述',
      prop: 'reason',
      addDisplay: false,
      overHidden: true,
    },
	  {
      label: '付款流水编号',
      prop: 'paymentId',
      addDisplay: false,
    },
	  {
      label: '审核时间',
      prop: 'checkTime',
      addDisplay: false,
      editDisplay: false,
    },
	  // {
    //   label: '审核人id',
    //   prop: 'checkerId'
    // },
	  {
      label: '审核人姓名',
      prop: 'checkerName'
    },
	  {
      label: '提交时间',
      prop: 'submitTime',
      display: false,
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      more: true,
      search: true,
    },
	  {
      label: '提交日期',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      width: 100,
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      addDisplay: false,
      editDisplay: false,
      more: true,
      search: false,
      overHidden: true,
    },
	  // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
  ]
}
