const errors = require('@lib/errors');
const L = require('debug')('app:api');
const TerminalVisit = require('./terminalVisit.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteTerminalVisit
};

async function create(req, res, next) {
    L('Calling API TerminalVisit.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await TerminalVisit.create(obj);
        pushMsg({
            userId: obj.visitor,
            category: '终端拜访',
            content: `亲，您有新的终端拜访任务`,
            title: '终端拜访',
            applyId: apply._id
        });
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
async function getById(req, res, next) {
    L('Calling API TerminalVisit.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid TerminalVisit id'));
        return;
    }
    try {
        let result = await TerminalVisit.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API TerminalVisit.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.planId) filter.planId = val.planId;
        if (val.status) filter.status = val.status;
        if (val.visitType) filter.visitType = val.visitType;
        if (val.clientId) filter.clientId = val.clientId;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.visitor) filter.visitor = {$in: val.visitor};
        if (val.startTime || val.endTime) {
            if (val.startTime) filter.startTime = {$gte: val.startTime};
            if (val.endTime) filter.endTime = {$lte: val.endTime};
        }
        if (val.time) {
            filter['$or'] = [
                {startTime: ''},
                {endTime: ''},
                {endTime: {$gte: val.time}}
            ];
        }
        if (val.page && val.limit) {
            result = await TerminalVisit.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await TerminalVisit.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API TerminalVisit.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await TerminalVisit.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteTerminalVisit(req, res, next) {
    L('Calling API deleteTerminalVisit.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid TerminalVisit id'));
        return;
    }
    try {
        await TerminalVisit.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
