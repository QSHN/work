const initialValue = {
  title: '基础资料',
  name: 'initialValue',
  children: [
    {
      title: '公共资料',
      name: 'publicInfo',
      children: [
        { title: '科目', name: 'subjectIndex' },
        { title: '币别', name: 'currencyIndex' },
        { title: '汇率体系', name: 'exchangeRateIndex' },
        { title: '凭证字', name: 'proofWordsIndex' },
        { title: '计量单位', name: 'measureUnitIndex' },
        { title: '结算方式', name: 'clearingFormIndex' },
        { title: '仓位', name: 'freightSpaceIndex' },
        { title: '核算项目管理', name: 'apMain' },
        { title: '客户', name: 'customerIndex' },
        { title: '部门', name: 'departmentIndex' },
        { title: '职员', name: 'clerkIndex' },
        // { title: '物料', name: '' },
        // { title: '仓库', name: '' },
        { title: '供应商', name: 'supplierIndex' },
        // { title: '成本对象', name: '' },
        // { title: '劳务', name: '' },
        // { title: '成本项目', name: '' },
        // { title: '要素费用', name: '' },
        { title: '费用', name: 'costIndex' },
        // { title: '计划项目', name: '' },
        // { title: '成本对象组', name: '' },
        { title: '银行账号', name: 'bankAccountIndex' },
        // { title: '国别地区', name: '' },
        // { title: '城市港口', name: '' },
        // { title: 'HS编码', name: '' },
        // { title: '保险险种', name: '' },
        // { title: '成本中心', name: '' },
        // { title: '要素项目', name: '' },
        // { title: '金融机构', name: '' },
        // { title: '工程项目', name: '' },
        // { title: '责任中心', name: '' },
        // { title: '专项', name: '' },
        // { title: '分支机构', name: '' },
        // { title: '工作中心', name: '' },
        { title: '现金流量项目', name: 'cashFlowIndex' },
        // { title: '商品类型', name: '' },
        { title: '辅助资料管理', name: 'auxiliaryInfoIndex' },
        { title: '银行联行号', name: 'bankIndex' },
        { title: '省份', name: 'provinceIndex' },
        { title: '城市', name: 'cityIndex' }
      ]
    }
  ]
}

const initialize = {
  title: '初始化',
  name: 'initialize',
  children: [
    {
      title: '总账',
      name: 'generalLedger',
      children: [
        { title: '科目初始数据录入', name: 'subjectInitIndex' },
        { title: '现金流量初始数据录入', name: 'cashFlowTableInitIndex' },
        { title: '结束初始化', name: 'generalLedgerInit' },
        { title: '反初始化', name: 'generalLedgerUnInit' }
      ]
    }
  ]
}

const systemSettings = {
  title: '系统设置',
  name: 'systemSettings',
  children: [
    {
      title: '系统参数配置',
      name: 'systemParameter',
      children: [
        { title: '系统参数配置平台', name: '' },
        { title: '站点名称配置', name: '' }
      ]
    }
  ]
}

const userManagement = {
  title: '用户管理',
  name: 'userManagement',
  children: [
    {
      title: '用户管理',
      name: 'uManagement',
      children: [
        { title: '用户管理', name: 'userManageIndex' }
      ]
    }
  ]
}

export const basics = {
  title: '基础',
  children: [{
    title: '系统设置',
    children: [
      initialValue,
      initialize,
      systemSettings,
      userManagement
    ]
  }]
}
