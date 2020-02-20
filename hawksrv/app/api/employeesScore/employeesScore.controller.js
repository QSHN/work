const errors = require('@lib/errors');
const L = require('debug')('app:api');
const EmployeesScoreType = require('./employeesScoreType.model');
const EmployeesScore = require('./employeesScore.model');
const pushMsg = require('@notification/notification.controller').pushMsg;

module.exports = {
    createType,
    queryType,
    updateType,
    create,
    query,
    update
};

async function createType(req, res, next) {
    L('Calling API EmployeesScoreType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.type) obj.type = req.body.type
        await EmployeesScoreType.create(obj);
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function queryType(req, res, next) {
    L('Calling API EmployeesScoreType.query');

    try {
        let companyId = req.user.cid;
        let result = await EmployeesScoreType.findOne({companyId: companyId});
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function updateType(req, res, next) {
    L('Calling API EmployeesScoreType.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = {companyId: companyId};
        if (req.body && req.body.type) obj.type = req.body.type
        await EmployeesScoreType.updateOne(obj)
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}


async function create(req, res, next) {
    L('Calling API EmployeesScore.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        obj.companyId = companyId
        let apply = await EmployeesScore.create(obj);
        if (obj.pushList) {
            obj.pushList.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '员工评分',
                    content: v.comment,
                    title: "员工评分",
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

async function query(req, res, next) {
    L('Calling API EmployeesScore.query');

    try {
        let filter = {
            companyId: req.user.cid
        }
        if (req.query.id) filter._id = req.query.id
        if (req.query.uId) filter.employeesId = req.query.uId
        let result = await EmployeesScore.findOne(filter);
        res.status(200).json(result);
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}

async function update(req, res, next) {
    L('Calling API EmployeesScore.create', req.body);

    try {
        let companyId = req.user.cid;
        let obj = req.body
        let _id = obj._id
        delete obj._id
        await EmployeesScore.update({_id, companyId}, obj)
        if (obj.pushList) {
            obj.pushList.forEach(v => {
                pushMsg({
                    userId: v.uid,
                    category: '员工评分',
                    content: v.comment,
                    title: "员工评分",
                    applyId: _id
                });
            })
        }
        res.status(200).end();
    } catch (error) {
        L(error);
        next(new errors.BadRequest(error.message));
    }
}
