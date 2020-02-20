const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errors = require('@lib/errors');
const L = require('debug')('app:api');
const ms = require('ms');

const User = require('./user.model');
const UserTemp = require('./userTemp.model');
const UserGroup = require('./userGroup.model');
const SystemSet = require('../systemSet/systemSet.model');
const Permission = require('../permission/permission.model');
const BasicInfoGroup = require('../basicInfo/basicInfoGroup.model');

const permission = require('../permission/_permission').permission;

module.exports = {
    register,
    login,
    getCurrent,
    updateUser,
    queryUser,
    updateUserTemp,
    queryUserTemp,
    updateUserGroup,
    queryUserGroup
};

async function register(req, res, next) {
    L('Calling API User.register', req.body);

    try {
        let data = req.body;
        if (!data.account) {
            next(new errors.BadRequest('账号必填'));
        } else if (!data.password) {
            next(new errors.BadRequest('密码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('姓名必填'));
        } else if (!data.phone) {
            next(new errors.BadRequest('手机必填'));
        } else {
            let result = await User.findOne({account: data.account})
            if (result) {
                next(new errors.BadRequest('已存在该账号'));
            } else {
                data.hash = bcrypt.hashSync(data.password, 10);
                delete data.password;
                await User.create(data)
                res.status(200).end();
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function login(req, res, next) {
    L('Calling API User.login', req.body);

    try {
        let data = req.body;
        if (!data.account) {
            next(new errors.BadRequest('账号必填'));
        } else if (!data.password) {
            next(new errors.BadRequest('密码必填'));
        } else if (!data.uuid) {
            next(new errors.BadRequest('用户标识符必填'));
        }else {
            let u = await User.findOne({account: data.account})
            if (bcrypt.compareSync(data.password, u.hash)) {
                const {hash, ...userWithoutHash} = u.toObject();
                if (u.accountStatus === '正常') {
                    const token = jwt.sign({
                        userId: u._id,
                        uuid: data.uuid,            //用户标识符
                        hash: u.hash.substring(10), //密码标识符
                        role: u.role,
                    }, config.get('secret'), {expiresIn: ms('30 days')});
                    let updateData = {
                        loginTime: new Date(),
                        passErr: 0
                    }
                    if (u.uuid !== data.uuid) {
                        updateData.uuid = data.uuid
                    }
                    await User.updateOne({_id: u._id}, {$set: updateData})
                    res.status(200).json({
                        'profile': userWithoutHash,
                        'token': token
                    });
                } else {
                    next(new errors.BadRequest(`该账户状态：${u.accountStatus}`));
                }
            } else {
                if (u) {
                    let errNumber = u.passErr + 1
                    await User.updateOne({_id: u._id}, {$set: {passErr: errNumber}})
                    let system = await SystemSet.findOne()
                    if (!system) {
                        await SystemSet.create({ passErr: 5 })
                        system = { passErr: 5 }
                    }
                    if (errNumber < system.passErr) {
                        next(new errors.BadRequest(`账号和密码不匹配，您还有${system.passErr - errNumber}次机会`));
                    } else {
                        await User.updateOne({_id: u._id}, {$set: {accountStatus: '锁住'}})
                        next(new errors.BadRequest(`账号和密码不匹配，您的账号已被锁住，请联系管理员`));
                    }
                } else {
                    next(new errors.BadRequest(`账号和密码不匹配`))
                }
            }
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}


async function getCurrent(req, res, next) {
    L('Calling API User.getCurrent', req.body);

    try {
        let uId = req.user.userId;
        if (!uId) {
            next(new errors.Unauthorized('用户没有登录'));
        } else {
            let u = await User.findById(uId);
            if (!u) {
                next(new errors.BadRequest('该用户不存在'));
            } else if (u.accountStatus !== '正常') {
                next(new errors.BadRequest(`该账户状态：${userInfo.accountStatus}`));
            } else if (u.hash.substring(10) !== req.user.hash) {
                next(new errors.BadRequest('密码已修改请重新登陆，请重新登陆'));
            } else if (req.user.uuid !== u.uuid) {
                next(new errors.BadRequest('用户在别的机器上登陆，请重新登陆'));
            } else {
                delete u.hash
                await User.updateOne({_id: uId}, {$set: {loginTime: new Date()}})

                let pInfo = await Permission.findOne({userId: uId});
                if (!pInfo) {
                    await Permission.create({userId: uId});
                    pInfo = await Permission.findOne({userId: uId})
                }
                let groupData = await UserGroup.findOne({})
                let gIds = []
                groupData.customer.forEach(f => {
                    if (f.userList.includes(uId.toString()) && !gIds.includes(uId.toString())) gIds.push(f.id)
                })
                groupData.employee.forEach(f => {
                    if (f.userList.includes(uId.toString()) && !gIds.includes(uId.toString())) gIds.push(f.id)
                })
                let gList =  await Permission.find({groupId: {$in: gIds}})

                let groupChecked = pInfo.checked
                gList.forEach(g => {
                    g.checked.forEach(v => {
                        if (!pInfo.checked.includes(v)) groupChecked.push(v)
                    })
                })
                pInfo.checked = groupChecked

                let pList = permission.pList
                let bGroup = await BasicInfoGroup.findOne()
                if (!bGroup) {
                    await BasicInfoGroup.create({})
                    bGroup = await BasicInfoGroup.findOne()
                }
                let pChild = [
                    {
                        id: '3-1',
                        label: '管理权',
                        children: [
                            {
                                id: '3-1-1',
                                label: '新增基础资料'
                            },
                            {
                                id: '3-1-2',
                                label: '新增组'
                            },
                            {
                                id: '3-1-3',
                                label: '修改组'
                            },
                            {
                                id: '3-1-4',
                                label: '删除组'
                            }
                        ]
                    },
                    {
                        id: '3-2',
                        label: '查看权'
                    }
                ]
                bGroup.group.forEach((f, i) => {
                    pChild[0].children.push({
                        id: '3-1-' + (i + 5),
                        label: f.name,
                        children: [
                            {
                                id: '3-1-' + (i + 5) + '-1',
                                label: '管理权',
                                children: [
                                    {
                                        id: '3-1-' + (i + 5) + '-1-1',
                                        label: '新增'
                                    },
                                    {
                                        id: '3-1-' + (i + 5) + '-1-2',
                                        label: '修改'
                                    },
                                    {
                                        id: '3-1-' + (i + 5) + '-1-3',
                                        label: '删除'
                                    },
                                    {
                                        id: '3-1-' + (i + 5) + '-1-4',
                                        label: '自定义'
                                    },
                                    {
                                        id: '3-1-' + (i + 5) + '-1-5',
                                        label: '新增分类'
                                    },
                                    {
                                        id: '3-1-' + (i + 5) + '-1-6',
                                        label: '修改分类'
                                    },
                                    {
                                        id: '3-1-' + (i + 5) + '-1-7',
                                        label: '删除分类'
                                    },
                                ]
                            },
                            {
                                id: '3-1-' + (i + 5) + '-2',
                                label: '查看权'
                            }
                        ]
                    })
                })
                pList[2].children = pChild
                pInfo._doc.permission = pList
                u._doc.permission = pInfo
                res.status(200).json(u);
            }
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updateUser(req, res, next) {
    L('Calling API User.updateUser', req.body);

    try {
        let data = req.body
        let _id = data._id
        delete data._id
        if (data.password) {
            data.hash = bcrypt.hashSync(data.password, 10);
            delete data.password;
        }
        let result = await User.updateOne({_id}, data)
        delete result.hash
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryUser(req, res, next) {
    L('Calling API User.queryUser', req.body);

    try {
        let filter = req.body || {}
        if (!filter.account) filter.account = { $ne: 'root' }
        let result = await User.find(filter, '-hash -__v -updatedAt')
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updateUserTemp(req, res, next) {
    L('Calling API User.updateUserTemp', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            let result = await UserTemp.updateOne({_id}, data)
            res.status(200).json(result);
        } else {
            next(new errors.BadRequest('缺少资料模板id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryUserTemp(req, res, next) {
    L('Calling API User.queryUserTemp', req.body);

    try {
        let result = await UserTemp.findOne()
        if (!result) {
            await UserTemp.create({})
            result = await UserTemp.findOne()
        }
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updateUserGroup(req, res, next) {
    L('Calling API User.updateUserGroup', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            let result = await UserGroup.updateOne({_id}, data)
            res.status(200).json(result);
        } else {
            next(new errors.BadRequest('缺少用户组id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryUserGroup(req, res, next) {
    L('Calling API User.queryUserGroup', req.body);

    try {
        let result = await UserGroup.findOne()
        if (!result) {
            await UserGroup.create({})
            result = await UserGroup.findOne()
        }
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}
