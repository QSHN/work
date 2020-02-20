export const sideBar = [
  {
    id: '1',
    name: '采购管理',
    icon: 'purchase',
    child: [
      {
        id: '1-1',
        name: '采购单据',
        child: [
          {
            id: '1-1-1',
            name: '采购订单',
            routeName: 'purchaseOrder',
            search: 'purchaseOrderList'
          },
          {
            id: '1-1-2',
            name: '采购入库',
            routeName: 'purchaseWarehouse',
            search: 'purchaseWarehouseList'
          },
          {
            id: '1-1-3',
            name: '采购退货',
            routeName: 'purchaseReturn',
            search: 'purchaseReturnList'
          }
        ]
      },
      {
        id: '1-2',
        name: '采购报表',
        child: [
          {
            id: '1-2-1',
            name: '采购明细表',
            routeName: 'purchaseReportDetail'
          },
          {
            id: '1-2-2',
            name: '采购汇总表',
            routeName: 'purchaseReportSummary'
          },
          {
            id: '1-2-3',
            name: '采购订单跟踪表',
            routeName: 'purchaseReportTracking'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '销售管理',
    icon: 'sale',
    child: [
      {
        id: '2-1',
        name: '销售单据',
        child: [
          {
            id: '2-1-1',
            name: '销售订单',
            routeName: 'salesOrder',
            search: 'salesOrderList'
          },
          {
            id: '2-1-2',
            name: '销售出库',
            routeName: 'salesWarehouse',
            search: 'salesWarehouseList'
          },
          {
            id: '2-1-3',
            name: '销售退货',
            routeName: 'salesReturn',
            search: 'salesReturnList'
          }
        ]
      },
      {
        id: '2-2',
        name: '销售报表',
        child: [
          {
            id: '2-2-1',
            name: '销售明细表',
            routeName: 'salesReportDetail'
          },
          {
            id: '2-2-2',
            name: '销售订单跟踪表',
            routeName: 'salesReportTracking'
          },
          // {
          //   id: '2-2-3',
          //   name: '销售分析',
          //   routeName: 'salesReportAnalysis'
          // },
          {
            id: '2-2-4',
            name: '采购销售汇总表',
            routeName: 'salesReportPSummary'
          },
          {
            id: '2-2-5',
            name: '销售汇总表',
            routeName: 'salesReportSummary'
          },
          {
            id: '2-2-6',
            name: '销售排行表',
            routeName: 'salesReportRanking'
          }
          // {
          //   id: '2-2-7',
          //   name: '销售收款一览表',
          //   routeName: 'salesReportCollection'
          // }
        ]
      }
    ]
  },
  {
    id: '3',
    name: '仓存管理',
    icon: 'warehouse',
    child: [
      {
        id: '3-1',
        name: '仓存单据',
        child: [
          {
            id: '3-1-1',
            name: '其他入库',
            routeName: 'warehouseIn',
            search: 'warehouseInList'
          },
          {
            id: '3-1-2',
            name: '其他出库',
            routeName: 'warehouseOut',
            search: 'warehouseOutList'
          },
          {
            id: '3-1-3',
            name: '移仓库',
            routeName: 'warehouseReceipt',
            search: 'warehouseReceiptList'
          },
          {
            id: '3-1-4',
            name: '调拨出库',
            routeName: 'warehouseAllocatingOut',
            search: 'warehouseAllocatingOutList'
          },
          {
            id: '3-1-5',
            name: '调拨入库',
            routeName: 'warehouseAllocatingIn',
            search: 'warehouseAllocatingInList'
          },
          {
            id: '3-1-6',
            name: '调拨差异处理表',
            routeName: 'warehouseAllocatingDiffList'
          },
          {
            id: '3-1-7',
            name: '盘点单',
            routeName: 'warehouseDiskPoint',
            search: 'warehouseDiskPointList'
          },
          {
            id: '3-1-8',
            name: '盘盈单',
            routeName: 'warehouseDiskSurplus',
            search: 'warehouseDiskSurplusList'
          },
          {
            id: '3-1-9',
            name: '盘亏单',
            routeName: 'warehouseDiskDeficient',
            search: 'warehouseDiskDeficientList'
          }
        ]
      },
      {
        id: '3-2',
        name: '仓存报表',
        child: [
          {
            id: '3-2-1',
            name: '库存查询表',
            routeName: 'warehouseReportQuery'
          },
          {
            id: '3-2-2',
            name: '预计可用库存表',
            routeName: 'warehouseReportAvailable'
          },
          {
            id: '3-2-3',
            name: '商品收发明细表',
            routeName: 'warehouseReportDetail'
          },
          {
            id: '3-2-4',
            name: '商品收发汇总表',
            routeName: 'warehouseReportSummary'
          }
          // ,
          // {
          //   id: '3-2-5',
          //   name: '批次跟踪表',
          //   routeName: 'warehouseReportTracking'
          // },
          // {
          //   id: '3-2-6',
          //   name: '批次状态表',
          //   routeName: 'warehouseReportState'
          // }
        ]
      }
    ]
  },
  {
    id: '4',
    name: '应收应付',
    icon: 'receivable',
    child: [
      {
        id: '4-1',
        name: '应收单据',
        child: [
          {
            id: '4-1-1',
            name: '收款',
            routeName: 'receivableCollection',
            search: 'receivableCollectionList'
          },
          {
            id: '4-1-2',
            name: '预收款',
            routeName: 'receivablePayments',
            search: 'receivablePaymentsList'
          },
          {
            id: '4-1-3',
            name: '预收退款',
            routeName: 'receivableRefund',
            search: 'receivableRefundList'
          },
          {
            id: '4-1-4',
            name: '其他应收',
            routeName: 'receivableOther',
            search: 'receivableOtherList'
          },
          {
            id: '4-1-5',
            name: '核销',
            routeName: 'receivableVerification',
            search: 'receivableVerificationList'
          }
        ]
      },
      {
        id: '4-2',
        name: '应付单据',
        child: [
          {
            id: '4-2-1',
            name: '付款',
            routeName: 'payableCollection',
            search: 'payableCollectionList'
          },
          {
            id: '4-2-2',
            name: '预付款',
            routeName: 'payablePayments',
            search: 'payablePaymentsList'
          },
          {
            id: '4-2-3',
            name: '预付退款',
            routeName: 'payableRefund',
            search: 'payableRefundList'
          },
          {
            id: '4-2-4',
            name: '其他应付',
            routeName: 'payableOther',
            search: 'payableOtherList'
          }
        ]
      },
      {
        id: '4-3',
        name: '报表',
        child: [
          {
            id: '4-3-1',
            name: '应收明细表',
            routeName: 'receivableReportDetail'
          },
          {
            id: '4-3-2',
            name: '应付明细表',
            routeName: 'payableReportDetail'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    name: '财务处理',
    icon: 'finance',
    child: [
      {
        id: '5-1',
        name: '凭证',
        child: [
          {
            id: '5-1-1',
            name: '录凭证',
            routeName: 'voucherInputIndex'
          },
          {
            id: '5-1-2',
            name: '查凭证',
            routeName: 'credentialsIndex'
          },
          {
            id: '5-1-3',
            name: '凭证过账',
            routeName: 'credentialsPost'
          },
          {
            id: '5-1-4',
            name: '模式凭证',
            routeName: 'voucherTemplateIndex'
          }
        ]
      },
      {
        id: '5-2',
        name: '账簿',
        child: [
          {
            id: '5-2-1',
            name: '总分类账',
            routeName: 'generalLedgerIndex'
          },
          {
            id: '5-2-2',
            name: '明细分类账',
            routeName: 'credentialsSubjectIndex'
          },
          {
            id: '5-2-3',
            name: '数量金额总账',
            routeName: 'numberAccountingIndex'
          },
          {
            id: '5-2-4',
            name: '数量金额明细账',
            routeName: 'numberAccountingDetailIndex'
          },
          {
            id: '5-2-5',
            name: '多栏账',
            routeName: 'accountingMoreColumnIndex'
          },
          {
            id: '5-2-6',
            name: '核算项目分类总账',
            routeName: 'allAccountingIndex'
          },
          {
            id: '5-2-7',
            name: '核算项目明细账',
            routeName: 'accountingDetailIndex'
          }
        ]
      },
      {
        id: '5-3',
        name: '财务报表',
        child: [
          {
            id: '5-3-1',
            name: '科目余额表',
            routeName: 'accountBalanceIndex'
          },
          {
            id: '5-3-2',
            name: '试算平衡表',
            routeName: 'subjectTrialIndex'
          },
          {
            id: '5-3-3',
            name: '日报表查询',
            routeName: 'dailyReportIndex'
          },
          {
            id: '5-3-4',
            name: '摘要汇总表',
            routeName: 'abstractIndex'
          },
          {
            id: '5-3-5',
            name: '核算项目余额表',
            routeName: 'accountingItemBalanceIndex'
          },
          {
            id: '5-3-6',
            name: '核算项目明细表',
            routeName: 'accountingItemDetailIndex'
          },
          {
            id: '5-3-7',
            name: '核算项目汇总表',
            routeName: 'accountingItemSummaryIndex'
          },
          {
            id: '5-3-8',
            name: '核算项目组合表',
            routeName: 'accountingItemCombinationIndex'
          },
          {
            id: '5-3-9',
            name: '核算项目与科目结合表',
            routeName: 'accountingItemSubjectIndex'
          },
          {
            id: '5-3-10',
            name: '科目利息计算表',
            routeName: 'interestIndex'
          },
          {
            id: '5-3-11',
            name: '调汇历史信息表',
            routeName: 'finalTuningHistoryIndex'
          }
        ]
      },
      {
        id: '5-4',
        name: '智能凭证中心',
        child: [
          {
            id: '5-4-1',
            name: '生成凭证',
            routeName: 'credentialsCreate'
          },
          {
            id: '5-4-2',
            name: '科目关联设置',
            routeName: 'subjectAssociated'
          },
          {
            id: '5-4-3',
            name: '业务凭证模板',
            routeName: 'credentialsOrder'
          },
          {
            id: '5-4-4',
            name: '查业务凭证',
            routeName: 'credentialsCache'
          }
        ]
      },
      {
        id: '5-5',
        name: '期末处理',
        child: [
          {
            id: '5-5-1',
            name: '期末调汇',
            routeName: 'finalTuning'
          },
          {
            id: '5-5-2',
            name: '结转损益',
            routeName: 'carryForward'
          },
          {
            id: '5-5-3',
            name: '自动转账',
            routeName: 'automaticTransferIndex'
          },
          {
            id: '5-5-4',
            name: '期末结账',
            routeName: 'invoicing'
          }
        ]
      }
    ]
  },
  {
    id: '6',
    name: '财务报表',
    icon: 'report',
    child: [
      {
        id: '6-1',
        name: '财务报表',
        child: [
          {
            id: '6-1-1',
            name: '资产负债表',
            routeName: 'balanceSheetIndex'
          },
          {
            id: '6-1-2',
            name: '利润表',
            routeName: 'profitIndex'
          },
          // {
          //   id: '6-1-3',
          //   name: '现金流量表',
          //   routeName: ''
          // },
          // {
          //   id: '6-1-4',
          //   name: '部门利润表',
          //   routeName: ''
          // },
          {
            id: '6-1-5',
            name: '所有者权益变动表',
            routeName: 'ownerEquityIndex'
          },
          {
            id: '6-1-6',
            name: '自定义报表',
            routeName: 'reportFormsList'
          }
        ]
      }
    ]
  },
  {
    id: '7',
    name: '基础资料',
    icon: 'basic',
    child: [
      {
        id: '7-1',
        name: '商品资料',
        child: [
          {
            id: '7-1-1',
            name: '商品信息',
            routeName: 'commodityInfoIndex'
          },
          {
            id: '7-1-2',
            name: '计量单位',
            routeName: 'measureUnitIndex'
          },
          {
            id: '7-1-3',
            name: '商品品牌',
            routeName: 'commodityBrandIndex'
          },
          {
            id: '7-1-4',
            name: '商品标签',
            routeName: 'commodityLabelIndex'
          },
          {
            id: '7-1-5',
            name: '辅助属性',
            routeName: 'auxiliaryAttributesIndex'
          },
          {
            id: '7-1-6',
            name: '客户商品编码',
            routeName: 'customerCommodityCodeIndex'
          },
          {
            id: '7-1-7',
            name: '商品价格资料',
            routeName: 'commodityPricesIndex'
          },
          {
            id: '7-1-8',
            name: '客户价格资料',
            routeName: 'customerPrices'
          },
          {
            id: '7-1-9',
            name: '价格取数优先级',
            routeName: 'strategyPrices'
          },
          {
            id: '7-1-10',
            name: '条码生成规则',
            routeName: 'barCodeRulesIndex'
          },
          {
            id: '7-1-11',
            name: '条码标签打印',
            routeName: ''
          }
        ]
      },
      {
        id: '7-2',
        name: '业务资料',
        child: [
          {
            id: '7-2-1',
            name: '客户',
            routeName: 'customerIndex'
          },
          {
            id: '7-2-2',
            name: '供应商',
            routeName: 'supplierIndex'
          },
          {
            id: '7-2-3',
            name: '部门',
            routeName: 'departmentIndex'
          },
          {
            id: '7-2-4',
            name: '职员',
            routeName: 'clerkIndex'
          },
          {
            id: '7-2-5',
            name: '仓库',
            routeName: 'warehouseIndex'
          },
          {
            id: '7-2-6',
            name: '收入类别',
            routeName: 'incomeCategoryIndex'
          },
          {
            id: '7-2-7',
            name: '支出类别',
            routeName: 'spendingCategoryIndex'
          },
          {
            id: '7-2-8',
            name: '辅助资料',
            routeName: 'auxiliaryInfoIndex'
          }
        ]
      },
      {
        id: '7-3',
        name: '财务资料',
        child: [
          {
            id: '7-3-1',
            name: '币别',
            routeName: 'currencyIndex'
          },
          {
            id: '7-3-2',
            name: '结算方式',
            routeName: 'clearingFormIndex'
          },
          {
            id: '7-3-3',
            name: '银行账户',
            routeName: 'bankAccountIndex'
          },
          {
            id: '7-3-4',
            name: '科目',
            routeName: 'subjectIndex'
          },
          {
            id: '7-3-5',
            name: '凭证字',
            routeName: 'proofWordsIndex'
          },
          {
            id: '7-3-6',
            name: '凭证模板',
            routeName: 'voucherTemplateIndex'
          }
          // {
          //   id: '7-3-7',
          //   name: '汇率体系',
          //   routeName: 'exchangeRateIndex'
          // },
          // {
          //   id: '7-3-8',
          //   name: '费用',
          //   routeName: 'costIndex'
          // },
          // {
          //   id: '7-3-9',
          //   name: '现金流量项目',
          //   routeName: 'cashFlowIndex'
          // },
          // {
          //   id: '7-3-10',
          //   name: '银行联行号',
          //   routeName: 'bankIndex'
          // }
        ]
      },
      {
        id: '7-4',
        name: '期初录入',
        child: [
          {
            id: '7-4-1',
            name: '商品期初',
            routeName: 'commodityBeginningIndex'
          },
          {
            id: '7-4-2',
            name: '客户初始数据',
            routeName: 'customerIndex'
          },
          {
            id: '7-4-3',
            name: '供应商初始数据',
            routeName: 'supplierIndex'
          },
          {
            id: '7-4-4',
            name: '财务初始余额',
            routeName: 'subjectInitIndex'
          },
          {
            id: '7-4-6',
            name: '现金流量初始数据',
            routeName: 'cashFlowTableInitIndex'
          },
          {
            id: '7-4-7',
            name: '结束初始化',
            routeName: 'generalLedgerInit'
          },
          {
            id: '7-4-8',
            name: '反初始化',
            routeName: 'generalLedgerUnInit'
          }
        ]
      }
    ]
  },
  {
    id: '8',
    name: '系统设置',
    icon: 'set',
    child: [
      {
        id: '8-1',
        name: '基础设置',
        child: [
          {
            id: '8-1-1',
            name: '系统参数',
            routeName: ''
          },
          {
            id: '8-1-2',
            name: '用户授权',
            routeName: 'userManageIndex'
          }
          // {
          //   id: '8-1-3',
          //   name: '网络控制',
          //   routeName: ''
          // },
          // {
          //   id: '8-1-4',
          //   name: '操作日志',
          //   routeName: ''
          // },
          // {
          //   id: '8-1-5',
          //   name: '重新初始化',
          //   routeName: ''
          // }
        ]
      }
      // {
      //   id: '8-2',
      //   name: '个性化设置',
      //   child: [
      //     {
      //       id: '8-2-1',
      //       name: '编码规则',
      //       routeName: ''
      //     },
      //     {
      //       id: '8-2-2',
      //       name: '打印模板',
      //       routeName: ''
      //     },
      //     {
      //       id: '8-2-3',
      //       name: '引入引出模板',
      //       routeName: ''
      //     }
      //   ]
      // }
    ]
  }
  // {
  //   id: '9',
  //   name: '应用商城',
  //   icon: 'use',
  //   child: [
  //     {
  //       id: '9-1',
  //       name: '我的应用',
  //       child: [
  //         {
  //           id: '9-1-1',
  //           name: '开发API',
  //           routeName: ''
  //         },
  //         {
  //           id: '9-1-2',
  //           name: '设计平台',
  //           routeName: ''
  //         }
  //       ]
  //     },
  //     {
  //       id: '9-2',
  //       name: '商城应用',
  //       child: [
  //         {
  //           id: '9-2-1',
  //           name: '快递100',
  //           routeName: ''
  //         }
  //       ]
  //     }
  //   ]
  // }
]
