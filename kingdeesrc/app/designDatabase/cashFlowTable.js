const cashTable = [
    {
        title: '一、经营活动产生的现金流量',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '销售商品、提供劳务收到的现金',
        index: 1,
        money: null
    },
    {
        title: '收到的税费返还',
        index: 2,
        money: null
    },
    {
        title: '收到其他与经营活动有关的现金',
        index: 3,
        money: null
    },
    {
        title: '现金流入小计',
        index: 4,
        money: null,
        add: [1, 2, 3]
    },
    {
        title: ' 购买商品、接受劳务支付的现金',
        index: 5,
        money: null
    },
    {
        title: '支付给职工以及为职工支付的现金',
        index: 6,
        money: null
    },
    {
        title: '支付的各项税费',
        index: 7,
        money: null
    },
    {
        title: '支付其他与经营活动有关的现金',
        index: 8,
        money: null
    },
    {
        title: '现金流出小计',
        index: 9,
        money: null,
        add: [5, 6, 7, 8]
    },
    {
        title: '经营活动产生的现金流量净额',
        index: 10,
        money: null,
        add: [4],
        minus: [9]
    },
    {
        title: '二、投资活动产生的现金流量',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '收回投资收到的现金',
        index: 11,
        money: null
    },
    {
        title: '取得投资收益收到的现金',
        index: 12,
        money: null
    },
    {
        title: '处置固定资产、无形资产和其他长期资产收回的现金净额',
        index: 13,
        money: null
    },
    {
        title: '处置子公司及其他营业单位收到的现金净额',
        index: 14,
        money: null
    },
    {
        title: '收到其他与投资活动有关的现金',
        index: 15,
        money: null
    },
    {
        title: '现金流入小计',
        index: 16,
        money: null,
        add: [11, 12, 13, 14, 15]
    },
    {
        title: '购建固定资产、无形资产和其他长期资产支付的现金',
        index: 17,
        money: null
    },
    {
        title: '投资支付的现金',
        index: 18,
        money: null
    },
    {
        title: '取得子公司及其他营业单位支付的现金净额',
        index: 19,
        money: null
    },
    {
        title: '支付其他与投资活动有关的现金',
        index: 20,
        money: null
    },
    {
        title: '现金流出小计',
        index: 21,
        money: null,
        add: [17, 18, 19, 20]
    },
    {
        title: '投资活动产生的现金流量净额',
        index: 22,
        money: null,
        add: [16],
        minus: [21]
    },
    {
        title: '三、筹资活动产生的现金流量',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '吸收投资收到的现金',
        index: 23,
        money: null
    },
    {
        title: '取得借款收到的现金',
        index: 24,
        money: null
    },
    {
        title: '收到其他与筹资活动有关的现金',
        index: 25,
        money: null
    },
    {
        title: '现金流入小计',
        index: 26,
        money: null,
        add: [23, 24, 25]
    },
    {
        title: '偿还债务支付的现金',
        index: 27,
        money: null
    },
    {
        title: '分配股利、利润或偿付利息支付的现金',
        index: 28,
        money: null
    },
    {
        title: '支付其他与筹资活动有关的现金',
        index: 29,
        money: null
    },
    {
        title: '现金流出小计',
        index: 30,
        money: null,
        add: [27, 28, 29]
    },
    {
        title: '筹资活动产生的现金流量净额',
        index: 31,
        money: null,
        add: [26],
        minus: [30]
    },
    {
        title: '四、汇率变动对现金及现金等价物的影响',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '现金流入小计',
        index: 32,
        money: null
    },
    {
        title: '现金流出小计',
        index: 33,
        money: null
    },
    {
        title: '汇率变动产生的现金流量净额',
        index: 34,
        money: null,
        add: [32],
        minus: [33]
    },
    {
        title: '五、现金及现金等价物净增加额',
        index: 35,
        money: null,
        add: [10, 22, 31, 34],
        isParent: true
    },
    {
        title: '补充资料:',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '现金流量附表项目',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '1、将净利润调节为经营活动现金流量',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '净利润',
        index: 36,
        money: null
    },
    {
        title: '资产减值准备',
        index: 37,
        money: null
    },
    {
        title: '固定资产折旧、油气资产折耗、生产性生物资产折旧',
        index: 38,
        money: null
    },
    {
        title: '无形资产摊销',
        index: 39,
        money: null
    },
    {
        title: '长期待摊费用摊销',
        index: 40,
        money: null
    },
    {
        title: '处置固定资产、无形资产和其他长期资产的损失',
        index: 41,
        money: null
    },
    {
        title: '固定资产报废损失',
        index: 42,
        money: null
    },
    {
        title: '公允价值变动损失',
        index: 43,
        money: null
    },
    {
        title: '财务费用',
        index: 44,
        money: null
    },
    {
        title: '投资损失',
        index: 45,
        money: null
    },
    {
        title: '递延所得税资产减少',
        index: 46,
        money: null
    },
    {
        title: '递延所得税负债增加',
        index: 47,
        money: null
    },
    {
        title: '存货的减少',
        index: 48,
        money: null
    },
    {
        title: '经营性应收项目的减少',
        index: 49,
        money: null
    },
    {
        title: '经营性应付项目的增加',
        index: 50,
        money: null
    },
    {
        title: '其他',
        index: 51,
        money: null
    },
    {
        title: '经营活动产生的现金流量净额',
        index: 52,
        money: null,
        add: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
    },
    {
        title: '2、不涉及现金收支的重大投资和筹资活动',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '债务转为资本',
        index: 53,
        money: null
    },
    {
        title: '一年内到期的可转换公司债券',
        index: 54,
        money: null
    },
    {
        title: '融资租入固定资产',
        index: 55,
        money: null
    },
    {
        title: '3、现金及现金等价物净变动情况',
        index: null,
        money: null,
        isParent: true
    },
    {
        title: '现金的期末余额',
        index: 56,
        money: null
    },
    {
        title: '减：现金的期初余额',
        index: 57,
        money: null
    },
    {
        title: '加：现金等价物的期末余额',
        index: 58,
        money: null
    },
    {
        title: '减：现金等价物的期初余额',
        index: 59,
        money: null
    },
    {
        title: '现金及现金等价物的净增加额',
        index: 60,
        money: null,
        add: [56, 58],
        minus: [57, 59]
    }
]

module.exports = {
    cashTable
}
