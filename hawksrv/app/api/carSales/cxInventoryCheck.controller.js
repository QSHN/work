const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CxInventoryCheck = require('./cxInventoryCheck.model');
const CxInventory = require('./cxInventory.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteInventoryCheck
};

async function create(req, res, next) {
    L('Calling API CxInventoryCheck.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await CxInventoryCheck.create(obj);
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '车载库存盘点',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了车载库存盘点，请尽快审批`,
                    title: '车载库存盘点',
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
    L('Calling API CxInventoryCheck.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxInventoryCheck id'));
        return;
    }
    try {
        let result = await CxInventoryCheck.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CxInventoryCheck.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.status) filter.status = val.status;
        if (val.numberPlate) filter.numberPlate = val.numberPlate;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await CxInventoryCheck.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await CxInventoryCheck.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CxInventoryCheck.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        if (obj.status === '已审批') {
            let commodity = obj.commodity
            let iData = await CxInventory.findOne({ companyId })
            iData.inventory.forEach(v => {
                if (v.numberPlate == obj.numberPlate) {
                    commodity.forEach(v1 => {
                        let isUpdate = false
                        v.commodity.forEach(v2 => {
                            if (v1.commodity._id === v2.commodity._id) {
                                isUpdate = true
                                v2.realNumber = parseInt(v1.number)
                            }
                        })
                        if (!isUpdate) {
                            throw new Error(`在车上找不到该商品，无法盘点`);
                        }
                    })
                }
            })
            iData.save();
        }
        await CxInventoryCheck.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "车载库存盘点",
                content: `您的车载库存盘点${obj.status === '已审批' ? '已审批' : '被驳回'}`,
                title: "车载库存盘点审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteInventoryCheck(req, res, next) {
    L('Calling API deleteCxInventoryCheck.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CxInventoryCheck id'));
        return;
    }
    try {
        await CxInventoryCheck.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
