const errors = require('@lib/errors');
const L = require('debug')('app:api');
const SalesOrder = require('./salesOrder.model');
const Warehouse = require('../warehouse/warehouse.model')
const TerminalVisit = require('../terminalVisit/terminalVisit.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteSalesOrder
};

async function create(req, res, next) {
    L('Calling API SalesOrder.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await SalesOrder.create(obj);
        if (obj.visitId) {
            let vData = await TerminalVisit.findById(obj.visitId);
            vData.task.forEach(v => {
                if (v.name == '订单上报') v.list.push(apply)
            })
            await TerminalVisit.update({_id: obj.visitId }, vData)
        }
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '销售订单',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了销售订单，请尽快审批`,
                    title: '销售订单',
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
    L('Calling API SalesOrder.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid SalesOrder id'));
        return;
    }
    try {
        let result = await SalesOrder.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API SalesOrder.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.name) filter.name = val.name;
        if (val.coding) filter.coding = val.coding;
        if (val.warehouse) filter.warehouse = val.warehouse;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.visitId) filter.visitId = val.visitId;
        if (val.shippingStatus !== undefined) filter.shippingStatus = val.shippingStatus;
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.shippingStartTime || val.shippingEndTime) {
            let time = {}
            if (val.shippingStartTime) time['$gte'] = val.shippingStartTime
            if (val.shippingEndTime) time['$lte'] = val.shippingEndTime
            filter.time = time;
        }
        if (val.page && val.limit) {
            result = await SalesOrder.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await SalesOrder.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API SalesOrder.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批' || obj.shippingStatus) {
            let commodity = obj.commodity
            let wData = await Warehouse.findOne({ companyId })
            wData.warehouse.forEach(v => {
                if (v.name == obj.warehouse) {
                    commodity.forEach(v1 => {
                        let isUpdate = false
                        let number = parseInt(v1.number) + (v1.giveNumber ? parseInt(v1.giveNumber) : 0)
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                isUpdate = true
                                if (obj.shippingStatus) {
                                    if (parseInt(v2.realNumber) < number) {
                                        throw new Error(`库存不足，无法发货，目前${v2.commodity.name}库存：${v2.realNumber}，发货数量：${number}`);
                                    } else {
                                        v2.realNumber = parseInt(v2.realNumber) - number
                                        v2.dropShipping = parseInt(v2.dropShipping) - number
                                    }
                                } else {
                                    v2.dropShipping = (v2.dropShipping ? parseInt(v2.dropShipping) : 0) + number
                                }
                                v2.salesNumber = parseInt(v2.realNumber) - parseInt(v2.dropShipping)
                            }
                        })
                        if (!isUpdate) {
                            v.commodity.push({
                                commodity: v1.commodity,
                                dropShipping: number
                            })
                        }
                    })
                }
            })
            wData.save();
        }
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "销售订单",
                content: `您的销售订单${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "销售订单审批结果",
                applyId: _id,
            });
        }
        await SalesOrder.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteSalesOrder(req, res, next) {
    L('Calling API deleteSalesOrder.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid SalesOrder id'));
        return;
    }
    try {
        await SalesOrder.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
