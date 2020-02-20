const errors = require('@lib/errors');
const L = require('debug')('app:api');

const UserGroup = require('./userGroup.model');
const UserPermission = require('./userPermission.model');
const User = require('../user/user.model');
const Permission = require('../../designDatabase/permission').permission

module.exports = {
    updatePermission,
    queryPermission,
    updateGroup,
    queryGroup,
    deleteGroup
};

/***************** 权限 ***********************/
async function updatePermission(req, res, next) {
    L('Calling API UserManage.updatePermission', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId || (!data.userId && !data.groupId) || (!data.permission || !data.permission.length)) {
            next(new errors.BadRequest('Id必填'));
        } else {
            let permission = data.permission
            delete data.permission
            await UserPermission.updateOne(data, { $set: {permission: permission} })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryPermission(req, res, next) {
    L('Calling API UserManage.queryPermission', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.userId && !data.groupId) {
            next(new errors.BadRequest('id必填'));
        } else {
            let result = []
            if (data.userId) {
                let uData = await User.findOne({_id: data.userId})
                let pData = await UserPermission.findOne({userId: data.userId})
                if (!pData) {
                    pData = await UserPermission.create({
                        accountSetId: data.accountSetId,
                        userId: data.userId,
                        permission: Permission
                    })
                }
                result = pData.permission
                for (let i = 0; i < uData.group.length; i++) {
                    let groupP = await UserPermission.findOne({
                        groupId: uData.group[i]
                    })
                    if (!groupP) {
                        let group = await UserGroup.findOne({_id: uData.group[i]})
                        let permission = Permission
                        permission.forEach(f => {
                            if (
                              group.name === '管理组' ||
                              (group.name === '报表组' && f.title.includes('表'))
                            ) {
                                f.operation.forEach(o => {
                                    o.val = true
                                })
                            }
                        })
                       groupP = await UserPermission.create({
                            accountSetId: data.accountSetId,
                            groupId: group._id,
                            permission: permission
                        })
                    }
                    let pList = groupP.permission
                    pList.forEach(v => {
                        let index = result.findIndex(f => f.title === v.title)
                        if (index >= 0) {
                            v.operation.forEach((o, i) => {
                                if (o.val) {
                                    result[index].operation[i].val = true
                                    result[index].operation[i].disabled = true
                                }
                            })
                        } else {
                            let add = Object.assign({}, v._doc)
                            add.operation.forEach((o, i) => {
                                add.disabled = o.val
                            })
                            result.push(add)
                        }
                    })
                }
            } else {
                let pData = await UserPermission.findOne(data)
                if (!pData) {
                    let group = await UserGroup.findOne({_id: data.groupId})
                    let permission = Permission
                    permission.forEach(f => {
                        if (
                          group.name === '管理组' ||
                          (group.name === '报表组' && f.title.includes('表'))
                        ) {
                            f.operation.forEach(o => {
                                o.val = true
                            })
                        }
                    })
                    pData = await UserPermission.create({
                        accountSetId: data.accountSetId,
                        groupId: group._id,
                        permission: permission
                    })
                }
                result = pData.permission
            }
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function updateGroup(req, res, next) {
    L('Calling API UserManage.updateGroup', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('用户组名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await UserGroup.updateOne({_id}, { $set: data })
            } else {
                await UserGroup.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryGroup(req, res, next) {
    L('Calling API UserManage.queryGroup', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套Id必填'));
        } else {
            let result = await UserGroup.find(data)
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteGroup(req, res, next) {
    L('Calling API UserManage.deleteGroup', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('Id必填'));
        } else {
            await UserGroup.deleteOne({ _id: data.id }, (err) => {
                if (err) next(new errors.BadRequest(err));
            })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
