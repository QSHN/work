const errors = require('@lib/errors');
const L = require('debug')('app:api');
const xgPush = require('@lib/xgPush.js');

const Message = require('./message.model');
const User = require('../user/user.model');

module.exports = {
    update,
    query,
    deleteFun,
    pushMsg
};

/**
 * 推送消息
 * 参数：
 * notification.messageType 分类(必传)
 * notification.userId 用户ID(必传)
 * notification.title 标题(必传)
 * notification.content 内容(必传)
 * notification.url 跳转链接
 * notification.extras 扩展参数
 * notification.scheduleTime 定时发送时间 格式"2016-08-08 18:00:00"
 * @returns {Promise<void>}
 */
async function pushMsg(msg) {
    let result = await Message.create(msg);
    if (msg.userId) {
        let user = await User.findById(msg.userId);
        if (user && user.xgpushId) xgPush.pushById(user.xgpushId, msg);
    }
}

async function update(req, res, next) {
    L('Calling API Message.update', req.body);

    try {
        let data = req.body;
        if (!data.creator && data.messageType !== '系统消息') data.creator = req.user.sub;
        if (!data.title) {
            next(new errors.BadRequest('消息标题必填'));
        } else if (!data.content) {
            next(new errors.BadRequest('消息内容'));
        } else {
            let result;
            if (data._id) {
                let _id = data._id
                delete data._id
                result = await Message.updateOne({_id}, { $set: data })
            } else {
                result = await Message.create(data)
            }
            res.status(200).end();
        }
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function query(req, res, next) {
    L('Calling API Message.query', req.body);

    try {
        let filter = req.body ? Object.assign({}, req.body) : {}
        filter.userId = req.user.sub
        let result = await Message.find(filter).sort({createdAt: -1})
        res.status(200).json(result);
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

async function deleteFun(req, res, next) {
    L('Calling API Message.query', req.body);

    try {
        let data = req.body;
        let filter;
        if (!data) {
            next(new errors.BadRequest('缺少必要参数'));
        } else if (data.id) {
            filter = { _id: data.id }
        } else if (data.idList) {
            filter = { _id: { '$in': data.idList }}
        } else if (data.isAll) {
            filter = { creator: req.user.sub }
        }
        await Message.deleteMany(filter, (err) => {
            if (err) {
                next(new errors.BadRequest(err));
            } else {
                res.status(200).end();
            }
        })
    } catch (err) {
        L(err);
        next(new errors.BadRequest(err.message));
    }
}

