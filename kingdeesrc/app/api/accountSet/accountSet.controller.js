const errors = require('@lib/errors');
const L = require('debug')('app:api');

const AccountSet = require('./accountSet.model');
const UserGroup = require('../userManage/userGroup.model');
const User = require('../user/user.model');
const BackstageClient = require('../_backstage/backstageClient.model');

module.exports = {
    update,
    query,
};

async function update(req, res, next) {
    L('Calling API AccountSet.update', req.body);

    try {
        let data = req.body;
        if (!data.accountSetId) {
            next(new errors.BadRequest('账套号必填'));
        } else if (!data.accountSetName) {
            next(new errors.BadRequest('账套名字必填'));
        } else if (!data.organization) {
            next(new errors.BadRequest('机构名称必填'));
        } else if (!data.code) {
            next(new errors.BadRequest('记账本位币编码必填'));
        } else if (!data.unit) {
            next(new errors.BadRequest('记账金额单位必填'));
        } else if (!data.accountingYear) {
            next(new errors.BadRequest('启用会计年度必填'));
        } else if (!data.accountingPeriod) {
            next(new errors.BadRequest('启用会计期间必填'));
        } else if (!data.accountingNumber) {
            next(new errors.BadRequest('会计期间数必填'));
        } else if (!data.companyId) {
            next(new errors.BadRequest('公司Id必填'));
        } else if (!data.userList || !data.userList.length) {
            next(new errors.BadRequest('账套用户列表必填'));
        } else {
            let aList = await AccountSet.find({
                companyId: data.companyId,
                status: '已启用'
            })
            let aData = await BackstageClient.findOne({_id: data.companyId})
            if (data._id) {
                let account = await AccountSet.findOne({_id: data._id})
                if (aData.accountSetNumber !== null && aList.length >= aData.accountSetNumber && account.status !== '已启用' && data.status === '已启用') {
                    next(new errors.BadRequest(`无法创建新账套，你的账套数为${ aList.length }，购买的账套数为${ aData.accountSetNumber }`));
                }
                // 修改
                let _id = data._id
                delete data._id
                await AccountSet.updateOne({_id}, { $set: data })
                let userGroup = await UserGroup.findOne({accountSetId: _id, name: '用户组'})
                if (userGroup) {
                    for (let i = 0; i < data.userList.length; i++) {
                        let groupData = await User.findOne({_id: data.userList[i]})
                        let group = groupData._doc.group
                        if (group && !group.includes(userGroup._id.toString())) {
                            group.push(userGroup._id.toString())
                            await User.updateOne({_id: data.userList[i]}, {$set: {group: group}})
                        }
                    }
                }
            } else {
                if (aData.accountSetNumber !== null && aList.length >= aData.accountSetNumber) {
                    next(new errors.BadRequest(`无法创建新账套，你的账套数为${ aList.length }，购买的账套数为${ aData.accountSetNumber }`));
                }

                // 新增
                let accountSet = await AccountSet.create(data)

                // 初始化用户管理资料
                let userGroup = await UserGroup.create({accountSetId: accountSet._id, name: '用户组', isDelete: false})
                let adminGroup = await UserGroup.create({accountSetId: accountSet._id, name: '管理组', explain: '系统管理员组', isDelete: false})
                await UserGroup.create({accountSetId: accountSet._id, name: '报表组', isDelete: false})

                for (let i = 0; i < data.userList.length; i++) {
                    let groupData = await User.findOne({_id: data.userList[i]})
                    let group = groupData._doc.group
                    group.push(userGroup._id.toString())
                    group.push(adminGroup._id.toString())
                    await User.updateOne({_id: data.userList[i]}, {$set: {group: group}})
                }
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API AccountSet.query', req.body);

    try {
        let data = req.body
        let result = []
        if (data._id) {
            result = await AccountSet.find({
                _id: data._id
            }).sort({createdAt: -1})
            res.status(200).json(result);
        } else if (data.companyId) {
            let filter = {
                companyId: data.companyId
            }
            if (data.userId) filter.userList = { $in: [data.userId] }
            result = await AccountSet.find(filter).sort({createdAt: -1})
            res.status(200).json(result);
        } else {
            next(new errors.BadRequest('缺少必要参数'));
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}
