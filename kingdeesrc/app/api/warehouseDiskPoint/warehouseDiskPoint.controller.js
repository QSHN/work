const errors = require('@lib/errors');
const L = require('debug')('app:api');
const pushMsg = require('../message/message.controller').pushMsg;

const WarehouseDiskPoint = require('./warehouseDiskPoint.model');
const WarehouseDiskSurplus = require('../warehouseDiskSurplus/warehouseDiskSurplus.model');
const WarehouseDiskDeficient = require('../warehouseDiskDeficient/warehouseDiskDeficient.model');
const Warehouse = require('../warehouse/warehouse.model');
const NP = require('number-precision');

module.exports = {
    updateWarehouseDiskPoint,
    queryWarehouseDiskPoint,
    batchWarehouseDiskPoint,
    parameterWarehouseDiskPoint
};

async function updateWarehouseDiskPoint(req, res, next) {
    L('Calling API WarehouseDiskPoint.updateWarehouseDiskPoint', req.body);

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
                await WarehouseDiskPoint.updateOne({_id}, { $set: data })
            } else {
                let result = await WarehouseDiskPoint.findOne({
                    code: data.code
                })
                if (result) {
                    error = '已存在该单据编号'
                } else {
                    await WarehouseDiskPoint.create(data)
                }
            }
            if (error) {
                next('已存在该单据编号');
            } else {
                let result = await WarehouseDiskPoint.findOne({
                    code: data.code
                })
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

async function queryWarehouseDiskPoint(req, res, next) {
    L('Calling API WarehouseDiskPoint.queryWarehouseDiskPoint', req.body);

    try {
        let data = req.body;
        if (!data.filter || !data.filter.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            if (data.isOne) {
                let result = await WarehouseDiskPoint.findOne(data.filter).sort({createdAt: -1})
                res.status(200).json(result);
            } else {
                if (!data.pageInfo || !data.pageInfo.page || !data.pageInfo.limit) {
                    next(new errors.BadRequest('分页参数必填'));
                } else {
                    let result = await WarehouseDiskPoint.find(data.filter).sort({createdAt: -1})
                      .limit(parseInt(data.pageInfo.limit))
                      .skip(data.pageInfo.limit * (data.pageInfo.page - 1));
                    let total = await WarehouseDiskPoint.find(data.filter).countDocuments();
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

async function batchWarehouseDiskPoint(req, res, next) {
    L('Calling API WarehouseDiskPoint.batchWarehouseDiskPoint', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('盘点单Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await WarehouseDiskPoint.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else if (data.action === '盈亏处理') {
               for (let i = 0; i < data.ids.length; i++) {
                   let id = data.ids[i]
                   let point = await WarehouseDiskPoint.findOne({_id: id})
                   if (point) {
                       let wData = await Warehouse.findOne({_id: point.warehouseId})
                       let surplus = []
                       let deficient = []
                       point.list.forEach(f => {
                           let fData = wData.inventoryList.find(w =>
                             w.commodityId.toString() === f.commodityId.toString() &&
                             (!f.auxiliary || (w.auxiliary === f.auxiliary)) &&
                             (!f.isBatch || (w.batch && w.batch === f.batch)) &&
                             (!f.isShelfLife || (w.generateDate && new Date(w.generateDate).toHawkDateString() === new Date(f.generateDate).toHawkDateString())) &&
                             (!f.isShelfLife || (w.shelfLifeDays && w.shelfLifeDays === f.shelfLifeDays))
                           )
                           let equation = f.unitList.find(v => v.name === f.unit).equation
                           if (f.number > f.inventory) {
                               let number = NP.minus(f.number, f.inventory)
                               surplus.push({
                                   commodityId: f.commodityId,
                                   code: f.code,
                                   name: f.name,
                                   warehouseId: point.warehouseId,
                                   inventory: f.inventory,
                                   unit: f.unit,
                                   unitList: f.unitList,
                                   groupId: f.groupId,
                                   auxiliary: f.auxiliary,
                                   number: number,
                                   unitDelivery: null,
                                   deliveryCost: null,
                                   commodityDes: f.commodityDes
                               })
                               let inventory = NP.times(number, equation)
                               if (fData) {
                                   fData.inventory = NP.plus(fData.inventory || 0,  inventory || 0)
                               } else {
                                   wData._doc.inventoryList.push({
                                       commodityId: f.commodityId.toString(),
                                       auxiliary: f.auxiliary,
                                       inventory: inventory,
                                       batch: item.isBatch ? item.batch : null,
                                       generateDate: item.isShelfLife ? item.generateDate : null,
                                       shelfLifeDays: item.isShelfLife ? item.shelfLifeDays : null
                                   })
                               }
                           }
                           if (f.number < f.inventory) {
                               let number = NP.minus(f.inventory, f.number)
                               deficient.push({
                                   commodityId: f.commodityId,
                                   code: f.code,
                                   name: f.name,
                                   warehouseId: point.warehouseId,
                                   inventory: f.inventory,
                                   unit: f.unit,
                                   unitList: f.unitList,
                                   groupId: f.groupId,
                                   auxiliary: f.auxiliary,
                                   number: number,
                                   unitDelivery: null,
                                   deliveryCost: null,
                                   commodityDes: f.commodityDes
                               })
                               let inventory = NP.times(number, equation)
                               if (fData) {
                                   fData.inventory = NP.minus(fData.inventory || 0,  inventory || 0)
                               } else {
                                   wData._doc.inventoryList.push({
                                       commodityId: f.commodityId.toString(),
                                       auxiliary: f.auxiliary,
                                       inventory: NP.minus(0, inventory || 0),
                                       batch: item.isBatch ? item.batch : null,
                                       generateDate: item.isShelfLife ? item.generateDate : null,
                                       shelfLifeDays: item.isShelfLife ? item.shelfLifeDays : null
                                   })
                               }
                           }
                       })
                       let time = new Date().toHawkDateString()
                       let sData = null
                       let dData = null
                       if (surplus.length) {
                            let total = await WarehouseDiskSurplus.find({
                                accountSetId: point.accountSetId,
                                dateTime: {
                                    $gte: new Date(time + ' 00:00:00'),
                                    $lte: new Date(time + ' 23:59:59.999')
                                }
                            }).countDocuments();
                           let pad = '0000'
                           total = pad.substring(0, pad.length - total.toString().length) + total
                            let obj = {
                                accountSetId: point.accountSetId,
                                code: `PYD-${time.split('-').join('')}-${total}`,
                                dateTime: new Date(),
                                list: surplus,
                                audit: '未审核',
                                creator: req.user.sub,
                                editor: null,
                                auditor: null,
                                custom: null
                            }
                            sData = await WarehouseDiskSurplus.create(obj)
                       }
                       if (deficient.length) {
                           let total = await WarehouseDiskDeficient.find({
                               accountSetId: point.accountSetId,
                               dateTime: {
                                   $gte: new Date(time + ' 00:00:00'),
                                   $lte: new Date(time+ ' 23:59:59.999')
                               }
                           }).countDocuments();
                           let pad = '0000'
                           total = pad.substring(0, pad.length - total.toString().length) + total
                           let obj = {
                               accountSetId: point.accountSetId,
                               code: `PKD-${time.split('-').join('')}-${total}`,
                               dateTime: new Date(),
                               list: surplus,
                               audit: '未审核',
                               creator: req.user.sub,
                               editor: null,
                               auditor: null,
                               custom: null
                           }
                           dData = await WarehouseDiskDeficient.create(obj)
                       }
                       await Warehouse.updateOne({_id: point.warehouseId}, { $set: { inventoryList: wData.inventoryList }})
                       await WarehouseDiskPoint.updateMany({_id: id}, {
                           $set: {
                               pointTime: new Date(),
                               result: '已盘点',
                               clerkId: req.user.sub,
                               deficientId: dData ? dData._id : null,
                               deficientCode: dData ? dData.code : null,
                               surplusId: sData ? sData._id : null,
                               surplusCode: sData ? sData.code : null
                           }
                       })
                   }
               }
               res.status(200).end();
            } else {
                await WarehouseDiskPoint.updateMany({_id: {$in: data.ids}}, { $set: data.action })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function parameterWarehouseDiskPoint(req, res, next) {
    L('Calling API WarehouseDiskPoint.parameterWarehouseDiskPoint', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.dateTime) {
            next(new errors.BadRequest('单据日期必填'));
        } else {
            let total = await WarehouseDiskPoint.find(data).countDocuments();
            res.status(200).json({
                total
            });
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
