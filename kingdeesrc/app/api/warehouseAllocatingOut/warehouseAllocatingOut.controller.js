const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const WarehouseAllocatingOut = require('./warehouseAllocatingOut.model');
const WarehouseAllocatingIn = require('../warehouseAllocatingIn/warehouseAllocatingIn.model');
const Warehouse = require('../warehouse/warehouse.model');
const NP = require('number-precision');

module.exports = {
    updateWarehouseAllocatingOut,
    queryWarehouseAllocatingOut,
    batchWarehouseAllocatingOut,
    parameterWarehouseAllocatingOut,
    warehouseAllocatingDiff
};

async function updateWarehouseAllocatingOut(req, res, next) {
    L('Calling API WarehouseAllocatingOut.updateWarehouseAllocatingOut', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('单据编号必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let error = ''
            let _id = data._id
            delete data._id
            if (_id) {
                await WarehouseAllocatingOut.updateOne({_id}, { $set: data })
            } else {
                let result = await WarehouseAllocatingOut.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await WarehouseAllocatingOut.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await WarehouseAllocatingOut.findOne({
                    code: data.code
                })
                for (let i = 0; i < result.list.length; i++) {
                    let item = result.list[i]
                    let old = data.list[i]
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
                        let number = NP.times(item.number, equation)
                        if (_id) {
                            number = NP.minus(NP.times(item.number, equation), NP.times(old.number, oEquation))
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

async function queryWarehouseAllocatingOut(req, res, next) {
    L('Calling API WarehouseAllocatingOut.queryWarehouseAllocatingOut', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await WarehouseAllocatingOut.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await WarehouseAllocatingOut.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await WarehouseAllocatingOut.find(data.filter).countDocuments();
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

async function batchWarehouseAllocatingOut(req, res, next) {
    L('Calling API WarehouseAllocatingOut.batchWarehouseAllocatingOut', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('调拨出库单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                let result = await WarehouseAllocatingOut.find({_id: { $in: data.ids}})
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
                            if (fData) {
                                let number = item.number
                                let equation = item.unitList.find(v => v.name === item.unit).equation
                                number = NP.times(number, equation)
                                fData.inventory = NP.plus( fData.inventory || 0, number)
                                await Warehouse.updateOne({_id: item.warehouseId}, { $set: { inventoryList: wData.inventoryList }})
                            }
                        }
                    }
                }
                await WarehouseAllocatingOut.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await WarehouseAllocatingOut.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterWarehouseAllocatingOut(req, res, next) {
    L('Calling API WarehouseAllocatingOut.parameterWarehouseAllocatingOut', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await WarehouseAllocatingOut.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function warehouseAllocatingDiff(req, res, next) {
    L('Calling API WarehouseAllocatingOut.warehouseAllocatingDiff', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                next(new errors.BadRequest('分页参数必填'));
            } else {
                let result = await WarehouseAllocatingOut.find(data.filter).sort({createdAt: -1})
                  .limit(parseInt(data.pageInfo.limit))
                  .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                let total = await WarehouseAllocatingOut.find(data.filter).countDocuments();
                let inList = await WarehouseAllocatingIn.find({
                    list: {
                        $elemMatch: {
                            pId: { $in: result.map(m => m._id) }
                        }
                    }
                }).sort({createdAt: -1})
                res.status(200).json({
                    total,
                    inList,
                    list: result
                });
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
