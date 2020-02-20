const financialAccounting = {
  title: '总账',
  name: 'generalLedger',
  children: [
    {
      title: '凭证处理 ',
      name: 'processing',
      children: [
        { title: '凭证录入', name: 'voucherInputIndex' },
        { title: '凭证查询', name: 'credentialsIndex' },
        { title: '凭证过账', name: 'credentialsPost' },
        { title: '模式凭证', name: 'voucherTemplateIndex' }
      ]
    },
    {
      title: '账簿 ',
      name: 'theBooks',
      children: [
        { title: '总分类账', name: 'generalLedgerIndex' },
        { title: '明细分类账', name: 'credentialsSubjectIndex' },
        { title: '数量金额总账', name: 'numberAccountingIndex' },
        { title: '数量金额明细账', name: 'numberAccountingDetailIndex' },
        { title: '多栏账', name: 'accountingMoreColumnIndex' },
        { title: '核算项目分类总账', name: 'allAccountingIndex' },
        { title: '核算项目明细账', name: 'accountingDetailIndex' }
      ]
    },
    {
      title: '财务报表 ',
      name: 'financialStatements',
      children: [
        { title: '科目余额表', name: 'accountBalanceIndex' },
        { title: '试算平衡表', name: 'subjectTrialIndex' },
        { title: '日报表查询', name: 'dailyReportIndex' },
        { title: '摘要汇总表', name: 'abstractIndex' },
        { title: '核算项目余额表', name: 'accountingItemBalanceIndex' },
        { title: '核算项目明细表', name: 'accountingItemDetailIndex' },
        { title: '核算项目汇总表', name: 'accountingItemSummaryIndex' },
        { title: '核算项目组合表', name: 'accountingItemCombinationIndex' },
        { title: '核算项目与科目结合表', name: 'accountingItemSubjectIndex' },
        { title: '科目利息计算表', name: 'interestIndex' },
        { title: '调汇历史信息表', name: 'finalTuningHistoryIndex' }
      ]
    },
    {
      title: '结账 ',
      name: 'invoicing',
      children: [
        { title: '期末调汇', name: 'finalTuning' },
        { title: '结转损益', name: 'carryForward' },
        { title: '自动转账', name: 'automaticTransferIndex' },
        { title: '凭证摊销', name: '' },
        { title: '凭证预提', name: '' },
        { title: '期末结账', name: 'invoicing' }
      ]
    },
    {
      title: '往来 ',
      name: 'contacts',
      children: [
        { title: '核销管理', name: '' },
        { title: '往来对账单', name: '' },
        { title: '账龄分析表', name: '' },
        { title: '坏账明细表', name: '' },
        { title: '坏账统计分析表', name: '' }
      ]
    }
  ]
}

const reportForms = {
  title: '报表',
  name: 'reportForms',
  children: [
    {
      title: '新企业会计准则 ',
      name: 'accountingStandards',
      children: [
        { title: '新会计准则利润表', name: 'profitIndex' },
        { title: '新会计准则所有者权益变动表', name: 'ownerEquityIndex' },
        { title: '新会计准则资产负债表', name: 'balanceSheetIndex' }
      ]
    }
  ]
}

export const financial = {
  title: '财务',
  children: [{
    title: '财务会计',
    children: [
      financialAccounting,
      reportForms
    ]
  }]
}
