const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CxBack = require('./cxBack.model');
const CxInventory = require('./cxInventory.model');
const Warehouse = require('../warehouse/warehouse.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    query,
    getById,
    create,
    update,
    deleteBack
};

async function create(req, res, next) {
    L('Calling API CxBack.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await CxBack.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '回库申请',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了回库申请，请尽快审批`,
                    title: '回库申请',
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
    L('Calling API CxBack.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxBack id'));
        return;
    }
    try {
        let result = await CxBack.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CxBack.query');

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
            result = await CxBack.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await CxBack.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CxBack.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批') {
            let commodity = obj.commodity
            let inventoryData = await CxInventory.findOne({ companyId })
            let wData = await Warehouse.findOne({ companyId })
            let billObj = {}
            inventoryData.inventory.forEach(v => {
                if (v.numberPlate == obj.numberPlate) {
                    commodity.forEach(v1 => {
                        let isUpdate = false
                        let number = parseInt(v1.number)
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                isUpdate = true
                                if (parseInt(v2.realNumber) < number) {
                                    throw new Error(`该商品车载库存${v2.realNumber}, 归还：${number}，申请归还数大于车载库存，无法回库`);
                                }
                                v2.realNumber = parseInt(v2.realNumber) - number
                                if (obj.backType === 'return') {
                                    v2.returnNumber =  parseInt(v2.returnNumber) - number
                                } else if (obj.backType === 'swap') {
                                    v2.swapNumber =  parseInt(v2.swapNumber) - number
                                }
                                billObj[v2.commodity._id] = v2.realNumber
                            }
                        })
                        if (!isUpdate) {
                            throw new Error(`在车上找不到该商品，无法回库`);
                        }
                    })
                }
            })
            inventoryData.save();
            wData.warehouse.forEach(v => {
                if (v.name == obj.warehouse) {
                    commodity.forEach(v1 => {
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                v2.realNumber = parseInt(v2.realNumber) + parseInt(v1.number)
                                v2.billNumber = billObj[v2.commodity._id]
                            }
                        })
                    })
                }
            })
            wData.save()
        }
        await CxBack.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "回库申请",
                content: `您的回库申请${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "回库申请审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteBack(req, res, next) {
    L('Calling API deleteCxBack.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxBack id'));
        return;
    }
    try {
        await CxBack.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
