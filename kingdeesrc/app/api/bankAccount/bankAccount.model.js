const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BankAccountSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
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
    accountName: {
        // 开户名
        type: String
    },
    bankAccount: {
        // 银行账号
        type: String
    },
    currency: {
        // 币别
        type: String
    },
    openingBank: {
        // 开户行
        type: String
    },
    des: {
        // 备注
        type: String,
        default: ''
    },
    status: {
        // 状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    },
    subjectCode: {
        // 科目code
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);
