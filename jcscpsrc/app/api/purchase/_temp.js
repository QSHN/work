const supplier = {
  name: '供应商信息',
  code: 'supplier',
  type: 'contract',
  temp: [
    {
      name: '编号',
      code: 'serialNumber',
      type: 'select',
      selectInfo: 'serialNumber',
      target: 'serialNumber',
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '客户名称',
      code: 'clientName',
      type: 'select',
      selectInfo: 'client',
      target: 'clientName',
      relevance: [
        {code: 'supplier.shareholder',  target: 'shareholder'}
      ],
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '股东标记',
      code: 'shareholder',
      type: 'boolean',
      selectInfo: 'client',
      target: 'shareholder',
      isRequired: false,
      isShow: true,
      isEdit: false,
      width: '33.33333',
      lineBreak: true
    },
    {
      name: '合同号',
      code: 'contractNumber',
      type: 'input',
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '合同日期',
      code: 'contractDate',
      type: 'date',
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '跟单员',
      code: 'merchandiser',
      type: 'select',
      selectInfo: 'systemAccount',
      target: 'name',
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '33.33333',
      lineBreak: true
    },
    {
      name: '注册码',
      code: 'rCode',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'rCode',
      relevance: [
        {code: 'supplier.cName', target: 'cName'},
        {code: 'supplier.eName', target: 'eName'},
        {code: 'supplier.cAddress', target: 'cAddress'},
        {code: 'supplier.eAddress', target: 'eAddress'},
        {code: 'bank.AccountName', target: 'AccountName'},
        {code: 'bank.BankName', target: 'BankName'},
        {code: 'bank.swiftCode', target: 'swiftCode'},
        {code: 'bank.bankAddress', target: 'bankAddress'},
        {code: 'bank.bankAccount', target: 'bankAccount'}
      ],
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '装运港',
      code: 'sPort',
      type: 'select',
      selectInfo: 'shippingPort',
      target: 'sPort',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '集装箱数',
      code: 'containerNumber',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333',
      lineBreak: true
    },
    {
      name: '卖方名称(中文)',
      code: 'cName',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'cName',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '卖方名称(英文)',
      code: 'eName',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'eName',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '卖方地址(中文)',
      code: 'cAddress',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'cAddress',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '卖方地址(英文)',
      code: 'eAddress',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'eAddress',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '包装',
      code: 'packaging',
      type: 'select',
      selectInfo: 'packaging',
      target: 'packaging',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25'
    },
    {
      name: '装运期限',
      code: 'shipmentDate',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25'
    },
    {
      name: '目的港',
      code: 'dPort',
      type: 'select',
      selectInfo: 'destinationPort',
      target: 'dPort',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25'
    },
    {
      name: '生产国别',
      code: 'productionCountry',
      type: 'select',
      selectInfo: 'productionCountry',
      target: 'productionCountry',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    }
  ]
}

