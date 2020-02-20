const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BackstageSchema = new Schema({
    account: {
        // 账号
        type: String,
        required: true,
        unique: true
    },
    hash: {
        // 密码
        type: String
    },
    uuid: {
        // 用户唯一标识符
        type: String
    },
    name: {
        // 姓名
        type: String,
        required: true,
    },
    email: {
        // 邮箱
        type: String,
        default: '',
    },
    phone: {
        // 手机号
        type: Number,
        default: null,
    },
    parentsId: {
        // 上级Id
        type: ObjectId,
        default: null
    },
    clerkId: {
        // 职位id
        type: ObjectId,
        default: null
    },
    clerk: {
        // 职位
        type: String,
        default: ''
    },
    gender: {
        // 性别
        type: String,
        default: '男',
        enum: ['男', '女']
    },
    accountStatus: {
        // 账号状态
        type: String,
        default: '正常',
        enum: ['正常', '禁用', '锁住', '已删除']
    },
    role: {
        // 账户类别
        type: String,
        default: 'admin',
        enum: ['admin', 'salesman']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Backstage', BackstageSchema);
