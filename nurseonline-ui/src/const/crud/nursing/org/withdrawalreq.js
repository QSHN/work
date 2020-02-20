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

import {currentOrg} from '@/api/nursing/org/org'
import {fetchTreeByItemClassCode} from '@/api/nursing/aid/itemclass'


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

  currentOrg().then(res => {
    if (res.data.data.balance >= value) {
      callback();
    } else {
      callback(new Error('提现金额不能大于账户余额，当前账户余额：' + res.data.data.balance));
    }
  })
};

let accountTypeValidate = (obj) => {
  if (obj.value === '2') {
    tableOption.column[5]['addDisabled'] = false;
    tableOption.column[6]['addDisabled'] = false;
    tableOption.column[5]['rules'][0]['required'] = true;
    tableOption.column[6]['rules'][0]['required'] = true;
  } else {
    tableOption.column[5]['addDisabled'] = true;
    tableOption.column[6]['addDisabled'] = true;
    tableOption.column[5]['rules'][0]['required'] = false;
    tableOption.column[6]['rules'][0]['required'] = false;
  }
};

let banks = new Map();

let updateBankName = (obj) => {
  if (banks.size < 1) {
    fetchTreeByItemClassCode("bank").then(res => {
      res.data.data.forEach(i => {
        banks.set(i.itemId, i.descr)
      })
    })
  }
};

let updateName = (value) => {
  return value;
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
};

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
    //   label: '提现机构id',
    //   prop: 'orgId'
    // },
    {
      label: '提现机构名称',
      prop: 'orgName',
      disabled: true,
      addDisplay: false
    },
    {
      label: '账户类型',
      prop: 'accountType',
      type: "select",
      dicData: DIC.account_type,
      change: accountTypeValidate,
      rules: [
        {
          required: true,
          message: '请选择账户类型'
        }
      ]
    },
    {
      label: '账户名称',
      prop: 'accountName',
      placeholder: "请输入账户，如提现人",
      rules: [{
        required: true,
        message: '请输入账户，如提现人'
      }]
    },
    {
      label: '账户',
      prop: 'accountNo',
      placeholder: "请输入账户，如支付宝账号、银行卡号等",
      rules: [{
        required: true,
        message: '请输入账户，如支付宝账号、银行卡号等'
      }]
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
      dicUrl: `/nursing/oms/aid/itemtrees/bank`,

      addDisabled: true,
      // change: updateBankName,
      props: {
        children: 'childNodes',
        label: 'itemName',
        value: 'itemId',
      },
      rules: [
        {
          required: false,
          message: '请输入银行代码'
        }]
    },
    {
      label: '银行名称',
      prop: 'bankName',
      emptyText: '123456',
      addDisabled: true,
      rules: [
        {
          required: false,
          message: '请输入银行名称'
        }]
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
    },
    {
      label: '付款流水编号',
      prop: 'paymentId',
      addDisplay: false,
    },
    // {
    //   label: '审核时间',
    //   prop: 'checkTime'
    // },
    // {
    //   label: '审核人id',
    //   prop: 'checkerId'
    // },
    {
      label: '审核人姓名',
      prop: 'checkerName',
      addDisplay: false,
      editDisplay: false,
    },
    {
      label: '审核时间',
      prop: 'submitTime',
      addDisplay: false,
      editDisplay: false,
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
      search: true
    },
    // {
    //   label: '修改时间',
    //   prop: 'updateTime'
    // },
  ]
};
