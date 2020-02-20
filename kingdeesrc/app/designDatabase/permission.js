const permission = [
    {
        title: '采购订单',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false },
            { action: '入库', val: false },
            { action: '启用', val: false },
            { action: '关闭', val: false }
        ]
    },
    {
        title: '采购入库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false },
            { action: '付款', val: false },
            { action: '退货', val: false }
        ]
    },
    {
        title: '采购退货',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false },
            { action: '退款', val: false }
        ]
    },
    {
        title: '采购明细表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '采购汇总表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '采购订单跟踪表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '销售订单',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false },
            { action: '出库', val: false },
            { action: '启用', val: false },
            { action: '关闭', val: false }
        ]
    },
    {
        title: '销售出库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false },
            { action: '收款', val: false },
            { action: '退货', val: false }
        ]
    },
    {
        title: '销售退货',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false },
            { action: '退款', val: false }
        ]
    },
    {
        title: '销售明细表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '销售订单跟踪表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '采购销售汇总表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '销售汇总表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '销售排行表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '其他入库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '其他出库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '移仓库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '调拨入库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '调拨出库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '调拨差异处理表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '盘点单',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '锁盘', val: false },
            { action: '解锁', val: false },
            { action: '盈亏处理', val: false },
        ]
    },
    {
        title: '盘盈单',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '盘亏单',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '库存查询表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '预计可用库存表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '商品收发明细表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '商品收发汇总表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '批次跟踪表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '批次状态表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '收款',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '预收款',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '退款', val: false },
        ]
    },
    {
        title: '预收退款',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '其他应收',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '收款', val: false },
        ]
    },
    {
        title: '核销',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '付款',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '预付款',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '退款', val: false },
        ]
    },
    {
        title: '预付退款',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
        ]
    },
    {
        title: '其他应付',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '付款', val: false },
        ]
    },
    {
        title: '应收明细表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '应付明细表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '凭证',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '审核', val: false },
            { action: '反审核', val: false },
            { action: '复核', val: false },
            { action: '反复核', val: false },
            { action: '核准', val: false },
            { action: '反核准', val: false },
            { action: '过账', val: false },
            { action: '反过账', val: false },
            { action: '作废', val: false },
            { action: '反作废', val: false },
            { action: '冲销', val: false },
            { action: '打印', val: false },
            { action: '凭证整理', val: false },
            { action: '明细账', val: false },
        ]
    },
    {
        title: '模式凭证',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '总分类账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '明细分类账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '数量金额总账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '数量金额明细账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '多栏账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目分类总账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目明细账',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '科目余额表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '试算平衡表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '日报表查询',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '摘要汇总表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目余额表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目明细表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目汇总表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目组合表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '核算项目与科目结合表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '科目利息计算表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '调汇历史信息表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '生成凭证',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '科目关联设置',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '业务凭证模板',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '期末调汇',
        operation: [
            { action: '期末调汇', val: false }
        ]
    },
    {
        title: '结转损益',
        operation: [
            { action: '结转损益', val: false }
        ]
    },
    {
        title: '自动转账',
        operation: [
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '转账', val: false }
        ]
    },
    {
        title: '期末结账',
        operation: [
            { action: '期末结账', val: false }
        ]
    },
    {
        title: '资产负债表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '利润表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '现金流量表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '部门利润表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '所有者权益变动表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '自定义报表',
        operation: [
            { action: '查询', val: false },
            { action: '导出', val: false },
            { action: '打印', val: false }
        ]
    },
    {
        title: '商品信息',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '计量单位',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '商品品牌',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '商品标签',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '辅助属性',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '启用', val: false },
            { action: '禁用', val: false },
        ]
    },
    {
        title: '客户商品编码',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '商品价格资料',
        operation: [
            { action: '查询', val: false },
            { action: '修改', val: false }
        ]
    },
    {
        title: '客户价格资料',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '启用', val: false },
            { action: '禁用', val: false },
            { action: '复制', val: false },
            { action: '适用客户', val: false },
            { action: '价格策略', val: false },
        ]
    },
    {
        title: '价格取数优先级',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false }
        ]
    },
    {
        title: '条码生成规则',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '条码标签打印',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '客户',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '供应商',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '部门',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '职员',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '仓库',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '收入类别',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '支出类别',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '辅助资料',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '启用', val: false },
            { action: '禁用', val: false },
        ]
    },
    {
        title: '币别',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '结算方式',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '银行账户',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '科目',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '禁用', val: false },
            { action: '启用', val: false },
        ]
    },
    {
        title: '凭证字',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '凭证模板',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
        ]
    },
    {
        title: '商品期初',
        operation: [
            { action: '查询', val: false },
            { action: '修改', val: false }
        ]
    },
    {
        title: '财务初始余额',
        operation: [
            { action: '查询', val: false },
            { action: '修改', val: false }
        ]
    },
    {
        title: '现金流量初始数据',
        operation: [
            { action: '查询', val: false },
            { action: '修改', val: false }
        ]
    },
    {
        title: '结束初始化',
        operation: [
            { action: '结束初始化', val: false }
        ]
    },
    {
        title: '反初始化',
        operation: [
            { action: '反初始化', val: false }
        ]
    },
    {
        title: '系统参数',
        operation: [
            { action: '查询', val: false },
            { action: '修改', val: false }
        ]
    },
    {
        title: '用户授权',
        operation: [
            { action: '查询', val: false },
            { action: '新增', val: false },
            { action: '修改', val: false },
            { action: '删除', val: false },
            { action: '用户授权', val: false },
        ]
    }
]

module.exports = {
    permission
}
