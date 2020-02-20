const errors = require('@lib/errors');
const L = require('debug')('app:api');
const CompetingGoods = require('./competingGoods.model');
const TerminalVisit = require('../terminalVisit/terminalVisit.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteCompetingGoods
};

async function create(req, res, next) {
    L('Calling API CompetingGoods.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await CompetingGoods.create(obj);
        if (obj.visitId) {
            let vData = await TerminalVisit.findById(obj.visitId);
            vData.task.forEach(v => {
                if (v.name == '竞品上报') v.list.push(apply)
            })
            await TerminalVisit.update({_id: obj.visitId }, vData)
        }
        if (obj.approver) {
            obj.approver.forEach(id => {
                pushMsg({
                    userId: id,
                    category: '竞品上报',
                    content: `亲，您${req.user.sub !== id ? '的下属' : ''}提交了竞品上报`,
                    title: '竞品上报',
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
    L('Calling API CompetingGoods.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CompetingGoods id'));
        return;
    }
    try {
        let result = await CompetingGoods.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API CompetingGoods.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.visitId) filter.visitId = val.visitId;
        if (val.page && val.limit) {
            result = await CompetingGoods.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await CompetingGoods.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API CompetingGoods.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await CompetingGoods.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteCompetingGoods(req, res, next) {
    L('Calling API deleteCompetingGoods.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid CompetingGoods id'));
        return;
    }
    try {
        await CompetingGoods.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
