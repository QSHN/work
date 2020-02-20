const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Department = require('./department.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    departmentUpdate,
    departmentQuery,
    deleteDepartment,
    batchDepartment,
    departmentUpdateSubject
};

async function departmentUpdate(req, res, next) {
    L('Calling API Department.departmentUpdate', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('编码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await Department.updateOne({_id}, { $set: data })
            } else {
                await Department.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function departmentQuery(req, res, next) {
    L('Calling API Department.departmentQuery', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await Department.find({
                accountSetId: data.accountSetId
            });
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteDepartment(req, res, next) {
    L('Calling API Department.deleteDepartment', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('部门Id必填'));
        } else {
            await Department.deleteOne({ _id: {$in: data.id} }, (err) => {
                if (err) {
                    next(new errors.BadRequest(err));
                } else {
                    res.status(200).end();
                }
            })
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function batchDepartment(req, res, next) {
    L('Calling API Department.batchDepartment', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('部门Ids必填'));
        } else  if (!data.action) {
            next(new errors.BadRequest('批量操作必填'));
        } else {
            if (data.action === '删除') {
                await Department.deleteMany({ _id: {$in: data.ids} }, (err) => {
                    if (err) {
                        next(new errors.BadRequest(err));
                    }
                })
                res.status(200).end();
            } else {
                await Department.updateMany({_id: {$in: data.ids}}, { $set: { status: data.action } })
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function departmentUpdateSubject(req, res, next) {
    L('Calling API Department.departmentUpdateSubject', req.body);

    try {
        let data = req.body;
        if (!data.ids || !data.ids.length) {
            next(new errors.BadRequest('Ids必填'));
        } else if (!data.subjectCode) {
            next(new errors.BadRequest('科目必填'));
        } else {
            await Department.updateMany({_id: { $in:  data.ids}}, { $set: {subjectCode: data.subjectCode} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}