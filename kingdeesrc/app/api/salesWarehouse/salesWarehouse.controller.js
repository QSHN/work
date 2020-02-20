const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const SalesWarehouse = require('./salesWarehouse.model');
const SalesOrder = require('../salesOrder/salesOrder.model');
const Warehouse = require('../warehouse/warehouse.model');
const ReceivablePayments = require('../receivablePayments/receivablePayments.model');
const NP = require('number-precision');

module.exports = {
    updateSalesWarehouse,
    querySalesWarehouse,
    batchSalesWarehouse,
    parameterSalesWarehouse
};

async function updateSalesWarehouse(req, res, next) {
    L('Calling API SalesWarehouse.updateSalesWarehouse', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('单据编号必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else if (!data.customerId) {
            next(new errors.BadRequest('客户必填'));
        } else {
            let error = ''
            let _id = data._id
            delete data._id
            if (_id) {
                await SalesWarehouse.updateOne({_id}, { $set: data })
            } else {
                let result = await SalesWarehouse.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await SalesWarehouse.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await SalesWarehouse.findOne({
                    code: data.code
                })
                for (let i = 0; i < result.list.length; i++) {
                    let item = result.list[i]
                    let old = data.list[i]
                    if (item.pId) {
                        let order = await SalesOrder.findOne({_id: item.pId})
                        let v = order.list[item.pIndex]._doc
                        let storage = _id ? NP.minus(item.outStorage || 0, old.outStorage || 0) : item.outStorage
                        let reStorage = _id ? NP.minus(item.reStorage || 0, old.reStorage || 0) : item.reStorage
                        order.list[item.pIndex]._doc.outStorage = NP.plus(v.outStorage || 0, storage || 0)
                        order.list[item.pIndex]._doc.unStorage = NP.minus(NP.minus(v.number || 0, v.outStorage), reStorage || 0)
                        if (order.list.filter(f => f.number > f.outStorage).length) {
                            order.storage = '部分出库'
                            if (order.close !== '手动关闭') order.close = '未关闭'
                        } else {
                            order.storage = '全部出库'
                            if (order.close !== '手动关闭') order.close = '已关闭'
                        }
                        await SalesOrder.updateOne({_id: item.pId}, order)
                    }
                    if (item.warehouseId) {
                        let wData = await Warehouse.findOne({_id: item.warehouseId})
                        let fData = wData.inventoryList.find(f =>
                          f.commodityId.toString() === item.commodityId.toString() &&
                          (!item.auxiliary || (f.auxiliary === item.auxiliary)) &&
                          (!item.isBatch || (f.batch && f.batch === item.batch)) &&
                          (!item.isShelfLife || (f.generateDate && new Date(f.generateDate).toHawkDateString() === new Date(item.generateDate).toHawkDateString())) &&
                          (!item.isShelfLife || (f.shelfLifeDays && f.shelfLifeDays === item.shelfLifeDays))
                        )
                        let equation = item.unitList.find(v => v.name === item.unit).equation
                        let oEquation = old.unitList.find(v => v.name === old.unit).equation
                        let number = NP.times(item.outStorage || 0, equation)
                        if (_id) {
                            number = NP.minus(NP.times(item.outStorage || 0, equation), NP.times(old.outStorage || 0, oEquation))
                        }
                        if (fData) {
                            fData.inventory = NP.minus(fData.inventory || 0,  number || 0)
                        } else {
                            wData._doc.inventoryList.push({
                                commodityId: item.commodityId.toString(),
                                auxiliary: item.auxiliary,
                                inventory: number,
                                batch: item.isBatch ? item.batch : null,
                                generateDate: item.isShelfLife ? item.generateDate : null,
                                shelfLifeDays: item.isShelfLife ? item.shelfLifeDays : null
                            })
                        }
                        await Warehouse.updateOne({_id: item.warehouseId}, { $set: { inventoryList: wData.inventoryList }})
                    }
                }
                if (result.offsetList && result.offsetList.length) {
                    for(let i = 0; i < result.offsetList.length; i++) {
                        let order = result.offsetList[i]
                        let obj = {
                            orderId: result._id,
                            orderType: '销售出库单',
                            orderCode: result.code,
                            orderRouter: 'salesWarehouse',
                            orderMoney: order.thisPay
                        }
                        let receivablePayments = await ReceivablePayments.findOne({_id: order.orderId})
                        let list = receivablePayments.main.payList
                        let index = list.findIndex(f => f.orderId === result._id)
                        if (index >= 0) {
                            list[index] = obj
                        } else {
                            list.push(obj)
                        }
                        let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                        let status = total === receivablePayments.main.total ? '全部核销' : '部分核销'
                        await ReceivablePayments.updateOne({
                            _id: order.orderId
                        }, {
                            $set: {
                                'main.payList': list,
                                'main.payTotal': total,
                                status: status
                            }
                        })
                    }
                }
                res.status(200).json({
                    result
                });
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function querySalesWarehouse(req, res, next) {
    L('Calling API SalesWarehouse.querySalesWarehouse', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await SalesWarehouse.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await SalesWarehouse.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await SalesWarehouse.find(data.filter).countDocuments();
                    res.status(200).json({
                        total,
                        list: result
                    });
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchSalesWarehouse(req, res, next) {
    L('Calling API SalesWarehouse.batchSalesWarehouse', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('采购入库单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let result = await SalesWarehouse.find({_id: { $in: data.ids}})
                for (let p = 0; p < result.length; p++) {
                    let pw = result[p]
                    for (let i = 0; i < pw.list.length; i++) {
                        let item = pw.list[i]
                        if (item.pId) {
                            let order = await SalesOrder.findOne({_id: item.pId})
                            let v = order.list[item.pIndex]._doc
                            v.number = NP.plus(v.number || 0, item.outStorage || 0)
                            v.outStorage = NP.minus(v.outStorage || 0, item.outStorage || 0)
                            v.unStorage = NP.minus(NP.minus(v.number || 0, v.outStorage), v.reStorage || 0)
                            if (order.list.filter(f => f.number > f.outStorage).length) {
                                order.storage = '部分入库'
                                if (order.close !== '手动关闭') order.close = '未关闭'
                            } else {
                                order.storage = '全部入库'
                                if (order.close !== '手动关闭') order.close = '已关闭'
                            }
                            await SalesOrder.updateOne({_id: item.pId}, order)
                        }
                        if (item.warehouseId) {
                            let wData = await Warehouse.findOne({_id: item.warehouseId})
                            let fData = wData.inventoryList.find(f =>
                              f.commodityId.toString() === item.commodityId.toString() &&
                              (!item.auxiliary || (f.auxiliary === item.auxiliary)) &&
                              (!item.isBatch || (f.batch && f.batch === item.batch)) &&
                              (!item.isShelfLife || (f.generateDate && new Date(f.generateDate).toHawkDateString() === new Date(item.generateDate).toHawkDateString())) &&
                              (!item.isShelfLife || (f.shelfLifeDays && f.shelfLifeDays === item.shelfLifeDays))
                            )
                            let equation = item.unitList.find(v => v.name === item.unit).equation
                            let outStorage = NP.times(item.outStorage, equation)
                            if (fData) {
                                fData.inventory = NP.plus( fData.inventory || 0, outStorage || 0)
                                await Warehouse.updateOne({_id: item.warehouseId}, { $set: { inventoryList: wData.inventoryList }})
                            }
                        }
                    }

                    if (pw.offsetList && pw.offsetList.length) {
                        for(let i = 0; i < pw.offsetList.length; i++) {
                            let order = pw.offsetList[i]
                            let receivablePayments = await ReceivablePayments.findOne({_id: order.orderId})
                            let list = receivablePayments.main.payList
                            let index = list.findIndex(f => f.orderId === pw._id)
                            list.splice(index, 1)
                            let total = list.reduce((total, v) => (total = NP.plus(total, v.orderMoney)), 0)
                            let status = total === receivablePayments.main.total ? '全部核销' : total === 0 ? '未核销' : '部分核销'
                            await ReceivablePayments.updateOne({
                                _id: order.orderId
                            }, {
                                $set: {
                                    'main.payList': list,
                                    'main.payTotal': total,
                                    status: status
                                }
                            })
                        }
                    }
                }
                await SalesWarehouse.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await SalesWarehouse.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterSalesWarehouse(req, res, next) {
    L('Calling API SalesWarehouse.parameterSalesWarehouse', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await SalesWarehouse.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
