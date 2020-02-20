const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CxBill = require('./cxBill.model');
const CxInventory = require('./cxInventory.model');
const Warehouse = require('../warehouse/warehouse.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    query,
    getById,
    create,
    update,
    deleteBill
};

async function create(req, res, next) {
    L('Calling API CxBill.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await CxBill.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '提货申请',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了提货申请，请尽快审批`,
                    title: '提货申请',
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
    L('Calling API CxBill.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxBill id'));
        return;
    }
    try {
        let result = await CxBill.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CxBill.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.numberPlate) filter.numberPlate = val.numberPlate;
        if (val.warehouse) filter.warehouse = val.warehouse;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await CxBill.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await CxBill.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CxBill.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批') {
            let commodity = obj.commodity
            let inventoryData = await CxInventory.findOne({ companyId })
            let wData = await Warehouse.findOne({ companyId })
            if (inventoryData) {
                inventoryData.inventory.forEach(v => {
                    if (v.numberPlate == obj.numberPlate) {
                        commodity.forEach(v1 => {
                            let isUpdate = false
                            let number = parseInt(v1.number)
                            v.commodity.forEach(v2 => {
                                if (v1.commodity._id === v2.commodity._id) {
                                    isUpdate = true
                                    v2.realNumber = parseInt(v2.realNumber) + number
                                }
                            })
                            if (!isUpdate) {
                                v.commodity.push({
                                    commodity: v1.commodity,
                                    realNumber: number,
                                    salesNumber: 0,
                                    returnNumber: 0,
                                    swapNumber: 0
                                })
                            }
                        })
                    }
                })
                inventoryData.save();
            } else {
                let clist = []
                commodity.forEach(v1 => {
                    let number = parseInt(v1.number)
                    clist.push({
                        commodity: v1.commodity,
                        realNumber: number,
                        salesNumber: 0,
                        returnNumber: 0,
                        swapNumber: 0
                    })
                });
                let cData = {
                    companyId: companyId,
                    inventory: [{
                        numberPlate: obj.numberPlate,
                        commodity: clist
                    }]
                }
                await CxInventory.create(cData);
            }
            wData.warehouse.forEach(v => {
                if (v.name == obj.warehouse) {
                    commodity.forEach(v1 => {
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                v2.realNumber = parseInt(v2.realNumber) - v1.number
                                v2.billNumber = (v2.billNumber ? parseInt(v2.billNumber) : 0) + v1.number
                            }
                        })
                    })
                }
            })
            wData.save()
        }
        await CxBill.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "提货申请",
                content: `您的提货申请${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "提货申请审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteBill(req, res, next) {
    L('Calling API deleteCxBill.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxBill id'));
        return;
    }
    try {
        await CxBill.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
