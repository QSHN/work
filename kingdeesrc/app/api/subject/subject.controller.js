const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Subject = require('./subject.model');
const SubjectType = require('./subjectType.model');
const Credentials = require('../credentials/credentials.model');
const pushMsg = require('../message/message.controller').pushMsg;
let isInit = null

module.exports = {
    subjectUpdate,
    subjectQuery,
    subjectDelete,
    subjectSave,
    subjectBatchOperation,
    typeUpdate,
    typeQuery,
    typeDelete
};

/***************** 科目 ***********************/
async function subjectUpdate(req, res, next) {
    L('Calling API Subject.subjectUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('科目编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('科目名称必填'));
        } else if (!data.typeId) {
            next(new errors.BadRequest('科目类别id必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('科目类别必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await Subject.updateOne({_id}, { $set: data })
            } else {
                await Subject.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function subjectQuery(req, res, next) {
    L('Calling API Subject.subjectQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let filter = {
                accountSetId: data.accountSetId
            }
            if (data.subjectCode) {
                filter.code = data.subjectCode
                if (data.subjectCodeEnd) {
                    filter.code = { $gte: data.subjectCode, $lte: data.subjectCodeEnd }
                }
            }
            if (data.subjectDraw) {
                filter.subjectDraw = true
                filter.draw = { $ne: 0 }
            }
            if (data.currency) filter.currency = data.currency
            if (data.profitLoss) {
                let type = await SubjectType.find({
                    accountSetId: data.accountSetId,
                    type: 5
                })
                let tList = type.map(v => v.name)
                filter.type = { $in: tList }
            }
            let result = await Subject.find(filter).sort({code: 1});
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function subjectDelete(req, res, next) {
    L('Calling API Subject.subjectDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('科目Id必填'));
        } else {
            await Subject.deleteOne({ _id: data.id }, (err) => {
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

async function subjectSave(req, res, next) {
    L('Calling API Subject.subjectSave', req.body);

    try {
        let data = req.body;
        if (!data.subjectList) {
            next(new errors.BadRequest('科目列表必填'));
        } else {
            for (let i = 0; i <  data.subjectList.length; i++) {
                let uData = data.subjectList[i]
                await Subject.updateOne({_id: uData._id}, { $set: uData })
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function subjectBatchOperation(req, res, next) {
    L('Calling API Subject.subjectBatchOperation', req.body);

    try {
        let data = req.body;
        if (!data.subjectList) {
            next(new errors.BadRequest('科目列表必填'));
        } else if (!data.action) {
            next(new errors.BadRequest('批量方式必填'));
        } else {
            let updateIds = []
            if (data.action === '删除') {
                let error = ''
                for (let i = 0; i < data.subjectList.length; i++) {
                    let v = data.subjectList[i]
                    let fData = await Credentials.find({
                        child: {
                            $elemMatch: {
                                subjectCode: v.code
                            }
                        }
                    })
                    if (fData.length) {
                        error += (error ? '、' : '') + (v.code + '-' + v.name)
                    } else {
                        updateIds.push(v._id)
                    }
                }
                await Subject.deleteMany({_id: {$in: updateIds}}, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                if (error) {
                    res.status(200).json({
                        error: error ? `以下科目${error}，均已录入凭证，无法删除` : null
                    });
                }
            } else {
                updateIds = data.subjectList.map(f => f._id)
                await Subject.updateMany({_id: { $in: updateIds }}, {$set: { status: data.action }})
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 科目类别 ***********************/
async function typeUpdate(req, res, next) {
    L('Calling API Subject.typeUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('科目类必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await SubjectType.updateOne({_id}, { $set: data })
                await Subject.updateMany({typeId: _id}, {$set: {type: data.name}})
            } else {
                await SubjectType.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function typeQuery(req, res, next) {
    L('Calling API Subject.typeQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await SubjectType.find(data);
            if (isInit !== data.accountSetId && result && result.length === 0) {
                isInit = data.accountSetId
                // 初始化科目类别以及科目
                // 资产 1
                let s101 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 1,
                    code: 101,
                    name: '流动资产'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1001',
                    name: '库存现金',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算',
                    cashAccount: true
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1002',
                    name: '银行存款',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算',
                    subjectBank: true
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1012',
                    name: '其他货币资金',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1101',
                    name: '交易性金融资产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1111',
                    name: '买入返售金融资产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1121',
                    name: '应收票据',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1122',
                    name: '应收账款',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1123',
                    name: '预付账款',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1131',
                    name: '应收股利',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1132',
                    name: '应收利息',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1212',
                    name: '应收分保合同准备金',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1221',
                    name: '其他应收款',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1231',
                    name: '坏账准备',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1302',
                    name: '拆出资金',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1321',
                    name: '代理业务资产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1401',
                    name: '材料采购',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1402',
                    name: '在途物资',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1403',
                    name: '原材料',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1404',
                    name: '材料成本差异',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1405',
                    name: '库存商品',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1406',
                    name: '发出商品',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1407',
                    name: '商品进销差价',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1408',
                    name: '委托加工物资',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1411',
                    name: '周转材料',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1421',
                    name: '消耗性生物资产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1431',
                    name: '贵金属',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1471',
                    name: '存货跌价准备',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1481',
                    name: '持有待售资产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1482',
                    name: '持有待售资产减值准备',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1501',
                    name: '持有至到期投资',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1502',
                    name: '持有至到期投资减值准备',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '贷方',
                    currency: '不核算',
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1503',
                    name: '可供出售金融资产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1504',
                    name: '其他权益工具投资',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1901',
                    name: '待处理财产损益',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1521',
                    name: '投资性房地产',
                    typeId: s101._id,
                    type: s101.name,
                    balance: '借方',
                    currency: '不核算'
                })

                let s102 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 1,
                    code: 102,
                    name: '非流动资产'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1511',
                    name: '长期股权投资',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1512',
                    name: '长期股权投资减值准备',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1531',
                    name: '长期应收款',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1532',
                    name: '未实现融资收益',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1541',
                    name: '存出资本保证金',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算',
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1601',
                    name: '固定资产',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1602',
                    name: '累计折旧',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1603',
                    name: '固定资产减值准备',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1604',
                    name: '在建工程',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1605',
                    name: '工程物资',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1606',
                    name: '固定资产清理',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1701',
                    name: '无形资产',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1702',
                    name: '累计摊销',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1703',
                    name: '无形资产减值准备',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1711',
                    name: '商誉',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1801',
                    name: '长期待摊费用',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '1811',
                    name: '递延所得税资产',
                    typeId: s102._id,
                    type: s102.name,
                    balance: '借方',
                    currency: '不核算'
                })

                // 负债 2
                let s201 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 2,
                    code: 201,
                    name: '流动负债'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2001',
                    name: '短期借款',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2101',
                    name: '交易性金融负债',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2201',
                    name: '应付票据',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2202',
                    name: '应付账款',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2203',
                    name: '预收账款',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2211',
                    name: '应付职工薪酬',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2221',
                    name: '应交税费',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2231',
                    name: '应付利息',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2232',
                    name: '应付股利',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2241',
                    name: '其他应付款',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2245',
                    name: '持有待售负债',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2314',
                    name: '代理业务负债',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2401',
                    name: '递延收益',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算',
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2801',
                    name: '预计负债',
                    typeId: s201._id,
                    type: s201.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                let s202 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 2,
                    code: 202,
                    name: '非流动负债'
                });

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2501',
                    name: '长期借款',
                    typeId: s202._id,
                    type: s202.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2502',
                    name: '长期债券',
                    typeId: s202._id,
                    type: s202.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2701',
                    name: '长期应付款',
                    typeId: s202._id,
                    type: s202.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2702',
                    name: '未确认融资费用',
                    typeId: s202._id,
                    type: s202.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2711',
                    name: '专项应付款',
                    typeId: s202._id,
                    type: s202.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '2901',
                    name: '递延所得税负债',
                    typeId: s202._id,
                    type: s202.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                // 权益 3
                let s300 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 3,
                    code: 300,
                    name: '所有者权益'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4001',
                    name: '实收资本',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4002',
                    name: '资本公积',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4003',
                    name: '其他综合收益',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4101',
                    name: '盈余公积',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4103',
                    name: '本年利润',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算',
                    isNU: false,
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4104',
                    name: '利润分配',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4201',
                    name: '库存股',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                let s4401 = await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4401',
                    name: '其他权益工具',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4401.01',
                    name: '优先股',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算',
                    parentId: [s4401._id]
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4401.02',
                    name: '永续债',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算',
                    parentId: [s4401._id]
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '4401.03',
                    name: '其他',
                    typeId: s300._id,
                    type: s300.name,
                    balance: '贷方',
                    currency: '不核算',
                    parentId: [s4401._id]
                })

                // 成本 4
                let s400 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 4,
                    code: 400,
                    name: '成本'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5001',
                    name: '生产成本',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5101',
                    name: '制造费用',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5201',
                    name: '劳务成本',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5301',
                    name: '研发支出',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5401',
                    name: '工程施工',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5402',
                    name: '工程结算',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '5403',
                    name: '机械作业',
                    typeId: s400._id,
                    type: s400.name,
                    balance: '借方',
                    currency: '不核算'
                })

                // 损益 5
                let s501 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 501,
                    name: '营业收入'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6001',
                    name: '主营业务收入',
                    typeId: s501._id,
                    type: s501.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                let s502 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 502,
                    name: '营业成本及税金'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6401',
                    name: '主营业务成本',
                    typeId: s502._id,
                    type: s502.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6403',
                    name: '营业税金及附加',
                    typeId: s502._id,
                    type: s502.name,
                    balance: '借方',
                    currency: '不核算',
                })

                let s503 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 503,
                    name: '期间费用'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6601',
                    name: '销售费用',
                    typeId: s503._id,
                    type: s503.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6602',
                    name: '管理费用',
                    typeId: s503._id,
                    type: s503.name,
                    balance: '借方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6603',
                    name: '财务费用',
                    typeId: s503._id,
                    type: s503.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6604',
                    name: '勘探费用',
                    typeId: s503._id,
                    type: s503.name,
                    balance: '借方',
                    currency: '不核算',
                })

                let s504 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 504,
                    name: '其他收益'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6051',
                    name: '其他业务收入',
                    typeId: s504._id,
                    type: s504.name,
                    balance: '贷方',
                    currency: '不核算'
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6101',
                    name: '公允价值变动损益',
                    typeId: s504._id,
                    type: s504.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6111',
                    name: '投资收益',
                    typeId: s504._id,
                    type: s504.name,
                    balance: '贷方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6301',
                    name: '营业外收入',
                    typeId: s504._id,
                    type: s504.name,
                    balance: '贷方',
                    currency: '不核算'
                })

                let s505 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 505,
                    name: '其他损失'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6402',
                    name: '其他业务支出',
                    typeId: s505._id,
                    type: s505.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6701',
                    name: '资产减值损失',
                    typeId: s505._id,
                    type: s505.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6702',
                    name: '信用减值损失',
                    typeId: s505._id,
                    type: s505.name,
                    balance: '借方',
                    currency: '不核算'
                })

                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6711',
                    name: '营业外支出',
                    typeId: s505._id,
                    type: s505.name,
                    balance: '借方',
                    currency: '不核算'
                })

                let s506 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 506,
                    name: '以前年度损益调整'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6901',
                    name: '以前年度损益调整',
                    typeId: s506._id,
                    type: s506.name,
                    balance: '贷方',
                    currency: '不核算',
                })

                let s507 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 5,
                    code: 507,
                    name: '所得税'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '6801',
                    name: '所得税费用',
                    typeId: s507._id,
                    type: s507.name,
                    balance: '借方',
                    currency: '不核算'
                })

                // 表外 6
                await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 6,
                    code: 601,
                    name: '表外科目'
                });

                // 共同 7
                let s700 = await SubjectType.create({
                    accountSetId: data.accountSetId,
                    type: 7,
                    code: 700,
                    name: '共同'
                });
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '3101',
                    name: '衍生工具',
                    typeId: s700._id,
                    type: s700.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '3201',
                    name: '套期工具',
                    typeId: s700._id,
                    type: s700.name,
                    balance: '借方',
                    currency: '不核算',
                })
                await Subject.create({
                    accountSetId: data.accountSetId,
                    code: '3202',
                    name: '被套期项目',
                    typeId: s700._id,
                    type: s700.name,
                    balance: '借方',
                    currency: '不核算',
                })

                result = await SubjectType.find(data);
                isInit = null
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function typeDelete(req, res, next) {
    L('Calling API Subject.typeDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('科目类别Id必填'));
        } else {
            await SubjectType.deleteOne({ _id: data.id }, (err) => {
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
