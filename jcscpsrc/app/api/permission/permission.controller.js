const errors = require('@lib/errors');
const L = require('debug')('app:api');

const Permission = require('./permission.model');
const UserGroup = require('../user/userGroup.model');
const BasicInfoGroup = require('../basicInfo/basicInfoGroup.model');

const permission = require('./_permission').permission;

module.exports = {
    updatePermission,
    queryPermission
};

async function updatePermission(req, res, next) {
    L('Calling API Permission.updatePermission', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            await Permission.updateOne({_id}, data)
            res.status(200).end();
        } else {
            next(new errors.BadRequest('缺少id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryPermission(req, res, next) {
    L('Calling API Permission.queryPermission', req.body);

    try {
        let data = req.body
        let result = {}
        if (data.groupId) {
            result = await Permission.findOne({groupId: data.groupId})
            if (!result) {
                await Permission.create({groupId: data.groupId})
                result = await Permission.findOne({groupId: data.groupId})
            }
        } else if (data.userId) {
            result = await Permission.findOne({userId: data.userId})
            if (!result) {
                await Permission.create({userId: data.userId})
                result = await Permission.findOne({userId: data.userId})
            }

            let groupData = await UserGroup.findOne({})
            let gIds = []
            groupData.customer.forEach(f => {
                if (f.userList.includes(data.userId.toString()) && !gIds.includes(data.userId.toString())) gIds.push(f.id)
            })
            groupData.employee.forEach(f => {
                if (f.userList.includes(data.userId.toString()) && !gIds.includes(data.userId.toString())) gIds.push(f.id)
            })
            let gList =  await Permission.find({groupId: {$in: gIds}})

            let groupChecked = []
            gList.forEach(g => {
                g.checked.forEach(v => {
                    if (!groupChecked.includes(v)) groupChecked.push(v)
                })
            })
            result._doc.groupChecked = groupChecked
        } else {
            next(new errors.BadRequest('缺少id'));
        }
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
                            }
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
        result._doc.permission = pList
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}