const bank = {
  name: '银行信息',
  code: 'bank',
  type: 'contract',
  temp: [
    {
      name: '支付条款（中文）',
      code: 'paymentTermC',
      type: 'select',
      selectInfo: 'paymentTerm',
      target: 'paymentTermC',
      relevance: [
        {code: 'bank.paymentTermE', target: 'paymentTermE'}
      ],
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '支付条款（英文）',
      code: 'paymentTermE',
      type: 'select',
      selectInfo: 'paymentTerm',
      target: 'paymentTermE',
      relevance: [
        {code: 'bank.paymentTermC', target: 'paymentTermC'}
      ],
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '账户名(Account Name)',
      code: 'AccountName',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'AccountName',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '银行名称(Bank)',
      code: 'BankName',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'BankName',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: 'SWIFT CODE',
      code: 'swiftCode',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'swiftCode',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333',
      lineBreak: true
    },
    {
      name: '银行地址(Bank Address)',
      code: 'bankAddress',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'bankAddress',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '银行账号(ACCOUNT)',
      code: 'bankAccount',
      type: 'select',
      selectInfo: 'registrationCode',
      target: 'bankAccount',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100',
      lineBreak: true
    },
    {
      name: '客户预付时间',
      code: 'cPrepaidTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '客户预付金额',
      code: 'cPrepaidAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '客户预付抬头',
      code: 'cAdvanceOrder',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333',
      lineBreak: true
    },
    {
      name: '订单预付时间',
      code: 'oPrepaidTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333'
    },
    {
      name: '订单预付金额',
      code: 'oPrepaidAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'bank.RMBAmount', mode: 'divide'},
          { code: 'bank.oPrepaidRate', mode: null}
        ]
      },
      width: '33.33333'
    },
    {
      name: '订单预付汇率',
      code: 'oPrepaidRate',
      type: 'number',
      float: 4,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '33.33333',
      lineBreak: true
    },
    {
      name: '人民币金额',
      code: 'RMBAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'bank.oPrepaidAmount', mode: 'times'},
          { code: 'bank.oPrepaidRate', mode: null}
        ]
      },
      width: '33.33333'
    },
    {
      name: '电报费',
      code: 'cableCharge',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      default: 150,
      width: '33.33333'
    },
    {
      name: '手续费',
      code: 'serviceCharge',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      formula: {
        min: 10,
        max: 1000,
        child: [
          { code: 'bank.RMBAmount', mode: 'times'},
          { val: 0.001, mode: null}
        ]
      },
      width: '33.33333',
      lineBreak: true
    },
  ]
}

const order = {
  name: '订单信息',
  code: 'order',
  type: 'order',
  temp: [
    {
      name: '发票号',
      code: 'invoiceNumber',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25'
    },
    {
      name: '合同号',
      code: 'contractNumber',
      type: 'select',
      selectContract: 'contractNumber',
      relevance: [
        {code: 'order.oPrepaidAmount', target: 'bank.oPrepaidAmount'},
        {code: 'order.oPrepaidRate', target: 'bank.oPrepaidRate'},
        {code: 'order.RMBAmount', target: 'bank.RMBAmount'},
        {code: 'orderTable', target: 'contractTable'}
      ],
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '预付金额',
      code: 'oPrepaidAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'order.RMBAmount', mode: 'divide'},
          { code: 'order.oPrepaidRate', mode: null}
        ]
      },
      width: '25',
    },
    {
      name: '预付汇率',
      code: 'oPrepaidRate',
      type: 'number',
      float: 4,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '人民币金额',
      code: 'RMBAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'order.oPrepaidAmount', mode: 'times'},
          { code: 'order.oPrepaidRate', mode: null}
        ]
      },
      width: '25',
      lineBreak: true
    },
    {
      name: '客户尾款时间',
      code: 'cFinalTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '客户尾款金额',
      code: 'cFinalAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '客户尾款抬头',
      code: 'cFinalOrder',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '订单尾款时间',
      code: 'oFinalTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '尾款金额',
      code: 'oFinalAmount',
      type: 'number',
      float: 2,
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'order.oFinalRMBAmount', mode: 'divide'},
          { code: 'order.oFinalRate', mode: null}
        ]
      },
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '尾款汇率',
      code: 'oFinalRate',
      type: 'number',
      float: 4,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '尾款人民币金额',
      code: 'oFinalRMBAmount',
      type: 'number',
      float: 2,
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'order.oFinalAmount', mode: 'times'},
          { code: 'order.oFinalRate', mode: null}
        ]
      },
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '最后付汇日',
      code: 'finalPaymentDate',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '电报费',
      code: 'cableCharge',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      default: 150,
      width: '25'
    },
    {
      name: '手续费',
      code: 'serviceCharge',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      formula: {
        min: 10,
        max: 1000,
        child: [
          { code: 'order.oFinalRMBAmount', mode: 'times'},
          { val: 0.001, mode: null}
        ]
      },
      width: '25',
      lineBreak: true
    }
  ]
}

