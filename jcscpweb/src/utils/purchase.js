export const purchase = {
  contract: {
    key: 'contract',
    label: '合同信息',
    content: [
      // {
      //   name: '序号',
      //   en: 'index',
      //   type: 'input',
      //   isReadOnly: true,
      //   isMust: true
      // },
      // {
      //   name: '编号',
      //   en: 'serial',
      //   type: 'input',
      //   isMust: true
      // },
      {
        name: '委托方',
        en: 'client',
        type: 'select',
        isMust: true
      },
      {
        name: '合同号',
        en: 'contractNumber',
        type: 'input',
        isMust: true
      },
      {
        name: '全联日期',
        en: 'couponDate',
        type: 'date',
        isMust: true
      },
      {
        name: '合同日期',
        en: 'contractDate',
        type: 'date',
        isMust: true
      },
      {
        name: '支付条款',
        en: 'paymentTerm',
        type: 'select',
        isMust: true
      },
      {
        name: '目的港',
        en: 'destinationPort',
        type: 'select',
        isMust: true
      },
      {
        name: '集装箱数',
        en: 'containerNumber',
        type: 'select',
        isMust: true
      },
      {
        name: '出口国',
        en: 'exporter',
        type: 'select',
        isMust: true
      },
      // {
      //   name: '品名（中文）',
      //   en: 'tradeNameCN',
      //   type: 'select',
      //   isMust: true
      // },
      // {
      //   name: '品名（英文）',
      //   en: 'tradeNameEN',
      //   type: 'select',
      //   isMust: true
      // },
      // {
      //   name: '规格',
      //   en: 'specification',
      //   type: 'input',
      //   isMust: true,
      //   isAuto: true
      // },
      // {
      //   name: '包装方式',
      //   en: 'packing',
      //   type: 'input',
      //   isMust: true,
      //   isAuto: true,
      //   isFile: true
      // },
      // {
      //   name: '数量',
      //   en: 'number',
      //   type: 'input',
      //   isMust: true,
      //   isAuto: true
      // },
      // {
      //   name: '净重',
      //   en: 'suttle',
      //   type: 'input',
      //   isMust: true,
      //   isAuto: true
      // },
      // {
      //   name: '单价',
      //   en: 'price',
      //   type: 'input',
      //   isMust: true,
      //   isAuto: true
      // },
      // {
      //   name: '总价值',
      //   en: 'totalValue',
      //   type: 'input',
      //   isMust: true,
      //   defaultMoney: 'USA'
      // },
      {
        name: '货柜尺寸',
        en: 'containerSize',
        type: 'select',
        isMust: true
      },
      {
        name: '装运日期',
        en: 'shipmentDate',
        type: 'date',
        isMust: true
      },
      {
        name: '装运港',
        en: 'shipmentPort',
        type: 'select',
        isMust: true
      },
      {
        name: '供应商',
        en: 'supplier',
        type: 'select',
        isMust: true
      },
      {
        name: '注册码',
        en: 'registrationCode',
        type: 'select',
        isMust: true
      },
      {
        name: '开户行',
        en: 'openingBank',
        type: 'input',
        isMust: true,
        isAuto: true
      },
      {
        name: '银行账号',
        en: 'bankAccount',
        type: 'input',
        isMust: true,
        isAuto: true
      }
    ]
  },
  capital: {
    key: 'capital',
    label: '资金信息',
    content: [
      {
        name: '客户第一次付款',
        en: 'firstPayment',
        type: 'input',
        defaultMoney: 'RMB',
        isMust: true
      },
      {
        name: '预付请款单',
        en: 'paymentAdvance',
        type: 'select',
        selectDefault: ['已提交', '已回签'],
        isMust: true
      },
      {
        name: '付汇日期',
        en: 'remittanceDate',
        type: 'date',
        isMust: true
      },
      {
        name: '购汇汇率',
        en: 'exchangeRates',
        type: 'input',
        isMust: true
      },
      {
        name: '付汇金额',
        en: 'remittanceAmount',
        type: 'input',
        isMust: true
      },
      {
        name: '客户第二次付款',
        en: 'secondPayment',
        type: 'input',
        defaultMoney: 'RMB'
      },
      {
        name: '尾款请款单',
        en: 'retainageAdvance',
        type: 'select',
        selectDefault: ['已提交', '已回签']
      },
      {
        name: '尾款付汇日期',
        en: 'retainageRemittanceDate',
        type: 'date'
      },
      {
        name: '尾款购汇汇率',
        en: 'retainageExchangeRates',
        type: 'input'
      },
      {
        name: '尾款付汇金额',
        en: 'retainageRemittanceAmount',
        type: 'input'
      },
      {
        name: '客户第三次付款',
        en: 'thirdPayment',
        type: 'input',
        defaultMoney: 'RMB'
      },
      {
        name: '海关关税',
        en: 'customDuty',
        type: 'input'
      },
      {
        name: '海关增值税',
        en: 'customDutyTax',
        type: 'input'
      },
      {
        name: '清关费用',
        en: 'clearanceFee',
        type: 'select'
      },
      {
        name: '报文',
        en: 'message',
        type: 'select'
      },
      {
        name: '手续费',
        en: 'serviceCharge',
        type: 'formula',
        formula: [1000, 1, 0.1]
      },
      {
        name: '其他费用',
        en: 'otherExpenses',
        type: 'input',
        isDes: true,
        isFile: true
      },
      {
        name: '成本单价',
        en: 'costPrice',
        type: 'formula',
        formula: [1000, 1, 0.1]
      }
    ]
  },
  cargo: {
    key: 'cargo',
    label: '货物信息',
    content: [
      {
        name: '到港日期',
        en: 'arrivalDate',
        type: 'date',
        isMust: true
      },
      {
        name: '船公司',
        en: 'shipCompany',
        type: 'select',
        isMust: true
      },
      {
        name: '提货单',
        en: 'bill',
        type: 'input',
        isMust: true
      },
      {
        name: '集装箱号',
        en: 'containerNo',
        type: 'input',
        isMust: true
      },
      {
        name: '电放情况',
        en: 'releaseSituation',
        type: 'select',
        isMust: true
      },
      {
        name: '代理公司',
        en: 'agencyCompany',
        type: 'select',
        isMust: true
      },
      {
        name: '正本文件',
        en: 'originalCopy',
        type: 'select',
        isMust: true
      },
      {
        name: '入库时间',
        en: 'entryTime',
        type: 'date',
        isMust: true
      },
      {
        name: '备注',
        en: 'des',
        type: 'input',
        isMust: true
      }
    ]
  }
}
