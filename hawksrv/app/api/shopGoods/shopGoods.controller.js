const errors = require('@lib/errors');
const L = require('debug')('app:api');
const ShopGoods = require('./shopGoods.model');
const TerminalVisit = require('../terminalVisit/terminalVisit.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteShopGoods
};

async function create(req, res, next) {
    L('Calling API ShopGoods.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await ShopGoods.create(obj);
        if (obj.visitId) {
            let vData = await TerminalVisit.findById(obj.visitId);
            vData.task.forEach(v => {
                if (v.name == '铺货上报') v.list.push(apply)
            })
            await TerminalVisit.update({_id: obj.visitId }, vData)
        }
        if (obj.approver) {
            obj.approver.forEach(id => {
                pushMsg({
                    userId: id,
                    category: '铺货上报',
                    content: `亲，您${req.user.sub !== id ? '的下属' : ''}提交了铺货上报`,
                    title: '铺货上报',
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
    L('Calling API ShopGoods.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid ShopGoods id'));
        return;
    }
    try {
        let result = await ShopGoods.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API ShopGoods.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.name) filter.name = val.name;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.visitId) filter.visitId = val.visitId;
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await ShopGoods.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await ShopGoods.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API ShopGoods.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await ShopGoods.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteShopGoods(req, res, next) {
    L('Calling API deleteShopGoods.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid ShopGoods id'));
        return;
    }
    try {
        await ShopGoods.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