const document = {
  name: '单证信息',
  code: 'document',
  type: 'order',
  temp: [
    {
      name: '一程提单号',
      code: 'oneBill',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '二程提单号',
      code: 'twoBill',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '船公司',
      code: 'shipCompany',
      type: 'select',
      selectInfo: 'shipCompany',
      target: 'shipCompany',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '柜号',
      code: 'tankNo',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '到达港口',
      code: 'dPort',
      type: 'select',
      selectInfo: 'destinationPort',
      target: 'dPort',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20',
      lineBreak: true
    },
    {
      name: '中转港口',
      code: 'sPort',
      type: 'select',
      selectInfo: 'shippingPort',
      target: 'sPort',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '到港时间',
      code: 'arrivalTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '代理公司',
      code: 'agencyCompany',
      type: 'select',
      selectInfo: 'agencyCompany',
      target: 'agencyCompany',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '提单',
      code: 'bill',
      type: 'select',
      selectInfo: 'bill',
      target: 'bill',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '标签',
      code: 'tag',
      type: 'select',
      selectInfo: 'tag',
      target: 'tag',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20',
      lineBreak: true
    },
    {
      name: '发票',
      code: 'invoice',
      type: 'select',
      selectInfo: 'invoice',
      target: 'invoice',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '装箱单',
      code: 'packingList',
      type: 'select',
      selectInfo: 'packingList',
      target: 'packingList',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '健康证',
      code: 'healthCertificate',
      type: 'select',
      selectInfo: 'healthCertificate',
      target: 'healthCertificate',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '正文文件',
      code: 'textFiles',
      type: 'select',
      selectInfo: 'textFiles',
      target: 'textFiles',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '电放情况',
      code: 'telexRelease',
      type: 'select',
      selectInfo: 'textFiles',
      target: 'textFiles',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20',
      lineBreak: true
    },
    {
      name: '产地证',
      code: 'co',
      type: 'select',
      selectInfo: 'co',
      target: 'co',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20'
    },
    {
      name: '其他单证',
      code: 'otherDocuments',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '20',
      lineBreak: true
    },
    {
      name: '备注',
      code: 'documentDes',
      type: 'textarea',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '100'
    },
  ]
}

const logistics = {
  name: '物流信息',
  code: 'logistics',
  type: 'order',
  temp: [
    {
      name: '客户第三次付款时间',
      code: 'cThirdTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '客户第三次付款金额',
      code: 'cThirdAmount',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '客户第三次付款抬头',
      code: 'cThirdOrder',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '海关关税',
      code: 'customsTariff',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '海关增值税',
      code: 'customsTax',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '清关费',
      code: 'customsFee',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '其他费用',
      code: 'otherCost',
      type: 'number',
      float: 2,
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '入库时间',
      code: 'storageTime',
      type: 'date',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '车号',
      code: 'carNumber',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '驾驶员',
      code: 'driver',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '驾驶员电话',
      code: 'driverPhone',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '订单状态',
      code: 'orderStatus',
      type: 'select',
      selectInfo: 'orderStatus',
      target: 'orderStatus',
      isRequired: true,
      isShow: true,
      isEdit: true,
      width: '25'
    },
    {
      name: '流向地址',
      code: 'toAddress',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '接货人',
      code: 'receivingPeople',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
    },
    {
      name: '接货人电话',
      code: 'receivingPhone',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25',
      lineBreak: true
    },
    {
      name: '检验检疫证',
      code: 'diseaseCertificate',
      type: 'select',
      selectInfo: 'diseaseCertificate',
      target: 'diseaseCertificate',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '25'
    },
    {
      name: '备注',
      code: 'logisticsDes',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      width: '75',
      lineBreak: true
    },
  ]
}

