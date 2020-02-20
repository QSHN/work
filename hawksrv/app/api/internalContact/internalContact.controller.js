const errors = require('@lib/errors');
const L = require('debug')('app:api');
const InternalContactType = require('./internalContactType.model');
const InternalContact = require('./internalContact.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    createType,
    queryType,
    updateType,
    create,
    query,
    update,
    deleteFun
};

async function createType(req, res, next) {
    L('Calling API InternalContactType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.type) obj.type = req.body.type
        await InternalContactType.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function queryType(req, res, next) {
    L('Calling API InternalContactType.query');

    try {
        let companyId = req.user.cid;
        let result = await InternalContactType.findOne({companyId: companyId});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateType(req, res, next) {
    L('Calling API InternalContactType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.type) obj.type = req.body.type
        await InternalContactType.updateOne(obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}


async function create(req, res, next) {
    L('Calling API InternalContact.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        obj.companyId = companyId
        obj.creator = req.user.sub
        let apply = await InternalContact.create(obj);
        obj.approver.forEach(v => {
            pushMsg({
                userId: v.uid,
                category: '公司内部联络单',
                content:`亲，您${req.user.sub !== v.uid ? '的下属' : ''}提交了公司内部联络单，请尽快审批`,
                title: "公司内部联络单",
                applyId: apply._id
            });
        })
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function query(req, res, next) {
    L('Calling API InternalContact.query');

    try {
        let filter = {
            companyId: req.user.cid
        }
        if (req.query.id) filter._id = req.query.id
        let result = await InternalContact.find(filter).sort({createdAt: -1});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API InternalContact.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await InternalContact.update({_id, companyId}, obj)
        if ((obj.status == '已审批' || obj.status == '被驳回') && !obj.isReply) {
            pushMsg({
                userId: obj.creator,
                category: '公司内部联络单',
                content: "亲，您提交的公司内部联络单" + (obj.status == '已审批' ? '已审批' : '被驳回， 原因' + obj.approver.reduce((val, v) => val += v.comment, '')),
                title: "公司内部联络单",
                applyId: _id,
            });
            if (obj.status == '已审批') {
                obj.send.forEach(v => {
                    pushMsg({
                        userId: v,
                        category: '公司内部联络单',
                        content: "亲，您收到公司内部联络单，请尽快查看回复",
                        title: "公司内部联络单",
                        applyId: _id,
                    });
                })
            }
        }
        if (obj.isReply) {
            pushMsg({
                userId: obj.creator,
                category: '公司内部联络单',
                content: "亲，您提交的公司内部联络单收到新的回复",
                title: "公司内部联络单",
                applyId: _id,
            });
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function deleteFun(req, res, next) {
    L('Calling API InternalContact.delete', req.params);
    if (!req.params.id) {
        next(new errors.BadRequest('invalid InternalContact id'));
        return;
    }
    try {
        await InternalContact.deleteOne({_id: req.params.id})
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
