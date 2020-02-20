const errors = require('@lib/errors');
const L = require('debug')('app:api');
const InventoryVerification = require('./inventoryVerification.model');
const Warehouse = require('../warehouse/warehouse.model')
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteInventoryVerification
};

async function create(req, res, next) {
    L('Calling API InventoryVerification.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await InventoryVerification.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '库存盘点',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了库存盘点，请尽快审批`,
                    title: '库存盘点',
                    applyId: apply._id
                });
            })
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API InventoryVerification.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid InventoryVerification id'));
        return;
    }
    try {
        let result = await InventoryVerification.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API InventoryVerification.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.warehouse) filter.warehouse = val.warehouse;
        if (val.coding) filter.coding = val.coding;
        if (val.operator) filter.operator = val.operator;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await InventoryVerification.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await InventoryVerification.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API InventoryVerification.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已入账') {
            let commodity = obj.commodity
            let wData = await Warehouse.findOne({ companyId })
            wData.warehouse.forEach(v => {
                if (v.name == obj.warehouse) {
                    commodity.forEach(v1 => {
                        let isUpdate = false
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                isUpdate = true
                                v2.realNumber = v1.number
                            }
                        })
                        if (!isUpdate) {
                            v.commodity.push({
                                commodity: v1.commodity,
                                realNumber: v1.number
                            })
                        }
                    })
                }
            })
            wData.save();
        }
        await InventoryVerification.update({_id, companyId}, obj)
        if (obj.status === '已入账' || obj.status === '被驳回') {
            pushMsg({
                userId: obj.creator,
                category: "库存盘点",
                content: `您的库存盘点${obj.status === '已入账' ? '已入账' : '被驳回'}`,
                title: "库存盘点审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteInventoryVerification(req, res, next) {
    L('Calling API deleteInventoryVerification.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid InventoryVerification id'));
        return;
    }
    try {
        await InventoryVerification.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
