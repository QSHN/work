const errors = require('@lib/errors');
const L = require('debug')('app:api');
const ImageAcquisition = require('./imageAcquisition.model');
const TerminalPicType = require('./terminalPicType.model');
const TerminalVisit = require('../terminalVisit/terminalVisit.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    getById,
    create,
    query,
    update,
    deleteImageAcquisition,
    getType,
    createType,
    updateType
};

async function create(req, res, next) {
    L('Calling API ImageAcquisition.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        obj.creator = req.user.sub;
        let apply = await ImageAcquisition.create(obj);
        if (obj.visitId) {
            let vData = await TerminalVisit.findById(obj.visitId);
            vData.task.forEach(v => {
                if (v.name == '终端形象采集') v.list.push(apply)
            })
            await TerminalVisit.update({_id: obj.visitId }, vData)
        }
        if (obj.approver) {
            obj.approver.forEach(id => {
                pushMsg({
                    userId: id,
                    category: '终端形象采集',
                    content: `亲，您${req.user.sub !== id ? '的下属' : ''}提交了终端形象采集`,
                    title: '终端形象采集',
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
    L('Calling API ImageAcquisition.getById', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid ImageAcquisition id'));
        return;
    }
    try {
        let result = await ImageAcquisition.findById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API ImageAcquisition.query');

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
            result = await ImageAcquisition.find(filter).sort({createdAt: -1})
                .limit(parseInt(val.limit))
                .skip(val.limit * (val.page - 1));
        } else {
            result = await ImageAcquisition.find(filter);
        }
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API ImageAcquisition.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await ImageAcquisition.update({_id, companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteImageAcquisition(req, res, next) {
    L('Calling API deleteImageAcquisition.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid ImageAcquisition id'));
        return;
    }
    try {
        await ImageAcquisition.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}


async function getType(req, res, next) {
    L('Calling API TerminalPicType.getType');

    try {
        let filter = {
            companyId: req.user.cid
        };
        let result = await TerminalPicType.find(filter);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function createType(req, res, next) {
    L('Calling API TerminalPicType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body;
        obj.companyId = companyId;
        let apply = await TerminalPicType.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateType(req, res, next) {
    L('Calling API TerminalPicType.updateType', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        await TerminalPicType.update({companyId}, obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
