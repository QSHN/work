const errors = require('@lib/errors');
const L = require('debug')('app:api');

const CommodityPrices = require('./commodityPrices.model');
const CustomerPrices = require('./customerPrices.model');
const StrategyPrices = require('./strategyPrices.model');
const CommodityInfo = require('../commodityInfo/commodityInfo.model');
const PurchaseOrder = require('../purchaseOrder/purchaseOrder.model');
const SalesOrder = require('../salesOrder/salesOrder.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    commodityPricesUpdate,
    commodityPricesQuery,
    customerPricesUpdate,
    customerPricesQuery,
    batchCustomerPrices,
    strategyPricesUpdate,
    strategyPricesQuery,
    commodityPricesHistory
};

async function commodityPricesUpdate(req, res, next) {
    L('Calling API commodityPrices.commodityPricesUpdate', req.body);
    let data = req.body;
    if (!data.accountSetId) {
        next(new errors.BadRequest('账套Id必填'));
    } else if (!data.ids || !data.ids.length) {
        next(new errors.BadRequest('商品ID必填'));
    } else {
        for (let i = 0; i < data.ids.length; i++) {
            if (data.ids[i]._id) {
                await CommodityPrices.updateOne({
                    _id: data.ids[i]._id
                }, {
                    $set: {
                        prices:  data.ids[i].prices
                    }
                })
            } else {
                await CommodityPrices.create({
                    accountSetId: data.accountSetId,
                    commodityId: data.ids[i].commodityId,
                    prices:  data.ids[i].prices
                })
            }
        }
        res.status(200).end();
    }
    try {
        res.status(200).end();
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function commodityPricesQuery(req, res, next) {
    L('Calling API commodityPrices.commodityPricesQuery', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
            next(new errors.BadRequest('分页参数必填'));
        } else {
            let result = await CommodityInfo.find(data.filter).sort({createdAt: -1})
              .limit(parseInt(data.pageInfo.limit))
              .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
            let total = await CommodityInfo.find(data.filter).countDocuments();
            let priceList = await CommodityPrices.find({ commodityId: { $in: result.map(m => m._id) }})
            res.status(200).json({
                total,
                priceList,
                list: result
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function customerPricesUpdate(req, res, next) {
    L('Calling API commodityPrices.customerPricesUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('价格策略代码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('价格策略名字必填'));
        } else if (!data.type) {
            next(new errors.BadRequest('客户分组方式必填'));
        } else if (!data.creator) {
            next(new errors.BadRequest('创建人必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await CustomerPrices.updateOne({_id}, { $set: data })
            } else {
                await CustomerPrices.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function customerPricesQuery(req, res, next) {
    L('Calling API commodityPrices.customerPricesQuery', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
            next(new errors.BadRequest('分页参数必填'));
        } else {
            let result = await CustomerPrices.find(data.filter).sort({createdAt: -1})
              .limit(parseInt(data.pageInfo.limit))
              .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
            let total = await CustomerPrices.find(data.filter).countDocuments();
            res.status(200).json({
                total,
                list: result
            });
        }
        res.status(200).end();
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchCustomerPrices(req, res, next) {
    L('Calling API commodityPrices.batchCustomerPrices', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('客户价格策略Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await CustomerPrices.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                if (data.ids.length > 1) {
                    next(new errors.BadRequest('暂不支持批量修改状态'));
                } else {
                    if (data.action === '启用') {
                        let fData = await CustomerPrices.find({
                            type: '按客户设置',
                            status: '启用'
                        });
                        if (fData.length) {
                            next(new errors.BadRequest('已经存在设置方式为[按客户]的价格策略，不能同时启用多个'));
                        } else {
                            await CustomerPrices.updateOne({_id: {$in: data.ids[0]}}, { $set: {
                                    status: data.action,
                                    startTime: new Date(),
                                    endTime: null
                                }})
                            res.status(200).end();
                        }
                    } else {
                        let fData = await CustomerPrices.findOne({_id: data.ids[0]});
                        if (fData.status === '启用') {
                            await CustomerPrices.updateOne({_id: {$in: data.ids[0]}}, { $set: {
                                    status: '禁用',
                                    endTime: new Date(),
                                    startTime: null
                                }})
                            res.status(200).end();
                        } else {
                            next(new errors.BadRequest('该价格策略已禁用，操作无效'));
                        }
                    }
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function strategyPricesUpdate(req, res, next) {
    L('Calling API commodityPrices.strategyPricesUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data._id) {
            next(new errors.BadRequest('Id必填'));
        } else {
            let _id = data._id
            delete data._id
            await StrategyPrices.updateOne({_id}, { $set: data })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
async function strategyPricesQuery(req, res, next) {
    L('Calling API commodityPrices.strategyPricesQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        }  else {
            let result = await StrategyPrices.findOne(data.filter).sort({createdAt: -1})
            if (!result) {
                result = await StrategyPrices.create({
                    accountSetId: data.accountSetId
                })
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function commodityPricesHistory(req, res, next) {
    L('Calling API commodityPrices.commodityPricesHistory', req.body);

    try {
        let data = req.body;
        if (!data || !data.length) {
            next(new errors.BadRequest('商品Id必填'));
        } else {
            let result = []
            for(let i = 0; i < data.length; i++) {
                let { auxiliary, unit, commodityId } = data[i]
                let commodity = await CommodityPrices.findOne({ commodityId: commodityId })
                let sales = {}
                let purchase = {}
                let price = null
                if (commodity && commodity.prices && commodity.prices.length) {
                   price = commodity.prices.find(f => f.auxiliary === auxiliary && f.unit === unit)
                    if (!price) price = commodity.prices[0]
                }
                if (price) {
                    sales = price.sales
                    purchase = price.purchase
                }
                let purchaseHigh = await PurchaseOrder.findOne({list: {$elemMatch: { commodityId: commodityId, auxiliary: auxiliary, unit: unit}}}).sort({'list.price': -1})
                let purchaseLow = await PurchaseOrder.findOne({list: {$elemMatch: { commodityId: commodityId, auxiliary: auxiliary, unit: unit }}}).sort({'list.price': 1})
                let purchaseLatest = await PurchaseOrder.findOne({list: {$elemMatch: { commodityId: commodityId, auxiliary: auxiliary, unit: unit }}}).sort({createdAt: -1})
                let salesHigh = await SalesOrder.findOne({list: {$elemMatch: { commodityId: commodityId, auxiliary: auxiliary, unit: unit}}}).sort({'list.price': -1})
                let salesLow = await SalesOrder.findOne({list: {$elemMatch: { commodityId: commodityId, auxiliary: auxiliary, unit: unit }}}).sort({'list.price': 1})
                let salesLatest = await SalesOrder.findOne({list: {$elemMatch: { commodityId: commodityId, auxiliary: auxiliary, unit: unit }}}).sort({createdAt: -1})
                result.push({
                    commodityId: commodityId,
                    auxiliary: auxiliary,
                    unit: unit,
                    wholesale: sales.wholesale || 0,
                    retail: sales.retail || 0,
                    cost: sales.cost || 0,
                    purchasing: purchase.purchasing,
                    purchaseHigh: purchaseHigh ? purchaseHigh.list.find(f => f.commodityId.toString() === commodityId).price || 0 : 0,
                    purchaseLow: purchaseLow ? purchaseLow.list.find(f => f.commodityId.toString() === commodityId).price || 0 : 0,
                    purchaseLatest: purchaseLatest ? purchaseLatest.list.find(f => f.commodityId.toString() === commodityId).price || 0 : 0,
                    salesHigh: salesHigh ? salesHigh.list.find(f => f.commodityId.toString() === commodityId).price || 0 : 0,
                    salesLow: salesLow ? salesLow.list.find(f => f.commodityId.toString() === commodityId).price || 0 : 0,
                    salesLatest: salesLatest ? salesLatest.list.find(f => f.commodityId.toString() === commodityId).price || 0 : 0
                })
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
