const errors = require('@lib/errors');
const L = require('debug')('app:api');

const BasicInfo = require('./basicInfo.model');
const BasicInfoGroup = require('./basicInfoGroup.model');

module.exports = {
    updateBasicInfo,
    queryBasicInfo,
    updateBasicInfoGroup,
    queryBasicInfoGroup
};

async function updateBasicInfo(req, res, next) {
    L('Calling API BasicInfo.updateBasicInfo', req.body);

    try {
        let data = req.body
        if (data.type && data.which !== undefined) {
            let infoData = await await BasicInfo.findOne()
            let info = infoData._doc.info
            let isUpdate = false
            switch (data.type) {
                case 'addBI':
                    if (data.setData) {
                        isUpdate = true
                        info[data.which] = data.setData
                    }
                  break
                case 'updateBI':
                    if (data.setData) {
                        isUpdate = true
                        info[data.which].gId = data.setData.gId
                        info[data.which].name = data.setData.name
                    }
                    break
                case 'deleteBI':
                    delete info[data.which]
                    isUpdate = true
                    break
                case 'addList':
                    if (data.setData) {
                        isUpdate = true
                        info[data.which].list.push(data.setData)
                    }
                    break
                case 'updateList':
                    if (data.updateIndex !== null && data.setData) {
                        isUpdate = true
                        let num = 0
                        info[data.which].list.forEach((f, i) => {
                            if (f.group === data.setData.group) {
                                if (num === data.updateIndex) {
                                    info[data.which].list.splice(i, 1, data.setData)
                                }
                                num++
                            }
                        })
                    }
                    break
                case 'deleteList':
                    if (data.group !== null && data.setData !== undefined) {
                        isUpdate = true
                        let num = 0
                        info[data.which].list.forEach((f, i) => {
                            if (f.group === data.group) {
                                if (num === data.setData) {
                                    info[data.which].list.splice(i, 1)
                                }
                                num++
                            }
                        })
                    }
                    break
                case 'updateGroup':
                    if (data.setData) {
                        isUpdate = true
                        info[data.which].group = data.setData
                        info[data.which].list.forEach((v, i) => {
                            data.setData.forEach(f => {
                                if (v.groupId === f.id) {
                                    info[data.which].list[i].group = f.name
                                }
                            })
                        })
                    }
                    break
                case 'updateTemp':
                    if (data.setData) {
                        isUpdate = true
                        info[data.which].temp = data.setData
                    }
                    break
            }
            if (isUpdate) {
                console.log(info)
                await BasicInfo.updateOne({_id: infoData._doc._id}, { $set : {info: info }})
                res.status(200).end();
            } else {
                next(new errors.BadRequest('缺少type'));
            }
        } else {
            next(new errors.BadRequest('缺少type'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryBasicInfo(req, res, next) {
    L('Calling API BasicInfo.queryBasicInfo', req.body);

    try {
        let result = await BasicInfo.findOne()
        if (!result) {
            await BasicInfo.create({})
            result = await BasicInfo.findOne()
        }
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function updateBasicInfoGroup(req, res, next) {
    L('Calling API BasicInfo.updateBasicInfoGroup', req.body);

    try {
        let data = req.body
        if (data._id) {
            let _id = data._id
            delete data._id
            await BasicInfoGroup.updateOne({_id}, data)
            res.status(200).end();
        } else {
            next(new errors.BadRequest('缺少id'));
        }
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}

async function queryBasicInfoGroup(req, res, next) {
    L('Calling API BasicInfo.queryBasicInfoGroup', req.body);

    try {
        let result = await BasicInfoGroup.findOne()
        if (!result) {
            await BasicInfoGroup.create({})
            result = await BasicInfoGroup.findOne()
        }
        res.status(200).json(result);
    } catch (err) {
        L(err)
        next(new errors.BadRequest(err.message));
    }
}
