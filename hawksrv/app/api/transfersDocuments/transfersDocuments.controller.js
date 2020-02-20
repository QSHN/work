const errors = require('@lib/errors');
const L = require('debug')('app:api');
const TransfersDocuments = require('./transfersDocuments.model');
const Warehouse = require('../warehouse/warehouse.model')
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteTransfersDocuments
};

async function create(req, res, next) {
    L('Calling API TransfersDocuments.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await TransfersDocuments.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '调拨单据',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了调拨单据，请尽快审批`,
                    title: '调拨单据',
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
    L('Calling API TransfersDocuments.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid TransfersDocuments id'));
        return;
    }
    try {
        let result = await TransfersDocuments.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API TransfersDocuments.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.warehouseOut) filter.warehouseOut = val.warehouseOut;
        if (val.warehouseIn) filter.warehouseIn = val.warehouseIn;
        if (val.coding) filter.coding = val.coding;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await TransfersDocuments.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await TransfersDocuments.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API TransfersDocuments.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        let commodity = obj.commodity
        delete obj._id
        const changeFun = (isAdd, value) => {
            commodity.forEach(v => {
                let isUpdate = false
                value.commodity.forEach(item => {
                    if (v.commodity._id === item.commodity._id) {
                        isUpdate = true
                        if (isAdd) {
                            item.realNumber = parseInt(item.realNumber) + parseInt(v.number)
                        } else {
                            item.realNumber = parseInt(item.realNumber) - parseInt(v.number)
                        }
                        item.salesNumber = item.realNumber - (item.dropShipping ? parseInt(item.dropShipping) : 0)
                        if (!isAdd) {
                            if (item.realNumber < 0 || item.salesNumber < 0) {
                                throw new Error(`
                                无法从该仓库调拨，目前${item.commodity.name}
                                库存：${parseInt(item.realNumber) + parseInt(v.number)}，
                                待发货数量：${item.dropShipping || 0}，
                                调货数量：${v.number}`);
                            }
                        }
                    }
                })
                if (!isUpdate && isAdd) {
                    value.commodity.push({
                        commodity: v.commodity,
                        realNumber: v.number,
                        dropShipping: 0,
                        salesNumber: v.number
                    })
                }
            })
        }
        if (obj.status === '已审批') {
            let wData = await Warehouse.findOne({ companyId })
            wData.warehouse.forEach(v => {
                if (v.name == obj.warehouseOut) {
                    changeFun(false, v)
                }
                if (v.name == obj.warehouseIn) {
                    changeFun(true, v)
                }
            })
            wData.save();
        }
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "调拨单据",
                content: `您的调拨单据${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "调拨单据审批结果",
                applyId: _id,
            });
        }
        await TransfersDocuments.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteTransfersDocuments(req, res, next) {
    L('Calling API deleteTransfersDocuments.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid TransfersDocuments id'));
        return;
    }
    try {
        await TransfersDocuments.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
