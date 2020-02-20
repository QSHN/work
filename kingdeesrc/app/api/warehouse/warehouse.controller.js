const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Warehouse = require('./warehouse.model');
const WarehouseGroup = require('./warehouseGroup.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    warehouseUpdate,
    warehouseQuery,
    batchWarehouse,
    warehouseGroupUpdate,
    warehouseGroupQuery,
    warehouseGroupDelete
};

/***************** 供应商 ***********************/
async function warehouseUpdate(req, res, next) {
    L('Calling API Warehouse.warehouseUpdate', req.body);

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
                await Warehouse.updateOne({_id}, { $set: data })
            } else {
                await Warehouse.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function warehouseQuery(req, res, next) {
    L('Calling API Warehouse.warehouseQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Warehouse.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchWarehouse(req, res, next) {
    L('Calling API Warehouse.batchWarehouse', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('供应商Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await Warehouse.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await Warehouse.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

/***************** 供应商组 ***********************/
async function warehouseGroupUpdate(req, res, next) {
    L('Calling API Warehouse.warehouseGroupUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await WarehouseGroup.updateOne({_id}, { $set: data })
            } else {
                await WarehouseGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function warehouseGroupQuery(req, res, next) {
    L('Calling API Warehouse.warehouseGroupQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await WarehouseGroup.find(data);
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function warehouseGroupDelete(req, res, next) {
    L('Calling API Warehouse.warehouseGroupDelete', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('供应商组Id必填'));
        } else {
            await WarehouseGroup.deleteOne({ _id: data.id }, (err) => {
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
