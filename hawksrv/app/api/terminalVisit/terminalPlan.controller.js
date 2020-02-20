const errors = require('@lib/errors');
const L = require('debug')('app:api');
const TerminalPlan = require('./terminalPlan.model');
const TerminalVisit = require('./terminalVisit.model')
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteTerminalPlan
};

async function create(req, res, next) {
    L('Calling API TerminalPlan.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let pData = await TerminalPlan.create(obj);
        await obj.client.forEach(async v => {
            let vData = await TerminalVisit.create({
                companyId: companyId,
                creator: req.user.sub,
                visitor: obj.visitor,
                visitType: '计划拜访',
                status: '待拜访',
                clientId: v._id,
                client: v,
                startTime: obj.planStartTime,
                endTime: obj.planEndTime,
                planId: pData._id
            })
            pushMsg({
                userId: obj.visitor,
                category: '终端拜访',
                content: `亲，您有新的终端拜访任务`,
                title: '终端拜访',
                applyId: obj._id
            });
        })
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API TerminalPlan.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid TerminalPlan id'));
        return;
    }
    try {
        let result = await TerminalPlan.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API TerminalPlan.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.name) filter.name = val.name;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.visitor) filter.visitor = {$in: val.visitor};
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await TerminalPlan.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await TerminalPlan.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API TerminalPlan.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await TerminalPlan.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteTerminalPlan(req, res, next) {
    L('Calling API deleteTerminalPlan.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid TerminalPlan id'));
        return;
    }
    try {
        await TerminalPlan.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
