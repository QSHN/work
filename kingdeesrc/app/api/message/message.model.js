const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = new Schema({
    title: {
        // 消息标题
        type: String,
        required: true
    },
    creator: {
        // 发件人 注：系统消息不需要发件人
        type: ObjectId
    },
    userId: {
        // 接收人 注：系统消息有可能不需要接收人
        type: ObjectId
    },
    contentId: {
        // 消息连接详情内容Id
        type: ObjectId
    },
    content: {
        // 消息内容
        type: String,
        required: true
    },
    messageType: {
        // 消息类型
        type: String,
        default: '普通消息',
        enum: ['普通消息', '工作流消息', '关注消息', '安灯消息', '已发邮件', '系统消息']
    },
    status:{
        // 消息状态
        type:String,
        default: "未读",
        enum: ['未读','已读']
    },
    extras:{
        // 腾讯推送拓展参数
        type: Object
    },
    url:{
        // 腾讯推送url
        type: String
    },
    scheduleTime:{
        // 定时发送
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