const contractTable = {
  name: '合同商品信息',
  code: 'contractTable',
  type: 'contractTable',
  temp: [
    {
      name: '品名',
      code: 'goodsNameC',
      type: 'select',
      selectInfo: 'goods',
      target: 'goodsNameC',
      relevance: [
        {code: 'goodsNameE', target: 'goodsNameE'},
        {code: 'netContent', target: 'netContent'},
        {code: 'specifications', target: 'specifications'},
        {code: 'packingWay', target: 'packingWay'}
      ],
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '品名（英文）',
      code: 'goodsNameE',
      type: 'select',
      selectInfo: 'goods',
      target: 'goodsNameE',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '品名描述',
      code: 'goodsDescription',
      type: 'input',
      isRequired: false,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '净含量',
      code: 'netContent',
      type: 'select',
      selectInfo: 'goods',
      target: 'netContent',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '规格',
      code: 'specifications',
      type: 'select',
      selectInfo: 'goods',
      target: 'specifications',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '包装方式',
      code: 'packingWay',
      type: 'select',
      selectInfo: 'goods',
      target: 'packingWay',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '数量',
      code: 'number',
      type: 'number',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: true,
      float: 0
    },
    {
      name: '重量',
      code: 'weight',
      type: 'number',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '美元单价',
      code: 'dollarPrice',
      type: 'number',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false,
      float: 2
    },
    {
      name: '美元总金额',
      code: 'totalAmount',
      type: 'number',
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'contractTable.dollarPrice', mode: 'times'},
          { code: 'contractTable.weight', mode: null}
        ]
      },
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: true,
      float: 2
    },
    {
      name: '备注',
      code: 'des',
      type: 'textarea',
      isRequired: false,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
  ]
}

const orderTable = {
  name: '订单商品信息',
  code: 'orderTable',
  type: 'orderTable',
  temp: [
    {
      name: '品名',
      code: 'goodsNameC',
      type: 'select',
      selectInfo: 'goods',
      target: 'goodsNameC',
      relevance: [
        {code: 'goodsNameE', target: 'goodsNameE'},
        {code: 'netContent', target: 'netContent'},
        {code: 'specifications', target: 'specifications'},
        {code: 'packingWay', target: 'packingWay'}
      ],
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '品名（英文）',
      code: 'goodsNameE',
      type: 'select',
      selectInfo: 'goods',
      target: 'goodsNameE',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '净含量',
      code: 'netContent',
      type: 'select',
      selectInfo: 'goods',
      target: 'netContent',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '规格',
      code: 'specifications',
      type: 'select',
      selectInfo: 'goods',
      target: 'specifications',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '包装方式',
      code: 'packingWay',
      type: 'select',
      selectInfo: 'goods',
      target: 'packingWay',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '数量',
      code: 'number',
      type: 'number',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: true,
      float: 0
    },
    {
      name: '重量',
      code: 'weight',
      type: 'number',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
    {
      name: '美元单价',
      code: 'dollarPrice',
      type: 'number',
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: false,
      float: 2
    },
    {
      name: '美元总金额',
      code: 'totalAmount',
      type: 'number',
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'orderTable.dollarPrice', mode: 'times'},
          { code: 'orderTable.weight', mode: null}
        ]
      },
      isRequired: true,
      isShow: true,
      isEdit: true,
      isTotal: true,
      float: 2
    },
    {
      name: '单箱成本（人民币）',
      code: 'singleBoxCost',
      type: 'number',
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'order.RMBAmount', mode: 'plus'},
          { code: 'order.oFinalRMBAmount', mode: 'plus'},
          { code: 'logistics.customsTariff', mode: 'plus'},
          { code: 'logistics.customsTax', mode: 'plus'},
          { code: 'logistics.customsFee', mode: 'plus'},
          { code: 'logistics.otherCost', mode: 'divide'},
          { val: '所有货物美元金额合计', mode: 'times'},
          { code: 'orderTable.totalAmount', mode: 'divide'},
          { code: 'orderTable.number', mode: null},
        ]
      },
      isRequired: false,
      isShow: true,
      isEdit: true,
      isTotal: false,
      float: 2
    },
    {
      name: '合计成本（人民币）',
      code: 'totalCost',
      type: 'number',
      formula: {
        min: null,
        max: null,
        child: [
          { code: 'orderTable.singleBoxCost', mode: 'times'},
          { code: 'orderTable.number', mode: null}
        ]
      },
      isRequired: false,
      isShow: true,
      isEdit: true,
      isTotal: true,
      float: 2
    },
    {
      name: '备注',
      code: 'des',
      type: 'textarea',
      isRequired: false,
      isShow: true,
      isEdit: true,
      isTotal: false
    },
  ]
}

