const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const SalesReturn = require('./salesReturn.model');
const Warehouse = require('../warehouse/warehouse.model');
const NP = require('number-precision');

module.exports = {
    updateSalesReturn,
    querySalesReturn,
    batchSalesReturn,
    parameterSalesReturn
};

async function updateSalesReturn(req, res, next) {
    L('Calling API SalesReturn.updateSalesReturn', req.body);

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
                await SalesReturn.updateOne({_id}, { $set: data })
            } else {
                let result = await SalesReturn.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await SalesReturn.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await SalesReturn.findOne({
                    code: data.code
                })
                for (let i = 0; i < result.list.length; i++) {
                    let item = result.list[i]
                    let old = data.list[i]
                    if (item.warehouseId) {
                        let equation = item.unitList.find(v => v.name === item.unit).equation
                        let oEquation = old.unitList.find(v => v.name === old.unit).equation
                        let reStorage = NP.times(item.reStorage, equation)
                        if (_id) {
                            reStorage = NP.minus(NP.times(item.reStorage, equation), NP.times(old.reStorage, oEquation))
                        }

                        let wData = await Warehouse.findOne({_id: item.warehouseId})
                        let fData = wData.inventoryList.find(f =>
                          f.commodityId.toString() === item.commodityId.toString() &&
                          (!item.auxiliary || (f.auxiliary === item.auxiliary)) &&
                          (!item.isBatch || (f.batch && f.batch === item.batch)) &&
                          (!item.isShelfLife || (f.generateDate && new Date(f.generateDate).toHawkDateString() === new Date(item.generateDate).toHawkDateString())) &&
                          (!item.isShelfLife || (f.shelfLifeDays && f.shelfLifeDays === item.shelfLifeDays))
                        )
                        if (fData) {
                            fData.inventory = NP.plus( fData.inventory || 0,  reStorage || 0)
                        }
                        await Warehouse.updateOne({_id: item.warehouseId}, { $set: { inventoryList: wData.inventoryList }})
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

async function querySalesReturn(req, res, next) {
    L('Calling API SalesReturn.querySalesReturn', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await SalesReturn.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await SalesReturn.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await SalesReturn.find(data.filter).countDocuments();
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

async function batchSalesReturn(req, res, next) {
    L('Calling API SalesReturn.batchSalesReturn', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('采购退货单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let result = await SalesReturn.find({_id: { $in: data.ids}})
                for (let p = 0; p < result.length; p++) {
                    let pw = result[p]
                    for (let i = 0; i < pw.list.length; i++) {
                        let item = pw.list[i]
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
                            let reStorage = NP.times(item.reStorage, equation)
                            if (fData) {
                                fData.inventory = NP.minus( fData.inventory || 0, reStorage || 0)
                                await Warehouse.updateOne({_id: item.warehouseId}, { $set: { inventoryList: wData.inventoryList }})
                            }
                        }
                    }
                }
                await SalesReturn.deleteMany({_id: {$in: data.ids}}, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await SalesReturn.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterSalesReturn(req, res, next) {
    L('Calling API SalesReturn.parameterSalesReturn', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await SalesReturn.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
