import Main from '@/components/main'
import TheConsole from '../components/theConsole/index'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/accountSet',
    name: 'accountSet',
    component: TheConsole,
    children: [
      {
        path: 'accountSetIndex',
        name: 'accountSetIndex',
        meta: {
          title: '账套管理'
        },
        component: () => import('@/view/accountSet/index.vue')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    component: TheConsole,
    children: [
      {
        path: 'accountIndex',
        name: 'accountIndex',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/view/account/index.vue')
      }
    ]
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: Main,
    meta: {
      title: '用户授权'
    },
    children: [
      {
        path: 'userManageIndex',
        name: 'userManageIndex',
        meta: {
          title: '用户授权'
        },
        component: () => import('@/view/userManage/index.vue')
      }
    ]
  },
  {
    path: '/currency',
    name: 'currency',
    component: Main,
    meta: {
      title: '财务资料'
    },
    children: [
      {
        path: 'currencyIndex',
        name: 'currencyIndex',
        meta: {
          title: '币别'
        },
        component: () => import('@/view/currency/index.vue')
      }
    ]
  },
  {
    path: '/measureUnit',
    name: 'measureUnit',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'measureUnitIndex',
        name: 'measureUnitIndex',
        meta: {
          title: '计量单位'
        },
        component: () => import('@/view/measureUnit/index.vue')
      }
    ]
  },
  {
    path: '/auxiliaryAttributes',
    name: 'auxiliaryAttributes',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'auxiliaryAttributesIndex',
        name: 'auxiliaryAttributesIndex',
        meta: {
          title: '辅助属性'
        },
        component: () => import('@/view/auxiliaryAttributes/index.vue')
      }
    ]
  },
  {
    path: '/commodityBrand',
    name: 'commodityBrand',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'commodityBrandIndex',
        name: 'commodityBrandIndex',
        meta: {
          title: '商品品牌'
        },
        component: () => import('@/view/commodityBrand/index.vue')
      }
    ]
  },
  {
    path: '/commodityLabel',
    name: 'commodityLabel',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'commodityLabelIndex',
        name: 'commodityLabelIndex',
        meta: {
          title: '商品标签'
        },
        component: () => import('@/view/commodityLabel/index.vue')
      }
    ]
  },
  {
    path: '/commodityInfo',
    name: 'commodityInfo',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'commodityInfoIndex',
        name: 'commodityInfoIndex',
        meta: {
          title: '商品信息'
        },
        component: () => import('@/view/commodityInfo/index.vue')
      }
    ]
  },
  {
    path: '/exchangeRate',
    name: 'exchangeRate',
    component: Main,
    meta: {
      title: '汇率体系'
    },
    children: [
      {
        path: 'exchangeRateIndex',
        name: 'exchangeRateIndex',
        meta: {
          title: '汇率体系'
        },
        component: () => import('@/view/exchangeRate/index.vue')
      }
    ]
  },
  {
    path: '/commodityPrices',
    name: 'commodityPrices',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'strategyPrices',
        name: 'strategyPrices',
        meta: {
          title: '价格取数优先级'
        },
        component: () => import('@/view/commodityPrices/strategyPrices.vue')
      },
      {
        path: 'commodityPricesIndex',
        name: 'commodityPricesIndex',
        meta: {
          title: '商品价格策略'
        },
        component: () => import('@/view/commodityPrices/commodityPrices.vue')
      },
      {
        path: 'customerPrices',
        name: 'customerPrices',
        meta: {
          title: '客户价格策略'
        },
        component: () => import('@/view/commodityPrices/customerPrices.vue')
      }
    ]
  },
  {
    path: '/customerCommodityCode',
    name: 'customerCommodityCode',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'customerCommodityCodeIndex',
        name: 'customerCommodityCodeIndex',
        meta: {
          title: '客户商品编码'
        },
        component: () => import('@/view/customerCommodityCode/index.vue')
      }
    ]
  },
  {
    path: '/barCodeRules',
    name: 'barCodeRules',
    component: Main,
    meta: {
      title: '商品资料'
    },
    children: [
      {
        path: 'barCodeRulesIndex',
        name: 'barCodeRulesIndex',
        meta: {
          title: '条码规则设置'
        },
        component: () => import('@/view/barCodeRules/index.vue')
      }
    ]
  },
  {
    path: '/commodityBeginning',
    name: 'commodityBeginning',
    component: Main,
    meta: {
      title: '期初录入'
    },
    children: [
      {
        path: 'commodityBeginningIndex',
        name: 'commodityBeginningIndex',
        meta: {
          title: '商品期初录入'
        },
        component: () => import('@/view/commodityBeginning/index.vue')
      }
    ]
  },
  // {
  //   path: '/province',
  //   name: 'province',
  //   component: Main,
  //   meta: {
  //     title: '省份'
  //   },
  //   children: [
  //     {
  //       path: 'provinceIndex',
  //       name: 'provinceIndex',
  //       meta: {
  //         title: '省份'
  //       },
  //       component: () => import('@/view/province/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/city',
  //   name: 'city',
  //   component: Main,
  //   meta: {
  //     title: '城市'
  //   },
  //   children: [
  //     {
  //       path: 'cityIndex',
  //       name: 'cityIndex',
  //       meta: {
  //         title: '城市'
  //       },
  //       component: () => import('@/view/city/index.vue')
  //     }
  //   ]
  // },
  {
    path: '/bank',
    name: 'bank',
    component: Main,
    meta: {
      title: '银行关联号'
    },
    children: [
      {
        path: 'bankIndex',
        name: 'bankIndex',
        meta: {
          title: '银行关联号'
        },
        component: () => import('@/view/bank/index.vue')
      }
    ]
  },
  {
    path: '/auxiliaryInfo',
    name: 'auxiliaryInfo',
    component: Main,
    meta: {
      title: '辅助资料管理'
    },
    children: [
      {
        path: 'auxiliaryInfoIndex',
        name: 'auxiliaryInfoIndex',
        meta: {
          title: '辅助资料'
        },
        component: () => import('@/view/auxiliaryInfo/index.vue')
      }
    ]
  },
  {
    path: '/cashFlow',
    name: 'cashFlow',
    component: Main,
    meta: {
      title: '现金流量项目'
    },
    children: [
      {
        path: 'cashFlowIndex',
        name: 'cashFlowIndex',
        meta: {
          title: '现金流量项目'
        },
        component: () => import('@/view/cashFlow/index.vue')
      }
    ]
  },
  {
    path: '/cost',
    name: 'cost',
    component: Main,
    meta: {
      title: '费用'
    },
    children: [
      {
        path: 'costIndex',
        name: 'costIndex',
        meta: {
          title: '费用'
        },
        component: () => import('@/view/cost/index.vue')
      }
    ]
  },
  {
    path: '/subject',
    name: 'subject',
    component: Main,
    meta: {
      title: '财务资料'
    },
    children: [
      {
        path: 'subjectIndex',
        name: 'subjectIndex',
        meta: {
          title: '科目'
        },
        component: () => import('@/view/subject/index.vue')
      }
    ]
  },
  {
    path: '/proofWords',
    name: 'proofWords',
    component: Main,
    meta: {
      title: '财务资料'
    },
    children: [
      {
        path: 'proofWordsIndex',
        name: 'proofWordsIndex',
        meta: {
          title: '凭证字'
        },
        component: () => import('@/view/proofWords/index.vue')
      }
    ]
  },
  {
    path: '/clearingForm',
    name: 'clearingForm',
    component: Main,
    meta: {
      title: '财务资料'
    },
    children: [
      {
        path: 'clearingFormIndex',
        name: 'clearingFormIndex',
        meta: {
          title: '结算方式'
        },
        component: () => import('@/view/clearingForm/index.vue')
      }
    ]
  },
  {
    path: '/department',
    name: 'department',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'departmentIndex',
        name: 'departmentIndex',
        meta: {
          title: '部门'
        },
        component: () => import('@/view/department/index.vue')
      }
    ]
  },
  {
    path: '/clerk',
    name: 'clerk',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'clerkIndex',
        name: 'clerkIndex',
        meta: {
          title: '职员'
        },
        component: () => import('@/view/clerk/index.vue')
      }
    ]
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'warehouseIndex',
        name: 'warehouseIndex',
        meta: {
          title: '仓库'
        },
        component: () => import('@/view/warehouse/index.vue')
      }
    ]
  },
  {
    path: '/incomeCategory',
    name: 'incomeCategory',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'incomeCategoryIndex',
        name: 'incomeCategoryIndex',
        meta: {
          title: '收入类别'
        },
        component: () => import('@/view/incomeCategory/index.vue')
      }
    ]
  },
  {
    path: '/spendingCategory',
    name: 'spendingCategory',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'spendingCategoryIndex',
        name: 'spendingCategoryIndex',
        meta: {
          title: '支出类别'
        },
        component: () => import('@/view/spendingCategory/index.vue')
      }
    ]
  },
  {
    path: '/customer',
    name: 'customer',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'customerIndex',
        name: 'customerIndex',
        meta: {
          title: '客户'
        },
        component: () => import('@/view/customer/index.vue')
      }
    ]
  },
  {
    path: '/supplier',
    name: 'supplier',
    component: Main,
    meta: {
      title: '业务资料'
    },
    children: [
      {
        path: 'supplierIndex',
        name: 'supplierIndex',
        meta: {
          title: '供应商'
        },
        component: () => import('@/view/supplier/index.vue')
      }
    ]
  },
  {
    path: '/bankAccount',
    name: 'bankAccount',
    component: Main,
    meta: {
      title: '财务资料'
    },
    children: [
      {
        path: 'bankAccountIndex',
        name: 'bankAccountIndex',
        meta: {
          title: '银行账号'
        },
        component: () => import('@/view/bankAccount/index.vue')
      }
    ]
  },
  {
    path: '/subjectInit',
    name: 'subjectInit',
    component: Main,
    meta: {
      title: '科目初始余额录入'
    },
    children: [
      {
        path: 'subjectInitIndex',
        name: 'subjectInitIndex',
        meta: {
          title: '初始余额录入'
        },
        component: () => import('@/view/subjectInit/index.vue')
      }
    ]
  },
  {
    path: '/cashFlowTableInit',
    name: 'cashFlowTableInit',
    component: Main,
    meta: {
      title: '现金流量初始余额录入'
    },
    children: [
      {
        path: 'cashFlowTableInitIndex',
        name: 'cashFlowTableInitIndex',
        meta: {
          title: '现金流量初始余额录入'
        },
        component: () => import('@/view/cashFlowTableInit/index.vue')
      }
    ]
  },
  {
    path: '/credentials',
    name: 'credentials',
    component: Main,
    meta: {
      title: '凭证录入'
    },
    children: [
      {
        path: 'voucherInputIndex',
        name: 'voucherInputIndex',
        meta: {
          title: '凭证录入'
        },
        component: () => import('@/view/credentials/index.vue')
      }
    ]
  },
  {
    path: '/credentialsTemplate',
    name: 'voucherTemplate',
    component: Main,
    meta: {
      title: '财务资料'
    },
    children: [
      {
        path: 'voucherTemplateIndex',
        name: 'voucherTemplateIndex',
        meta: {
          title: '模式凭证'
        },
        component: () => import('@/view/credentialsTemplate/index.vue')
      }
    ]
  },
  {
    path: '/credentialsQuery',
    name: 'credentialsQuery',
    component: Main,
    meta: {
      title: '凭证查询'
    },
    children: [
      {
        path: 'credentialsIndex',
        name: 'credentialsIndex',
        meta: {
          title: '凭证查询'
        },
        component: () => import('@/view/credentialsQuery/index.vue')
      }
    ]
  },
  {
    path: '/credentialsSubject',
    name: 'credentialsSubject',
    component: Main,
    meta: {
      title: '明细账'
    },
    children: [
      {
        path: 'credentialsSubjectIndex',
        name: 'credentialsSubjectIndex',
        meta: {
          title: '明细账'
        },
        component: () => import('@/view/credentialsQuery/subject.vue')
      }
    ]
  },
  {
    path: '/generalLedger',
    name: 'generalLedger',
    component: Main,
    meta: {
      title: '总分类账'
    },
    children: [
      {
        path: 'generalLedgerIndex',
        name: 'generalLedgerIndex',
        meta: {
          title: '总分类账'
        },
        component: () => import('@/view/accountBook/generalLedger.vue')
      }
    ]
  },
  {
    path: '/allAccounting',
    name: 'allAccounting',
    component: Main,
    meta: {
      title: '核算项目分类总账'
    },
    children: [
      {
        path: 'allAccountingIndex',
        name: 'allAccountingIndex',
        meta: {
          title: '核算项目分类总账'
        },
        component: () => import('@/view/accountBook/allAccounting.vue')
      }
    ]
  },
  {
    path: '/accountingDetail',
    name: 'accountingDetail',
    component: Main,
    meta: {
      title: '核算项目明细账'
    },
    children: [
      {
        path: 'accountingDetailIndex',
        name: 'accountingDetailIndex',
        meta: {
          title: '核算项目明细账'
        },
        component: () => import('@/view/accountBook/accountingDetail.vue')
      }
    ]
  },
  {
    path: '/numberAccounting',
    name: 'numberAccounting',
    component: Main,
    meta: {
      title: '数量金额总账'
    },
    children: [
      {
        path: 'numberAccountingIndex',
        name: 'numberAccountingIndex',
        meta: {
          title: '数量金额总账'
        },
        component: () => import('@/view/accountBook/numberAccounting.vue')
      }
    ]
  },
  {
    path: '/numberAccountingDetail',
    name: 'numberAccountingDetail',
    component: Main,
    meta: {
      title: '数量金额明细账'
    },
    children: [
      {
        path: 'numberAccountingDetailIndex',
        name: 'numberAccountingDetailIndex',
        meta: {
          title: '数量金额明细账'
        },
        component: () => import('@/view/accountBook/numberAccountingDetail.vue')
      }
    ]
  },
  {
    path: '/accountBalance',
    name: 'accountBalance',
    component: Main,
    meta: {
      title: '科目余额表'
    },
    children: [
      {
        path: 'accountBalanceIndex',
        name: 'accountBalanceIndex',
        meta: {
          title: '科目余额表'
        },
        component: () => import('@/view/financialStatements/accountBalance.vue')
      }
    ]
  },
  {
    path: '/subjectTrial',
    name: 'subjectTrial',
    component: Main,
    meta: {
      title: '试算平衡表'
    },
    children: [
      {
        path: 'subjectTrialIndex',
        name: 'subjectTrialIndex',
        meta: {
          title: '试算平衡表'
        },
        component: () => import('@/view/financialStatements/subjectTrial.vue')
      }
    ]
  },
  {
    path: '/dailyReport',
    name: 'dailyReport',
    component: Main,
    meta: {
      title: '日报表'
    },
    children: [
      {
        path: 'dailyReportIndex',
        name: 'dailyReportIndex',
        meta: {
          title: '日报表'
        },
        component: () => import('@/view/financialStatements/dailyReport.vue')
      }
    ]
  },
  {
    path: '/abstract',
    name: 'abstract',
    component: Main,
    meta: {
      title: '摘要汇总表'
    },
    children: [
      {
        path: 'abstractIndex',
        name: 'abstractIndex',
        meta: {
          title: '摘要汇总表'
        },
        component: () => import('@/view/financialStatements/abstract.vue')
      }
    ]
  },
  {
    path: '/accountingItemBalance',
    name: 'accountingItemBalance',
    component: Main,
    meta: {
      title: '核算项目余额表'
    },
    children: [
      {
        path: 'accountingItemBalanceIndex',
        name: 'accountingItemBalanceIndex',
        meta: {
          title: '核算项目余额表'
        },
        component: () => import('@/view/financialStatements/accountingItemBalance.vue')
      }
    ]
  },
  {
    path: '/accountingItemDetail',
    name: 'accountingItemDetail',
    component: Main,
    meta: {
      title: '核算项目余额表'
    },
    children: [
      {
        path: 'accountingItemDetailIndex',
        name: 'accountingItemDetailIndex',
        meta: {
          title: '核算项目余额表'
        },
        component: () => import('@/view/financialStatements/accountingItemDetail.vue')
      }
    ]
  },
  {
    path: '/accountingItemSummary',
    name: 'accountingItemSummary',
    component: Main,
    meta: {
      title: '核算项目汇总表'
    },
    children: [
      {
        path: 'accountingItemSummaryIndex',
        name: 'accountingItemSummaryIndex',
        meta: {
          title: '核算项目汇总表'
        },
        component: () => import('@/view/financialStatements/accountingItemSummary.vue')
      }
    ]
  },
  {
    path: '/accountingItemCombination',
    name: 'accountingItemCombination',
    component: Main,
    meta: {
      title: '核算项目组合表'
    },
    children: [
      {
        path: 'accountingItemCombinationIndex',
        name: 'accountingItemCombinationIndex',
        meta: {
          title: '核算项目组合表'
        },
        component: () => import('@/view/financialStatements/accountingItemCombination.vue')
      }
    ]
  },
  {
    path: '/accountingItemSubject',
    name: 'accountingItemSubject',
    component: Main,
    meta: {
      title: '核算项目科目组合表'
    },
    children: [
      {
        path: 'accountingItemSubjectIndex',
        name: 'accountingItemSubjectIndex',
        meta: {
          title: '核算项目科目组合表'
        },
        component: () => import('@/view/financialStatements/accountingItemSubject.vue')
      }
    ]
  },
  {
    path: '/finalTuningHistory',
    name: 'finalTuningHistory',
    component: Main,
    meta: {
      title: '调汇历史信息'
    },
    children: [
      {
        path: 'finalTuningHistoryIndex',
        name: 'finalTuningHistoryIndex',
        meta: {
          title: '调汇历史信息'
        },
        component: () => import('@/view/financialStatements/finalTuningHistory.vue')
      }
    ]
  },
  {
    path: '/interest',
    name: 'interest',
    component: Main,
    meta: {
      title: '科目利息计算表'
    },
    children: [
      {
        path: 'interestIndex',
        name: 'interestIndex',
        meta: {
          title: '科目利息计算表'
        },
        component: () => import('@/view/financialStatements/interest.vue')
      }
    ]
  },
  {
    path: '/automaticTransfer',
    name: 'automaticTransfer',
    component: Main,
    meta: {
      title: '自动转账'
    },
    children: [
      {
        path: 'automaticTransferIndex',
        name: 'automaticTransferIndex',
        meta: {
          title: '自动转账'
        },
        component: () => import('@/view/automaticTransfer/index.vue')
      }
    ]
  },
  {
    path: '/accountingMoreColumn',
    name: 'accountingMoreColumn',
    component: Main,
    meta: {
      title: '多栏账'
    },
    children: [
      {
        path: 'accountingMoreColumnIndex',
        name: 'accountingMoreColumnIndex',
        meta: {
          title: '多栏账'
        },
        component: () => import('@/view/accountBook/accountingMoreColumn.vue')
      }
    ]
  },
  {
    path: '/profit',
    name: 'profit',
    component: Main,
    meta: {
      title: '新会计准则利润表'
    },
    children: [
      {
        path: 'profitIndex',
        name: 'profitIndex',
        meta: {
          title: '新会计准则利润表'
        },
        component: () => import('@/view/reportForms/profit.vue')
      }
    ]
  },
  {
    path: '/balanceSheet',
    name: 'balanceSheet',
    component: Main,
    meta: {
      title: '新会计准则资产负债表'
    },
    children: [
      {
        path: 'balanceSheetIndex',
        name: 'balanceSheetIndex',
        meta: {
          title: '新会计准则资产负债表'
        },
        component: () => import('@/view/reportForms/balanceSheet.vue')
      }
    ]
  },
  {
    path: '/ownerEquity',
    name: 'ownerEquity',
    component: Main,
    meta: {
      title: '新会计准则所有和权益变动表'
    },
    children: [
      {
        path: 'ownerEquityIndex',
        name: 'ownerEquityIndex',
        meta: {
          title: '新会计准则所有和权益变动表'
        },
        component: () => import('@/view/reportForms/ownerEquity.vue')
      }
    ]
  },
  {
    path: '/reportForms',
    name: 'reportForms',
    component: Main,
    meta: {
      title: '新会计准则财务表'
    },
    children: [
      {
        path: 'reportFormsList',
        name: 'reportFormsList',
        meta: {
          title: '自定义报表列表'
        },
        component: () => import('@/view/reportForms/list.vue')
      },
      {
        path: 'reportFormsCustom',
        name: 'reportFormsCustom',
        meta: {
          title: '自定义报表'
        },
        component: () => import('@/view/reportForms/custom.vue')
      }
    ]
  },
  {
    path: '/purchase',
    name: 'purchase',
    component: Main,
    meta: {
      title: '采购单据'
    },
    children: [
      {
        path: 'purchaseOrder',
        name: 'purchaseOrder',
        meta: {
          title: '采购订单'
        },
        component: () => import('@/view/purchaseOrder/form.vue')
      },
      {
        path: 'purchaseOrderList',
        name: 'purchaseOrderList',
        meta: {
          title: '采购订单列表'
        },
        component: () => import('@/view/purchaseOrder/list.vue')
      },
      {
        path: 'purchaseWarehouse',
        name: 'purchaseWarehouse',
        meta: {
          title: '采购入库单'
        },
        component: () => import('@/view/purchaseWarehouse/form.vue')
      },
      {
        path: 'purchaseWarehouseList',
        name: 'purchaseWarehouseList',
        meta: {
          title: '采购入库单列表'
        },
        component: () => import('@/view/purchaseWarehouse/list.vue')
      },
      {
        path: 'purchaseReturn',
        name: 'purchaseReturn',
        meta: {
          title: '采购退货单'
        },
        component: () => import('@/view/purchaseReturn/form.vue')
      },
      {
        path: 'purchaseReturnList',
        name: 'purchaseReturnList',
        meta: {
          title: '采购退货单列表'
        },
        component: () => import('@/view/purchaseReturn/list.vue')
      }
    ]
  },
  {
    path: '/purchaseReport',
    name: 'purchaseReport',
    component: Main,
    meta: {
      title: '采购报表'
    },
    children: [
      {
        path: 'purchaseReportDetail',
        name: 'purchaseReportDetail',
        meta: {
          title: '采购明细表'
        },
        component: () => import('@/view/purchaseReport/detail.vue')
      },
      {
        path: 'purchaseReportSummary',
        name: 'purchaseReportSummary',
        meta: {
          title: '采购汇总表'
        },
        component: () => import('@/view/purchaseReport/summary.vue')
      },
      {
        path: 'purchaseReportTracking',
        name: 'purchaseReportTracking',
        meta: {
          title: '采购订单跟踪表'
        },
        component: () => import('@/view/purchaseReport/tracking.vue')
      }
    ]
  },
  {
    path: '/sales',
    name: 'sales',
    component: Main,
    meta: {
      title: '销售单据'
    },
    children: [
      {
        path: 'salesOrder',
        name: 'salesOrder',
        meta: {
          title: '销售订单'
        },
        component: () => import('@/view/salesOrder/form.vue')
      },
      {
        path: 'salesOrderList',
        name: 'salesOrderList',
        meta: {
          title: '销售订单列表'
        },
        component: () => import('@/view/salesOrder/list.vue')
      },
      {
        path: 'salesWarehouse',
        name: 'salesWarehouse',
        meta: {
          title: '销售出库单'
        },
        component: () => import('@/view/salesWarehouse/form.vue')
      },
      {
        path: 'salesWarehouseList',
        name: 'salesWarehouseList',
        meta: {
          title: '销售出库单列表'
        },
        component: () => import('@/view/salesWarehouse/list.vue')
      },
      {
        path: 'salesReturn',
        name: 'salesReturn',
        meta: {
          title: '销售退货单'
        },
        component: () => import('@/view/salesReturn/form.vue')
      },
      {
        path: 'salesReturnList',
        name: 'salesReturnList',
        meta: {
          title: '销售退货单列表'
        },
        component: () => import('@/view/salesReturn/list.vue')
      }
    ]
  },
  {
    path: '/salesReport',
    name: 'salesReport',
    component: Main,
    meta: {
      title: '销售报表'
    },
    children: [
      {
        path: 'salesReportDetail',
        name: 'salesReportDetail',
        meta: {
          title: '销售明细表'
        },
        component: () => import('@/view/salesReport/detail.vue')
      },
      {
        path: 'salesReportTracking',
        name: 'salesReportTracking',
        meta: {
          title: '销售订单跟踪表'
        },
        component: () => import('@/view/salesReport/tracking.vue')
      },
      {
        path: 'salesReportAnalysis',
        name: 'salesReportAnalysis',
        meta: {
          title: '销售分析'
        },
        component: () => import('@/view/salesReport/analysis.vue')
      },
      {
        path: 'salesReportPSummary',
        name: 'salesReportPSummary',
        meta: {
          title: '采购销售汇总表'
        },
        component: () => import('@/view/salesReport/pSummary.vue')
      },
      {
        path: 'salesReportSummary',
        name: 'salesReportSummary',
        meta: {
          title: '销售汇总表'
        },
        component: () => import('@/view/salesReport/summary.vue')
      },
      {
        path: 'salesReportRanking',
        name: 'salesReportRanking',
        meta: {
          title: '销售排行表'
        },
        component: () => import('@/view/salesReport/ranking.vue')
      },
      {
        path: 'salesReportCollection',
        name: 'salesReportCollection',
        meta: {
          title: '销售收款一览表'
        },
        component: () => import('@/view/salesReport/collection.vue')
      }
    ]
  },
  {
    path: '/warehouseInventory',
    name: 'warehouseInventory',
    component: Main,
    meta: {
      title: '仓存单据'
    },
    children: [
      {
        path: 'warehouseIn',
        name: 'warehouseIn',
        meta: {
          title: '其他入库单'
        },
        component: () => import('@/view/warehouseIn/form.vue')
      },
      {
        path: 'warehouseInList',
        name: 'warehouseInList',
        meta: {
          title: '其他入库单列表'
        },
        component: () => import('@/view/warehouseIn/list.vue')
      },
      {
        path: 'warehouseOut',
        name: 'warehouseOut',
        meta: {
          title: '其他出库单'
        },
        component: () => import('@/view/warehouseOut/form.vue')
      },
      {
        path: 'warehouseOutList',
        name: 'warehouseOutList',
        meta: {
          title: '其他出库单列表'
        },
        component: () => import('@/view/warehouseOut/list.vue')
      },
      {
        path: 'warehouseReceipt',
        name: 'warehouseReceipt',
        meta: {
          title: '移仓单'
        },
        component: () => import('@/view/warehouseReceipt/form.vue')
      },
      {
        path: 'warehouseReceiptList',
        name: 'warehouseReceiptList',
        meta: {
          title: '移仓单列表'
        },
        component: () => import('@/view/warehouseReceipt/list.vue')
      },
      {
        path: 'warehouseAllocatingOut',
        name: 'warehouseAllocatingOut',
        meta: {
          title: '调拨出库单'
        },
        component: () => import('@/view/warehouseAllocatingOut/form.vue')
      },
      {
        path: 'warehouseAllocatingOutList',
        name: 'warehouseAllocatingOutList',
        meta: {
          title: '调拨出库单列表'
        },
        component: () => import('@/view/warehouseAllocatingOut/list.vue')
      },
      {
        path: 'warehouseAllocatingIn',
        name: 'warehouseAllocatingIn',
        meta: {
          title: '调拨入库单'
        },
        component: () => import('@/view/warehouseAllocatingIn/form.vue')
      },
      {
        path: 'warehouseAllocatingInList',
        name: 'warehouseAllocatingInList',
        meta: {
          title: '调拨入库单列表'
        },
        component: () => import('@/view/warehouseAllocatingIn/list.vue')
      },
      {
        path: 'warehouseAllocatingDiffList',
        name: 'warehouseAllocatingDiffList',
        meta: {
          title: '调拨差异处理表'
        },
        component: () => import('@/view/warehouseAllocatingDiff/list.vue')
      },
      {
        path: 'warehouseDiskPoint',
        name: 'warehouseDiskPoint',
        meta: {
          title: '盘点单'
        },
        component: () => import('@/view/warehouseDiskPoint/form.vue')
      },
      {
        path: 'warehouseDiskPointList',
        name: 'warehouseDiskPointList',
        meta: {
          title: '盘点单列表'
        },
        component: () => import('@/view/warehouseDiskPoint/list.vue')
      },
      {
        path: 'warehouseDiskSurplus',
        name: 'warehouseDiskSurplus',
        meta: {
          title: '盘盈单'
        },
        component: () => import('@/view/warehouseDiskSurplus/form.vue')
      },
      {
        path: 'warehouseDiskSurplusList',
        name: 'warehouseDiskSurplusList',
        meta: {
          title: '盘盈单列表'
        },
        component: () => import('@/view/warehouseDiskSurplus/list.vue')
      },
      {
        path: 'warehouseDiskDeficient',
        name: 'warehouseDiskDeficient',
        meta: {
          title: '盘亏单'
        },
        component: () => import('@/view/warehouseDiskDeficient/form.vue')
      },
      {
        path: 'warehouseDiskDeficientList',
        name: 'warehouseDiskDeficientList',
        meta: {
          title: '盘亏单列表'
        },
        component: () => import('@/view/warehouseDiskDeficient/list.vue')
      }
    ]
  },
  {
    path: '/warehouseReport',
    name: 'warehouseReport',
    component: Main,
    meta: {
      title: '仓存报表'
    },
    children: [
      {
        path: 'warehouseReportQuery',
        name: 'warehouseReportQuery',
        meta: {
          title: '库存查询表'
        },
        component: () => import('@/view/warehouseReport/query.vue')
      },
      {
        path: 'warehouseReportAvailable',
        name: 'warehouseReportAvailable',
        meta: {
          title: '预计可用库存表'
        },
        component: () => import('@/view/warehouseReport/available.vue')
      },
      {
        path: 'warehouseReportDetail',
        name: 'warehouseReportDetail',
        meta: {
          title: '商品收发明细表'
        },
        component: () => import('@/view/warehouseReport/detail.vue')
      },
      {
        path: 'warehouseReportSummary',
        name: 'warehouseReportSummary',
        meta: {
          title: '商品收发汇总表'
        },
        component: () => import('@/view/warehouseReport/summary.vue')
      },
      {
        path: 'warehouseReportTracking',
        name: 'warehouseReportTracking',
        meta: {
          title: '批次跟踪表'
        },
        component: () => import('@/view/warehouseReport/tracking.vue')
      },
      {
        path: 'warehouseReportState',
        name: 'warehouseReportState',
        meta: {
          title: '批次状态表'
        },
        component: () => import('@/view/warehouseReport/state.vue')
      }
    ]
  },
  {
    path: '/receivable',
    name: 'receivable',
    component: Main,
    meta: {
      title: '应收单据'
    },
    children: [
      {
        path: 'receivableCollection',
        name: 'receivableCollection',
        meta: {
          title: '收款单'
        },
        component: () => import('@/view/receivableCollection/form.vue')
      },
      {
        path: 'receivableCollectionList',
        name: 'receivableCollectionList',
        meta: {
          title: '收款单列表'
        },
        component: () => import('@/view/receivableCollection/list.vue')
      },
      {
        path: 'receivablePayments',
        name: 'receivablePayments',
        meta: {
          title: '预收款单'
        },
        component: () => import('@/view/receivablePayments/form.vue')
      },
      {
        path: 'receivablePaymentsList',
        name: 'receivablePaymentsList',
        meta: {
          title: '预收款单列表'
        },
        component: () => import('@/view/receivablePayments/list.vue')
      },
      {
        path: 'receivableRefund',
        name: 'receivableRefund',
        meta: {
          title: '预收退款'
        },
        component: () => import('@/view/receivableRefund/form.vue')
      },
      {
        path: 'receivableRefundList',
        name: 'receivableRefundList',
        meta: {
          title: '预收退款单列表'
        },
        component: () => import('@/view/receivableRefund/list.vue')
      },
      {
        path: 'receivableOther',
        name: 'receivableOther',
        meta: {
          title: '其他应收单'
        },
        component: () => import('@/view/receivableOther/form.vue')
      },
      {
        path: 'receivableOtherList',
        name: 'receivableOtherList',
        meta: {
          title: '其他应收单列表'
        },
        component: () => import('@/view/receivableOther/list.vue')
      },
      {
        path: 'receivableVerification',
        name: 'receivableVerification',
        meta: {
          title: '核销单'
        },
        component: () => import('@/view/receivableVerification/form.vue')
      },
      {
        path: 'receivableVerificationList',
        name: 'receivableVerificationList',
        meta: {
          title: '核销单列表'
        },
        component: () => import('@/view/receivableVerification/list.vue')
      }
    ]
  },
  {
    path: '/payable',
    name: 'payable',
    component: Main,
    meta: {
      title: '应付单据'
    },
    children: [
      {
        path: 'payableCollection',
        name: 'payableCollection',
        meta: {
          title: '付款单'
        },
        component: () => import('@/view/payableCollection/form.vue')
      },
      {
        path: 'payableCollectionList',
        name: 'payableCollectionList',
        meta: {
          title: '付款单列表'
        },
        component: () => import('@/view/payableCollection/list.vue')
      },
      {
        path: 'payablePayments',
        name: 'payablePayments',
        meta: {
          title: '预付款单'
        },
        component: () => import('@/view/payablePayments/form.vue')
      },
      {
        path: 'payablePaymentsList',
        name: 'payablePaymentsList',
        meta: {
          title: '预付款单列表'
        },
        component: () => import('@/view/payablePayments/list.vue')
      },
      {
        path: 'payableRefund',
        name: 'payableRefund',
        meta: {
          title: '预付退款'
        },
        component: () => import('@/view/payableRefund/form.vue')
      },
      {
        path: 'payableRefundList',
        name: 'payableRefundList',
        meta: {
          title: '预付退款单列表'
        },
        component: () => import('@/view/payableRefund/list.vue')
      },
      {
        path: 'payableOther',
        name: 'payableOther',
        meta: {
          title: '其他应付单'
        },
        component: () => import('@/view/payableOther/form.vue')
      },
      {
        path: 'payableOtherList',
        name: 'payableOtherList',
        meta: {
          title: '其他应付单列表'
        },
        component: () => import('@/view/payableOther/list.vue')
      }
    ]
  },
  {
    path: '/receivableReport',
    name: 'receivableReport',
    component: Main,
    meta: {
      title: '应收应付报表'
    },
    children: [
      {
        path: 'receivableReportDetail',
        name: 'receivableReportDetail',
        meta: {
          title: '应收明细表'
        },
        component: () => import('@/view/receivableReport/detail.vue')
      },
      {
        path: 'payableReportDetail',
        name: 'payableReportDetail',
        meta: {
          title: '应付明细表'
        },
        component: () => import('@/view/payableReport/detail.vue')
      }
    ]
  },
  {
    path: '/smart',
    name: 'smart',
    component: Main,
    meta: {
      title: '智能凭证中心'
    },
    children: [
      {
        path: 'subjectAssociated',
        name: 'subjectAssociated',
        meta: {
          title: '科目关联设置'
        },
        component: () => import('@/view/subjectAssociated/index.vue')
      },
      {
        path: 'credentialsOrder',
        name: 'credentialsOrder',
        meta: {
          title: '业务凭证模板'
        },
        component: () => import('@/view/credentialsOrder/index.vue')
      },
      {
        path: 'credentialsCreate',
        name: 'credentialsCreate',
        meta: {
          title: '生成凭证'
        },
        component: () => import('@/view/credentialsCreate/index.vue')
      },
      {
        path: 'credentialsCache',
        name: 'credentialsCache',
        meta: {
          title: '查业务凭证'
        },
        component: () => import('@/view/credentialsCreate/cache.vue')
      },
      {
        path: 'credentialsForm',
        name: 'credentialsForm',
        meta: {
          title: '暂存凭证修改'
        },
        component: () => import('@/view/credentialsCreate/form.vue')
      }
    ]
  },
  {
    path: '/processTracking',
    name: 'processTracking',
    component: Main,
    meta: {
      title: '全流程跟踪'
    },
    children: [
      {
        path: 'processTrackingIndex',
        name: 'processTrackingIndex',
        meta: {
          title: '全流程跟踪表'
        },
        component: () => import('@/view/processTracking/index.vue')
      }
    ]
  }
]