const purchaseTable = {
  name: '采购查询',
  code: 'purchaseTable',
  type: 'purchaseTable',
  temp: [
    {
      name: '编号',
      code: 'supplier.serialNumber',
      type: 'select',
      isShow: true
    },
    {
      name: '审核状态',
      code: 'status',
      type: 'select',
      isShow: true
    },
    {
      name: '订单状态',
      code: 'logistics.orderStatus',
      type: 'select',
      isShow: true
    },
    {
      name: '到港时间',
      code: 'document.arrivalTime',
      type: 'date',
      isShow: true
    },
    {
      name: '入库时间',
      code: 'logistics.storageTime',
      type: 'date',
      isShow: true
    },
    {
      name: '最后付汇时间',
      code: 'order.finalPaymentDate',
      type: 'date',
      isShow: true
    },
    {
      name: '委托方',
      code: 'supplier.clientName',
      type: 'select',
      isShow: true
    },
    {
      name: '合同编号',
      code: 'supplier.contractNumber',
      type: 'date',
      isShow: true
    },
    {
      name: '合同日期',
      code: 'supplier.contractDate',
      type: 'input',
      isShow: true
    },
    {
      name: '注册号',
      code: 'supplier.rCode',
      type: 'select',
      isShow: true
    },
    {
      name: '跟单员',
      code: 'supplier.merchandiser',
      type: 'select',
      isShow: true
    },
    {
      name: '发票号',
      code: 'order.invoiceNumber',
      type: 'input',
      isShow: true
    },
    {
      name: '产品名称',
      code: 'orderTable.goodsNameC',
      type: 'select',
      isShow: true
    },
    {
      name: '出口国',
      code: 'supplier.productionCountry',
      type: 'select',
      isShow: true
    },
    {
      name: '到达港口',
      code: 'document.dPort',
      type: 'select',
      isShow: true
    },
    {
      name: '提单号',
      code: 'document.oneBill',
      type: 'select',
      isShow: true
    },
    {
      name: '柜号',
      code: 'document.tankNo',
      type: 'select',
      isShow: true
    },
    {
      name: '代理公司',
      code: 'document.agencyCompany',
      type: 'select',
      isShow: true
    }
  ]
}

const purchaseContractDetailTable = {
  name: '采购合同明细查询',
  code: 'purchaseContractDetailTable',
  type: 'purchaseContractDetailTable',
  temp: [
    {
      name: '编号',
      code: 'supplier.serialNumber',
      type: 'select',
      isShow: true
    },
    {
      name: '合同编号',
      code: 'supplier.contractNumber',
      type: 'input',
      isShow: true
    },
    {
      name: '合同日期',
      code: 'supplier.contractDate',
      type: 'date',
      isShow: true
    },
    {
      name: '审核状态',
      code: 'status',
      type: 'select',
      isShow: true
    },
    {
      name: '跟单员',
      code: 'supplier.merchandiser',
      type: 'select',
      isShow: true
    },
    {
      name: '供货商',
      code: 'supplier.clientName',
      type: 'select',
      isShow: true
    },
    {
      name: '出口国',
      code: 'supplier.productionCountry',
      type: 'select',
      isShow: true
    },
    {
      name: '目的港',
      code: 'supplier.dPort',
      type: 'select',
      isShow: true
    },
    {
      name: '集装箱数',
      code: 'supplier.containerNumber',
      type: 'input',
      isShow: true
    },
    {
      name: '产品名称',
      code: 'contractTable.goodsNameC',
      type: 'select',
      isShow: true
    },
    {
      name: '美元总金额',
      code: 'contractTable.totalAmount',
      type: 'number',
      isShow: true
    },
    {
      name: '净含量',
      code: 'contractTable.netContent',
      type: 'input',
      isShow: true
    },
    {
      name: '规格',
      code: 'contractTable.specifications',
      type: 'input',
      isShow: true
    },
    {
      name: '重量',
      code: 'contractTable.weight',
      type: 'input',
      isShow: true
    },
    {
      name: '美元单价',
      code: 'contractTable.dollarPrice',
      type: 'input',
      isShow: true
    },
    {
      name: '商品数量',
      code: 'contractTable.number',
      type: 'number',
      isShow: true
    },
    {
      name: '包装方式',
      code: 'contractTable.packingWay',
      type: 'input',
      isShow: true
    },
  ]
}

