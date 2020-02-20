const errors = require('@lib/errors');
const L = require('debug')('app:api');
const SalesVolume = require('./salesVolume.model');
const TerminalVisit = require('../terminalVisit/terminalVisit.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteSalesVolume
};

async function create(req, res, next) {
    L('Calling API SalesVolume.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await SalesVolume.create(obj);
        if (obj.visitId) {
            let vData = await TerminalVisit.findById(obj.visitId);
            vData.task.forEach(v => {
                if (v.name == '销量上报') v.list.push(apply)
            })
            await TerminalVisit.update({_id: obj.visitId }, vData)
        }
        if (obj.approver) {
            obj.approver.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '销量上报',
                    content: `亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了销量上报，请尽快审批`,
                    title: '销量上报',
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
    L('Calling API SalesVolume.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid SalesVolume id'));
        return;
    }
    try {
        let result = await SalesVolume.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API SalesVolume.query');

    try {
        let filter = {
            companyId: req.user.cid
        };
        const val = req.body
        let result = [];
        if (val.id) filter._id = val.id;
        if (val.name) filter.name = val.name;
        if (val.coding) filter.coding = val.coding;
        if (val.creator) filter.creator = {$in: val.creator};
        if (val.status) filter.status = val.status;
        if (val.visitId) filter.visitId = val.visitId;
        if (val.startTime || val.endTime) {
            let time = {}
            if (val.startTime) time['$gte'] = val.startTime
            if (val.endTime) time['$lte'] = val.endTime
            filter.createdAt = time;
        }
        if (val.page && val.limit) {
            result = await SalesVolume.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await SalesVolume.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API SalesVolume.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await SalesVolume.update({_id, companyId}, obj)
        if (obj.status !== '待审批') {
            pushMsg({
                userId: obj.creator,
                category: "销量上报",
                content: `您的销量上报${obj.status === '已批准' ? '已批准' : '被驳回'}`,
                title: "销量上报审批结果",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteSalesVolume(req, res, next) {
    L('Calling API deleteSalesVolume.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid SalesVolume id'));
        return;
    }
    try {
        await SalesVolume.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
