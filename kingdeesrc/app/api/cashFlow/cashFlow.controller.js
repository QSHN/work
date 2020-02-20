const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CashFlow = require('./cashFlow.model');
const pushMsg = require('../message/message.controller').pushMsg;
let isInit = null

module.exports = {
    cashUpdate,
    cashQuery,
    cashDelete
};

async function cashUpdate(req, res, next) {
    L('Calling API CashFlow.cashUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CashFlow.updateOne({_id}, { $set: data })
                if (data.audit) {
                    if (data.pFirstId) {
                        await CashFlow.updateMany({
                            _id: data.pFirstId,
                            audit: null
                        }, {$set: {audit: data.audit}})
                    }
                    if (data.pSecondId) {
                        await CashFlow.updateMany({
                            _id: data.pSecondId,
                            audit: null
                        }, {$set: {audit: data.audit}})
                    }
                }
            } else {
                await CashFlow.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function cashQuery(req, res, next) {
    L('Calling API CashFlow.cashQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await CashFlow.find({
                accountSetId: data.accountSetId
            });
            if (isInit !== data.accountSetId && result && result.length === 0) {
                isInit = data.accountSetId
                let c1 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    code: 'CI1',
                    name: '经营活动产生的现金流量',
                    isEdit: false
                })
                let c101 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    code: 'CI1.01',
                    name: '现金流入',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c101._id,
                    code: 'CI1.01.01',
                    name: '销售商品、提供劳务收到的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c101._id,
                    code: 'CI1.01.02',
                    name: '收到的税费返还'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c101._id,
                    code: 'CI1.01.03',
                    name: '收到其他与经营活动有关的现金'
                })
                let c102 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    code: 'CI1.02',
                    name: '现金流出',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c102._id,
                    code: 'CI1.02.01',
                    name: '购买商品、接受劳务支付的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c102._id,
                    code: 'CI1.02.02',
                    name: '支付给职工以及为职工支付的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c102._id,
                    code: 'CI1.02.03',
                    name: '支付的各项税费'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c1._id,
                    pSecondId: c102._id,
                    code: 'CI1.02.04',
                    name: '支付其他与经营活动有关的现金',
                })


                let c2 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    code: 'CI2',
                    name: '投资活动产生的现金流量',
                    isEdit: false
                })
                let c201 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    code: 'CI2.01',
                    name: '现金流入',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c201._id,
                    code: 'CI2.01.01',
                    name: '收回投资收到的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c201._id,
                    code: 'CI2.01.02',
                    name: '取得投资收益收到的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c201._id,
                    code: 'CI2.01.03',
                    name: '处置固定资产、无形资产和其他长期资产收回的现金净额'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c201._id,
                    code: 'CI2.01.04',
                    name: '处置子公司及其他营业单位收到的现金净额'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c201._id,
                    code: 'CI2.01.05',
                    name: '收到其他与投资活动有关的现金'
                })
                let c202 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    code: 'CI2.02',
                    name: '现金流出',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c202._id,
                    code: 'CI2.02.01',
                    name: '购建固定资产、无形资产和其他长期资产支付的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c202._id,
                    code: 'CI2.02.02',
                    name: '投资支付的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c202._id,
                    code: 'CI2.02.03',
                    name: '取得子公司及其他营业单位支付的现金净额'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c2._id,
                    pSecondId: c202._id,
                    code: 'CI2.02.04',
                    name: '支付其他与投资活动有关的现金'
                })


                let c3 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    code: 'CI3',
                    name: '筹资活动产生的现金流量',
                    isEdit: false
                })
                let c301 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    code: 'CI3.01',
                    name: '现金流入',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    pSecondId: c301._id,
                    code: 'CI3.01.01',
                    name: '吸收投资收到的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    pSecondId: c301._id,
                    code: 'CI3.01.02',
                    name: '取得借款收到的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    pSecondId: c301._id,
                    code: 'CI3.01.03',
                    name: '收到其他与筹资活动有关的现金'
                })
                let c302 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    code: 'CI3.02',
                    name: '现金流出',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    pSecondId: c302._id,
                    code: 'CI3.02.01',
                    name: '偿还债务支付的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    pSecondId: c302._id,
                    code: 'CI3.02.02',
                    name: '分配股利、利润或偿付利息支付的现金'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c3._id,
                    pSecondId: c302._id,
                    code: 'CI3.02.03',
                    name: '支付其他与筹资活动有关的现金'
                })


                let c4 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    code: 'CI4',
                    name: '汇率变动产生的现金流量',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c4._id,
                    code: 'CI4.01',
                    name: '现金流入',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c4._id,
                    code: 'CI4.02',
                    name: '现金流出',
                    isEdit: false
                })

                let c5 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    code: 'CI5',
                    name: '现金流量附表项目',
                    isEdit: false
                })
                let c501 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    code: 'CI5.01',
                    name: '将净利润调节为经营活动现金流量',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.01',
                    name: '净利润'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.02',
                    name: '资产减值准备'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.03',
                    name: '固定资产折旧、油气资产折耗、生产性生物资产折旧'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.04',
                    name: '无形资产摊销'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.05',
                    name: '长期待摊费用报销'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.06',
                    name: '处置固定资产、无形资产、和其他长期资产的损失'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.07',
                    name: '固定资产报废损失'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.08',
                    name: '公允价值变动损失'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.09',
                    name: '财务费用'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.10',
                    name: '投资损失'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.11',
                    name: '递延所得税资产减少'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.12',
                    name: '递延所得税负债增加'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.13',
                    name: '存货的减少'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.14',
                    name: '经营性应收项目的减少'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.15',
                    name: '经营性应收项目的增加'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c501._id,
                    code: 'CI5.01.16',
                    name: '其他'
                })
                let c502 = await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    code: 'CI5.02',
                    name: '不涉及现金收支的重大投资和筹资活动',
                    isEdit: false
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c502._id,
                    code: 'CI5.02.01',
                    name: '债务转为资本'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c502._id,
                    code: 'CI5.02.02',
                    name: '一年内到期的可转换公司债券'
                })
                await CashFlow.create({
                    accountSetId: data.accountSetId,
                    pFirstId: c5._id,
                    pSecondId: c502._id,
                    code: 'CI5.02.03',
                    name: '融资租入固定资产'
                })

                result = await CashFlow.find({
                    accountSetId: data.accountSetId
                });
            }
            res.status(200).json(result);
            isInit = null
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function cashDelete(req, res, next) {
    L('Calling API CashFlow.cashDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('现金流量Id必填'));
        } else {
            await CashFlow.deleteOne({ _id: data.id }, (err) => {
                if (err) {
                    next(new errors.BadRequest(err));
                } else {
                    res.status(200).end();
                }
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
