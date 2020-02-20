const job = {
  gId: 1,
  name: '职位',
  group: [
    { id: 1, name: '默认' },
  ],
  temp: [
    {
      name: '职位',
      code: 'job',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      job: '采购主管'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      job: '采购人员'
    }
  ]
}

const registrationCode = {
  gId: 1,
  name: '注册码',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '注册码',
      code: 'rCode',
      type: 'input'
    },
    {
      name: '卖方中文名称',
      code: 'cName',
      type: 'input'
    },
    {
      name: '卖方英文名称',
      code: 'eName',
      type: 'input'
    },
    {
      name: '卖方中文地址',
      code: 'cAddress',
      type: 'input'
    },
    {
      name: '卖方英文地址',
      code: 'eAddress',
      type: 'input'
    },
    {
      name: '账户名',
      code: 'AccountName',
      type: 'input'
    },
    {
      name: '银行名称',
      code: 'BankName',
      type: 'input'
    },
    {
      name: 'SWIFT CODE',
      code: 'swiftCode',
      type: 'input'
    },
    {
      name: '银行地址',
      code: 'bankAddress',
      type: 'input'
    },
    {
      name: '银行账号',
      code: 'bankAccount',
      type: 'input'
    }
  ],
  list: []
}

const shippingPort = {
  gId: 1,
  name: '装运港',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '装运港',
      code: 'sPort',
      type: 'input'
    }
  ],
  list: []
}

const destinationPort = {
  gId: 1,
  name: '目的港',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '目的港',
      code: 'dPort',
      type: 'input'
    }
  ],
  list: []
}

const client = {
  gId: 1,
  name: '客户',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '客户名称',
      code: 'clientName',
      type: 'input'
    },
    {
      name: '股东标记',
      code: 'shareholder',
      type: 'boolean'
    }
  ],
  list: []
}

const tag = {
  gId: 1,
  name: '标签',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '标签',
      code: 'tag',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      tag: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      tag: '未收到'
    },
  ]
}

const invoice = {
  gId: 1,
  name: '发票',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '发票',
      code: 'invoice',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      invoice: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      invoice: '未收到'
    },
  ]
}

const bill = {
  gId: 1,
  name: '提单',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '提单',
      code: 'bill',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      bill: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      bill: '未收到'
    },
  ]
}

const packingList = {
  gId: 1,
  name: '装箱单',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '装箱单',
      code: 'packingList',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      packingList: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      packingList: '未收到'
    },
  ]
}

const healthCertificate = {
  gId: 1,
  name: '健康证',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '健康证',
      code: 'healthCertificate',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      healthCertificate: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      healthCertificate: '未收到'
    },
  ]
}

const co = {
  gId: 1,
  name: '产地证',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '产地证',
      code: 'co',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      co: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      co: '未收到'
    },
  ]
}

const textFiles = {
  gId: 1,
  name: '正文文件',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '正文文件',
      code: 'textFiles',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      textFiles: '未发送'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      textFiles: '已寄出'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      textFiles: '已签收'
    }
  ]
}

const telexRelease = {
  gId: 1,
  name: '电放情况',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '电放情况',
      code: 'telexRelease',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      telexRelease: '未电放'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      telexRelease: '已电放'
    }
  ]
}

const orderStatus = {
  gId: 1,
  name: '订单状态',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '订单状态',
      code: 'orderStatus',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      orderStatus: '未发货'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      orderStatus: '运输中'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      orderStatus: '中转港'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      orderStatus: '已到港'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      orderStatus: '已清关'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      orderStatus: '已入库'
    }
  ]
}

const diseaseCertificate = {
  gId: 1,
  name: '检验检疫证',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '检验检疫证',
      code: 'diseaseCertificate',
      type: 'input'
    }
  ],
  list: [
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      diseaseCertificate: '收到'
    },
    {
      groupId: 1,
      group: '默认',
      isDefault: false,
      diseaseCertificate: '未收到'
    }
  ]
}

const serialNumber = {
  gId: 1,
  name: '编号',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '编号',
      code: 'serialNumber',
      type: 'input'
    }
  ],
  list: []
}

const packaging = {
  gId: 1,
  name: '包装',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '包装',
      code: 'packaging',
      type: 'input'
    }
  ],
  list: []
}

const productionCountry = {
  gId: 1,
  name: '生产国别',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '生产国别',
      code: 'productionCountry',
      type: 'input'
    }
  ],
  list: []
}

const paymentTerm = {
  gId: 1,
  name: '支付条款',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '支付条款中文',
      code: 'paymentTermC',
      type: 'input'
    },
    {
      name: '支付条款英文',
      code: 'paymentTermE',
      type: 'input'
    }
  ],
  list: []
}

const agencyCompany = {
  gId: 1,
  name: '代理公司',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '代理公司',
      code: 'agencyCompany',
      type: 'input'
    }
  ],
  list: []
}

const shipCompany = {
  gId: 1,
  name: '船公司',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '船公司',
      code: 'shipCompany',
      type: 'input'
    }
  ],
  list: []
}

const goods = {
  gId: 1,
  name: '商品',
  group: [
    { id: 1, name: '默认' }
  ],
  temp: [
    {
      name: '品名',
      code: 'goodsNameC',
      type: 'input'
    },
    {
      name: '品名（英文）',
      code: 'goodsNameE',
      type: 'input'
    },
    {
      name: '净含量',
      code: 'netContent',
      type: 'input'
    },
    {
      name: '规格',
      code: 'specifications',
      type: 'input'
    },
    {
      name: '包装方式',
      code: 'packingWay',
      type: 'input'
    }
  ],
  list: []
}

const basicInfo = {
  job,
  registrationCode,
  shippingPort,
  destinationPort,
  client,
  tag,
  invoice,
  bill,
  packingList,
  healthCertificate,
  co,
  textFiles,
  telexRelease,
  orderStatus,
  diseaseCertificate,
  serialNumber,
  packaging,
  productionCountry,
  paymentTerm,
  agencyCompany,
  shipCompany,
  goods
}

module.exports = {
  basicInfo
}