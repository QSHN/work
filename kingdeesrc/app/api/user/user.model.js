const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
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
    name: {
        // 用户名
        type: String,
        required: true
    },
    uuid: {
        // 用户唯一标识符
        type: String
    },
    accountStatus: {
        // 账号状态
        type: String,
        default: '正常',
        enum: ['正常', '禁用', '锁住', '已删除']
    },
    accountType: {
        // 账户类别
        type: String,
        default: '总账户',
        enum: ['总账户', '套账账户']
    },
    role: {
        // 账户类别
        type: String,
        default: 'admin',
        enum: ['admin', 'accountSet']
    },
    useAccountSet: {
        // 当前用户最近使用的账套
        type: ObjectId
    },
    companyId: {
        // 公司id
        type: ObjectId,
        required: true
    },
    loginTime: {
        // 登录时间
        type: Date,
    },
    group: {
        // 用户组，
        type: [],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
