const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errors = require('@lib/errors');
const L = require('debug')('app:api');
const ms = require('ms');
const axios = require('axios');

const User = require('./user.model');
const AccountSet = require('../accountSet/accountSet.model');
const BackstageClient = require('../_backstage/backstageClient.model');
const pushMsg = require('../message/message.controller').pushMsg;

module.exports = {
    register,
    login,
    getCurrent,
    update,
    queryUserList
};

async function register(req, res, next) {
    L('Calling API User.register', req.body);

    try {
        let data = req.body;
        if (!data.account) {
            next(new errors.BadRequest('账号必填'));
        } else if (!data.companyId) {
            next(new errors.BadRequest('公司id必填'));
        }  else if (!data.name) {
            next(new errors.BadRequest('用户名必填'));
        } else {
            let aData = await BackstageClient.findOne({_id: data.companyId})
            let fList = await User.find({_id: data.company})
            if (data._id) {
                // 修改
                let uData = await User.findOne({_id: data._id})

                if (aData.accountSetNumber !== null && fList.length >= aData.accountSetNumber && uData.accountStatus !== '正常' && data.accountStatus === '正常') {
                    next(new errors.BadRequest(`无法创建新用户，你的用户数为${ fList.length }，购买的财务用户数为${ aData.accountSetNumber }`));
                }

                if (!data.isChangeStatus) {
                    let aList = await User.find({
                        account: data.account,
                        _id: { $ne: data._id }
                    })

                    if (aList.length) {
                        next(new errors.BadRequest('已存在该账号'));
                    } else {
                        let success = async () => {
                            await User.updateOne({_id: data._id}, {
                                $set: data
                            })
                            await BackstageClient.update({_id: data.company}, {
                                $set: {
                                    name: data.name,
                                    phone: data.account
                                }
                            })
                            res.status(200).end();
                        }
                        axios.post(config.get("niuAppUrl") + "/user/bUserList", {
                            account: data.account
                        }).then(res => {
                            if (res.data.length && uData.account !== data.account) {
                                next(new errors.BadRequest('已存在该账号'));
                            } else {
                                let appData = {
                                    oldAccount: uData.account,
                                    name: data.name,
                                    phone: data.account
                                }
                                if (data.password) {
                                    data.hash = bcrypt.hashSync(data.password , 10);
                                    appData.hash = data.hash
                                    delete data.password;
                                }
                                axios.post(config.get("niuAppUrl") + "/user/bUserUpdate", appData).then(res => {
                                    success()
                                }).catch(err => {
                                    next(new errors.BadRequest(err.response.data.message));
                                });
                            }
                        }).catch(err => {
                            next(new errors.BadRequest(err.response.data.message));
                        });
                    }
                } else {
                    // 更改状态
                    let success = async () => {
                        await User.updateOne({_id: data._id}, {
                            $set: { accountStatus: data.accountStatus }
                        })
                        res.status(200).end();
                    }
                    axios.post(config.get("niuAppUrl") + "/user/bUserUpdate", {
                        oldAccount: data.account,
                        accountStatus: data.accountStatus,
                        phone: data.account
                    }).then(res => {
                        success()
                    }).catch(err => {
                        next(new errors.BadRequest(err.response.data.message));
                    });
                }
            } else {
                if (aData.accountSetNumber !== null && fList.length >= aData.accountSetNumber) {
                    next(new errors.BadRequest(`无法创建新用户，你的用户数为${ fList.length }，购买的财务用户数为${ aData.accountSetNumber }`));
                }

                // 创建
                let aList = await User.find({
                    account: data.account
                })
                if (aList.length) {
                    next(new errors.BadRequest('已存在该账号'));
                } else {
                    let success = async () => {
                        let userInfo = await User.create(data)
                        delete userInfo.hash
                        res.status(200).end();
                    }
                    axios.post(config.get("niuAppUrl") + "/user/bUserList", {
                        account: data.account
                    }).then(res => {
                        if (res.data.length) {
                            next(new errors.BadRequest('已存在该账号'));
                        } else {
                            data.hash = bcrypt.hashSync(data.password || '123456', 10);
                            delete data.password;

                            axios.post(config.get("niuAppUrl") + "/user/bUserUpdate", {
                                bClientId: data.companyId,
                                name: data.name,
                                phone: data.account,
                                superadmin: false,
                                role: 'employee',
                                accountStatus: data.accountStatus,
                                accountType: data.type,
                                hash: data.hash
                            }).then(res => {
                                success()
                            }).catch(err => {
                                next(new errors.BadRequest(err.response.data.message));
                            });
                        }
                    }).catch(err => {
                        next(new errors.BadRequest(err.response.data.message));
                    });
                }
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
        } else {
            let u = await User.findOne({account: data.account})
            let accountData = u.useAccountSet ? await AccountSet.findOne({_id: u.useAccountSet}) : null
            if (!accountData && u.role === 'accountSet') {
                next(new errors.BadRequest('找不到该用户使用账套信息'));
            } else if (u.role === 'accountSet' && accountData && (accountData.status !== '已启用' || accountData.status !== '使用中')) {
                next(new errors.BadRequest(`${accountData.accountSetName}账套状态为${accountData.status}，无法登录，请联系账套管理员`));
            } else if (bcrypt.compareSync(data.password, u.hash)) {
                const {hash, ...userWithoutHash} = u.toObject();
                if (u.accountStatus === '正常') {
                    const token = jwt.sign({
                        sub: u._id,
                        uuid: data.uuid,            //用户标识符
                        hash: u.hash.substring(10), //密码标识符
                        role: u.role,
                    }, config.get('secret'), {expiresIn: ms('30 days')});
                    let updateData = {
                        loginTime: new Date(),
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
                    next(new errors.BadRequest(`该账户已${u.accountStatus}`));
                }
            } else {
                next(new errors.BadRequest('账号和密码不匹配'));
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
        let uId = req.user.sub;
        if (!uId) {
            next(new errors.Unauthorized('用户没有登录'));
        } else {
            let u = await User.findById(uId);
            if (!u) {
                next(new errors.BadRequest('该用户不存在'));
            } else if (u.accountStatus !== '正常') {
                next(new errors.BadRequest(`该账户已${u.accountStatus}`));
            } else if (u.hash.substring(10) !== req.user.hash) {
                next(new errors.BadRequest('密码已修改请重新登陆，请重新登陆'));
            } else if (req.user.uuid !== u.uuid) {
                next(new errors.BadRequest('用户在别的机器上登陆，请重新登陆'));
            } else {
                let accountData = u.useAccountSet ? await AccountSet.findOne({_id: u.useAccountSet}) : null
                if (!accountData && u.role === 'accountSet') {
                    next(new errors.BadRequest('找不到该用户使用账套信息'));
                } else if (u.role === 'accountSet' && accountData && (accountData.status !== '已启用' || accountData.status !== '使用中')) {
                    next(new errors.BadRequest(`${accountData.accountSetName}账套状态为${accountData.status}，无法登录，请联系账套管理员`));
                } else {
                    delete u.hash
                    await User.updateOne({_id: uId}, {$set: {loginTime: new Date()}})
                    res.status(200).json(u);
                }
            }
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function update(req, res, next) {
    L('Calling API User.update', req.body);

    try {
        let data = req.body
        let _id = data._id
        delete data._id
        if (data.password) {
            data.hash = bcrypt.hashSync(data.password, 10);
            delete data.password;
        }
        await User.updateOne({_id}, {$set: data})
        let result = await User.findOne({_id})
        delete result.hash
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryUserList(req, res, next) {
    L('Calling API User.queryUserList', req.body);

    try {
        let data = req.body
        if (!data.companyId) {
            next(new errors.Unauthorized('缺少公司Id'));
        } else {
            let result = await User.find(data)
            res.status(200).json(result);
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}