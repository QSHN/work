const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CustomerSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    groupId: {
        // 组Id
        type: ObjectId,
        default: null
    },
    code: {
        // 编码
        type: String,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    },
    levelId: {
        // 客户等级
        type: ObjectId
    },
    level: {
        // 客户等级
        type: String
    },
    credit: {
        // 信用额度
        type: Number
    },
    balanceDate: {
        // 余额日期
        type: Date
    },
    receivable: {
        // 期初应收款
        type: Number
    },
    payments: {
        // 期初预收款
        type: Number
    },
    taxpayers: {
        // 纳税人识别号
        type: String
    },
    bank: {
        // 开户银行
        type: String
    },
    bankAccount: {
        // 银行账号
        type: String
    },
    salesmanId: {
        // 销售人员
        type: ObjectId
    },
    address: {
        // 注册地址
        type: String
    },
    des: {
        // 备注
        type: String
    },
    list: {
        // 联系列表
        type: [{
            name: String,
            phone: Number,
            tel: String,
            other: String,
            address: String,
            isMain: Boolean
        }],
        default: []
    },
    status: {
        // 状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    },
    creator: {
        // 创建人
        type: ObjectId,
        required: true
    },
    subjectCode: {
        // 科目code
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
