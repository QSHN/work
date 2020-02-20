const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errors = require('@lib/errors');
const L = require('debug')('app:api');
const ms = require('ms');
const axios = require('axios');

const BackstageAccount = require('./backstageAccount.model');
const BackstageClerk = require('./backstageClerk.model');
const BackstageApp = require('./backstageApp.model');
const BackstageClient = require('./backstageClient.model');

const User = require('../user/user.model');
const FunPermission = require('../funPermission/funPermission.model');

module.exports = {
    register,
    login,
    getCurrent,
    updateAdmin,
    queryAdmin,
    queryClerk,
    updateClerk,
    deleteClerk,
    queryApp,
    updateApp,
    deleteApp,
    latestAppVersion,
    queryClient,
    updateClient,
    updateRecords,
    functionManage,
    // userManage,
    filesManage
};

async function register(req, res, next) {
    L('Calling API backstageAccount.register', req.body);

    try {
        let data = req.body;
        if (!data.account) {
            next(new errors.BadRequest('账号必填'));
        } else if (!data.password) {
            next(new errors.BadRequest('密码必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('姓名必填'));
        } else {
            data.hash = bcrypt.hashSync(data.password, 10);
            delete data.password;

            let userInfo = await BackstageAccount.create(data)
            delete userInfo.hash

            res.status(200).json(userInfo);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function login(req, res, next) {
    L('Calling API backstageAccount.login', req.body);

    try {
        let data = req.body;
        if (!data.account) {
            next(new errors.BadRequest('账号必填'));
        } else if (!data.password) {
            next(new errors.BadRequest('密码必填'));
        } else {
            let u = await BackstageAccount.findOne({account: data.account})
            if (bcrypt.compareSync(data.password, u.hash)) {
                const {hash, ...userWithoutHash} = u.toObject();
                if (u.accountStatus === '正常') {
                    const token = jwt.sign({
                        sub: u._id,
                        uuid: data.uuid,            //用户标识符
                        hash: u.hash.substring(10), //密码标识符
                        role: u.role,
                    }, config.get('secret'), {expiresIn: ms('30 days')});
                    if (u.uuid !== data.uuid) {
                        u.uuid = data.uuid
                        u.save()
                    }
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
    L('Calling API backstageAccount.getCurrent', req.body);

    try {
        let uId = req.user.sub;
        if (!uId) {
            next(new errors.Unauthorized('用户没有登录'));
        } else {
            let u = await BackstageAccount.findById(uId);
            if (!u) {
                next(new errors.BadRequest('该用户不存在'));
            } else if (u.accountStatus !== '正常') {
                next(new errors.BadRequest(`该账户已${u.accountStatus}`));
            } else if (u.hash.substring(10) !== req.user.hash) {
                next(new errors.BadRequest('密码已修改请重新登陆，请重新登陆'));
            } else if (req.user.uuid !== u.uuid) {
                next(new errors.BadRequest('用户在别的机器上登陆，请重新登陆'));
            } else {
                delete u.hash
                res.status(200).json(u);
            }
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updateAdmin(req, res, next) {
    L('Calling API backstageAccount.updateAdmin', req.body);

    try {
        let data = req.body
        let _id = data._id
        delete data._id
        if (data.password) {
            data.hash = bcrypt.hashSync(data.password, 10);
            delete data.password;
        }
        let result = await BackstageAccount.updateOne({_id}, { $set: data })
        delete result.hash
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryAdmin(req, res, next) {
    L('Calling API backstageAccount.queryAdmin', req.body);

    try {
        let data = req.body
        let filter = {}
        if (!data.isAll) {
            filter = {
                role: data.role,
                name: { $ne: 'root' }
            }
        }
        let result = await BackstageAccount.find(filter).sort({createdAt: -1});
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updateClerk(req, res, next) {
    L('Calling API Backstage.updateClerk', req.body);

    try {
        let data = req.body;
        if (!data.name) {
            next(new errors.BadRequest('名称必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await BackstageClerk.updateOne({_id}, { $set: data })
                await BackstageAccount.updateMany({clerkId: _id}, {$set: {clerk: data.name}})
            } else {
                await BackstageClerk.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryClerk(req, res, next) {
    L('Calling API Backstage.queryClerk', req.body);

    try {
        let result = await BackstageClerk.find();
        res.status(200).json(result);
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteClerk(req, res, next) {
    L('Calling API Backstage.deleteClerk', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('职位Id必填'));
        } else {
            await BackstageClerk.deleteOne({ _id: data.id }, (err) => {
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

async function updateApp(req, res, next) {
    L('Calling API Backstage.updateApp', req.body);

    try {
        let data = req.body;
        if (!data.code) {
            next(new errors.BadRequest('版本号必填'));
        } else if (!data.internalCode) {
            next(new errors.BadRequest('内部版本号必填'));
        } else if (!data.content) {
            next(new errors.BadRequest('版本内容必填'));
        } else if (!data.time) {
            next(new errors.BadRequest('发布时间必填'));
        } else if (!data.down) {
            next(new errors.BadRequest('下载链接必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                await BackstageApp.updateOne({_id}, { $set: data })
            } else {
                await BackstageApp.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryApp(req, res, next) {
    L('Calling API Backstage.queryApp', req.body);

    try {
        let result = await BackstageApp.find();
        res.status(200).json(result);
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteApp(req, res, next) {
    L('Calling API Backstage.deleteApp', req.body);

    try {
        let data = req.body;
        if (!data.id) {
            next(new errors.BadRequest('职位Id必填'));
        } else {
            await BackstageApp.deleteOne({ _id: data.id }, (err) => {
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

async function latestAppVersion(req, res, next) {
    L('Calling API Backstage.latestAppVersion', req.query);

    try {
        let result = null
        let fData = await BackstageApp.find().sort({createdAt: -1});
        if (fData.length) result = fData[0]
        if (result) {
            res.status(200).json({
                "hasUpdate": req.query.versionCode && req.query.versionCode < result.internalCode,
                "isSilent": false,
                "isForce": result.isUpdate,
                "isAutoInstall": true,
                "isIgnorable": !result.status,
                "versionCode": result.internalCode,
                "versionName": result.code,
                "updateContent": result.content,
                "url": result.down,
                "md5": result.md5,
                "size": result.size,
                "silent": false,
                "force": result.isUpdate,
                "autoInstall": true,
                "ignorable": !result.status
            });
        } else {
            next(new errors.BadRequest('找不到最新app版本信息'));
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function updateClient(req, res, next) {
    L('Calling API Backstage.updateClient', req.body);

    try {
        let data = req.body;
        if (!data.companyName) {
            next(new errors.BadRequest('公司名必填'));
        } else if (!data.companyAccount) {
            next(new errors.BadRequest('公司账号必填'));
        } else if (!data.name) {
            next(new errors.BadRequest('联系人必填'));
        } else if (!data.phone) {
            next(new errors.BadRequest('手机号码必填'));
        } else if (!data.salesmanId) {
            next(new errors.BadRequest('客户归属必填'));
        } else {
            if (data._id) {
                let _id = data._id
                delete data._id
                let bClient = await BackstageClient.findOne({_id})

                // 小牛
                let niuData = {
                    companyName: data.companyName,
                    companyAccount: data.companyAccount,
                    name: data.name,
                    phone: data.phone,
                    bClientId: _id,
                    oldPhone: bClient.phone
                }
                if (data.password) niuData.passwd = data.password;
                if (data.accountStatus) niuData.accountStatus = data.accountStatus
                axios.post(config.get("niuAppUrl") + "/company/companyUpdate", niuData).then(res => {
                }).catch(err => {
                    next(new errors.BadRequest(err.response.data.message));
                });

                // 金蝶
                let userData = await User.findOne({
                    account: bClient.phone
                })
                if (userData) {
                    let formData = {
                        account: data.phone,
                    }
                    if (data.password) formData.hash = bcrypt.hashSync(data.password, 10);
                    if (data.accountStatus) formData.accountStatus = data.accountStatus
                    await User.updateOne({
                        _id: userData._id
                    }, { $set: formData })
                }
                await BackstageClient.updateOne({_id}, { $set: data })
            } else {
                if (!data.password) data.password = '123456'

                let userData = await User.find({
                    account: data.phone
                })

                if (userData.length > 0) {
                    next(new errors.BadRequest('已存在该手机号'));
                } else {
                    let bClientId = await BackstageClient.create(data)

                    // 金蝶
                    let formData = {
                        companyId: bClientId,
                        account: data.phone,
                        accountStatus: data.accountStatus,
                        accountType: '总账户',
                        role: 'admin',
                        name: data.name
                    }
                    formData.hash = bcrypt.hashSync(data.password, 10);
                    await User.create(formData)

                    if (data.financeFunction && data.financeFunction.length) {
                        await FunPermission.create({
                            companyId: bClientId,
                            permission: data.financeFunction
                        })
                    }

                    // 小牛
                    axios.post(config.get("niuAppUrl") + "/company/register", {
                        companyName: data.companyName,
                        companyAccount: data.companyAccount,
                        name: data.name,
                        phone: data.phone,
                        passwd: data.password,
                        force: false,
                        bClientId: bClientId,
                        accountStatus: data.accountStatus
                    })

                    if (data.erpFunction && data.erpFunction.length) {
                        axios.post(config.get("niuAppUrl") + "/funPermission/funPermissionUpdate", {
                            bClientId: bClientId,
                            permission: data.erpFunction
                        })
                    }
                }
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function queryClient(req, res, next) {
    L('Calling API Backstage.queryClient', req.body);

    try {
        let data = req.body;
        if (data && data._id) {
            let result = await BackstageClient.findOne({
                _id: data._id
            });
            res.status(200).json(result);
        } else {
            let result = await BackstageClient.find();
            res.status(200).json(result);
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function updateRecords(req, res, next) {
    L('Calling API Backstage.updateRecords', req.body);

    try {
        let data = req.body;
        if (!data._id) {
            next(new errors.BadRequest('公司id必填'));
        } else {
            let _id = data._id
            delete data._id
            await BackstageClient.updateOne({_id}, { $set: data })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function functionManage(req, res, next) {
    L('Calling API Backstage.functionManage', req.body);

    try {
        let data = req.body;
        if (!data._id) {
            next(new errors.BadRequest('公司id必填'));
        } else {
            let _id = data._id
            delete data._id
            await BackstageClient.updateOne({_id}, { $set: data })

            // 金蝶
            if (data.financeFunction && data.financeFunction.length) {
                let fData = await FunPermission.findOne({companyId: _id})
                if (fData) {
                    await FunPermission.updateOne({ companyId: _id }, { $set: { permission: data.financeFunction } })
                } else {
                    await FunPermission.create({
                        companyId: _id,
                        permission: data.financeFunction
                    })
                }
            }

            // 小牛
            if (data.erpFunction && data.erpFunction.length) {
                axios.post(config.get("niuAppUrl") + "/funPermission/funPermissionUpdate", {
                    bClientId: _id,
                    permission: data.erpFunction
                }).then(res => {
                }).catch(err => {
                    next(new errors.BadRequest(err.response.data.message));
                });
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

// async function userManage(req, res, next) {
//     L('Calling API Backstage.userManage', req.body);
//
//     try {
//         let data = req.body;
//         if (!data._id) {
//             next(new errors.BadRequest('公司id必填'));
//         } else {
//             let _id = data._id
//             delete data._id
//             let oldBData = await BackstageClient.findOne({_id})
//
//             // 金蝶
//             if (data.userList && data.userList.length) {
//                 let uList = await User.find({
//                     companyId: _id,
//                     role: 'defaultAccount'
//                 })
//
//                 for (let i = 0; i < data.userList.length; i++) {
//                     let val = data.userList[i]
//                     let oldVal = oldBData.userList.length > i ? oldBData.userList[i] : null
//
//                     let fData = await uList.find(f => oldVal && f.account === oldVal.phone)
//
//                     if (fData) {
//                         let formData = {
//                             account: val.phone,
//                             accountStatus: val.accountStatus
//                         }
//                         if (val.password) formData.hash = bcrypt.hashSync(val.password, 10);
//                         await User.updateOne({_id: fData._id}, {$set: formData})
//                     } else {
//                         if (val.type === '财务') {
//                             let formData = {
//                                 companyId: _id,
//                                 account: val.phone,
//                                 accountStatus: '正常',
//                                 accountType: '预设账户',
//                                 role: 'defaultAccount'
//                             }
//                             formData.hash = bcrypt.hashSync(val.password, 10);
//                             let userInfo = await User.create(formData)
//                             await UserInfo.create({
//                                 userId: userInfo._id,
//                                 name: val.name,
//                                 explain: '系统预设用户',
//                                 phone: val.phone,
//                                 manageP: true,
//                                 lookP: true
//                             })
//                         }
//                     }
//                 }
//
//                 // 小牛
//                 axios.post(config.get("niuAppUrl") + "/user/bUserUpdate", {
//                     bClientId: _id,
//                     userList: data.userList,
//                     oldList: oldBData.userList
//                 }).then(res => {
//                 }).catch(err => {
//                     next(new errors.BadRequest(err.message));
//                 });
//             }
//
//             data.userList = data.userList.map(m => {
//                 return {
//                     name: m.name,
//                     phone: m.phone,
//                     accountStatus: m.accountStatus,
//                     type: m.type
//                 }
//             })
//             await BackstageClient.updateOne({_id}, { $set: data })
//             res.status(200).end();
//         }
//     } catch (err) {
//         L(err);
//         next(new errors.BadRequest(err.message));
//     }
// }

async function filesManage(req, res, next) {
    L('Calling API Backstage.filesManage', req.body);

    try {
        let data = req.body;
        if (!data._id) {
            next(new errors.BadRequest('公司id必填'));
        } else {
            let _id = data._id
            delete data._id
            await BackstageClient.updateOne({_id}, { $set: data })
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
