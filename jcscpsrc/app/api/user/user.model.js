const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new Schema({
    account: {
        // 账号(手机号)
        type: String,
        required: true,
        unique: true
    },
    phone: {
        // 手机号
        type: String
    },
    hash: {
        // 密码
        type: String
    },
    passErr: {
        // 密码错误次数
        type: Number,
        default: 0
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
    role: {
        // 角色
        type: String,
        default: 'company',
        enum: ['admin', 'company', 'client']
    },
    name: {
        // 姓名
        type: String
    },
    job: {
        // 职位(公司账号)
        type: String
    },
    gender: {
        // 性别
        type: String,
        default: '男',
        enum: ['男', '女']
    },
    loginTime: {
        // 登录时间
        type: Date,
    },
    customerBelongs: {
        // 客户归属
        type: [ObjectId]
    },
    employeeSuperior: {
        // 员工上级
        type: [ObjectId]
    },
    customCustomer: {
        // 自定义客户资料字段
        type: [],
        default: []
    },
    customEmployee: {
        // 自定义员工资料字段
        type: [],
        default: []
    },
    infoCode: {
        // 关联资料code
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