const purchaseOrderDetailTable = {
  name: '采购订单明细查询',
  code: 'purchaseOrderDetailTable',
  type: 'purchaseOrderDetailTable',
  temp: [
    {
      name: '编号',
      code: 'supplier.serialNumber',
      type: 'select',
      isShow: true
    },
    {
      name: '合同号',
      code: 'order.contractNumber',
      type: 'select',
      isShow: true
    },
    {
      name: '订单状态',
      code: 'logistics.orderStatus',
      type: 'select',
      isShow: true
    },
    {
      name: '审核状态',
      code: 'status',
      type: 'select',
      isShow: true
    },
    {
      name: '跟单员',
      code: 'supplier.merchandiser',
      type: 'select',
      isShow: true
    },
    {
      name: '供货商',
      code: 'supplier.clientName',
      type: 'select',
      isShow: true
    },
    {
      name: '出口国',
      code: 'supplier.productionCountry',
      type: 'select',
      isShow: true
    },
    {
      name: '目的港',
      code: 'supplier.dPort',
      type: 'select',
      isShow: true
    },
    {
      name: '集装箱数',
      code: 'supplier.containerNumber',
      type: 'input',
      isShow: true
    },
    {
      name: '产品名称',
      code: 'orderTable.goodsNameC',
      type: 'select',
      isShow: true
    },
    {
      name: '美元总金额',
      code: 'orderTable.totalAmount',
      type: 'number',
      isShow: true
    },
    {
      name: '净含量',
      code: 'orderTable.netContent',
      type: 'input',
      isShow: true
    },
    {
      name: '规格',
      code: 'orderTable.specifications',
      type: 'input',
      isShow: true
    },
    {
      name: '重量',
      code: 'orderTable.weight',
      type: 'input',
      isShow: true
    },
    {
      name: '美元单价',
      code: 'orderTable.dollarPrice',
      type: 'input',
      isShow: true
    },
    {
      name: '商品数量',
      code: 'orderTable.number',
      type: 'number',
      isShow: true
    },
    {
      name: '包装方式',
      code: 'orderTable.packingWay',
      type: 'input',
      isShow: true
    },
    {
      name: '预付金额',
      code: 'order.oPrepaidAmount',
      type: 'number',
      isShow: true
    },
    {
      name: '预付汇率',
      code: 'order.oPrepaidRate',
      type: 'input',
      isShow: true
    },
    {
      name: '尾款金额',
      code: 'order.oFinalAmount',
      type: 'number',
      isShow: true
    },
    {
      name: '尾款汇率',
      code: 'order.oFinalRate',
      type: 'input',
      isShow: true
    },
    {
      name: '海关关税',
      code: 'logistics.customsTariff',
      type: 'number',
      isShow: true
    },
    {
      name: '海关增值税',
      code: 'logistics.customsTax',
      type: 'number',
      isShow: true
    },
    {
      name: '订单尾款日期',
      code: 'order.cFinalTime',
      type: 'date',
      isShow: true
    },
    {
      name: '订单尾款日期',
      code: 'order.cFinalTime',
      type: 'date',
      isShow: true
    },
    {
      name: '柜号',
      code: 'document.tankNo',
      type: 'input',
      isShow: true
    },
    {
      name: '提单号',
      code: 'document.bill',
      type: 'select',
      isShow: true
    },
    {
      name: '入库时间',
      code: 'logistics.storageTime',
      type: 'date',
      isShow: true
    }
  ]
}

const temp = {
  supplier,
  bank,
  order,
  document,
  logistics,
  contractTable,
  orderTable,
  purchaseTable,
  purchaseContractDetailTable,
  purchaseOrderDetailTable
}

module.exports = {
  temp
}