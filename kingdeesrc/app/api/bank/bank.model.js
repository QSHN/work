const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BankSchema = new Schema({
    accountSetId: {
        // 账套id
        type: String,
        required: true
    },
    bankId: {
        // 所属银行id
        type: String,
        default: ''
    },
    bank: {
        // 银行
        type: String,
        default: ''
    },
    province: {
        // 省
        type: String,
        default: ''
    },
    city: {
        // 城市
        type: String,
        default: ''
    },
    linkNumber : {
        // 联行号
        type: String,
        required: true
    },
    bankDeposit : {
        // 开户行
        type: String,
        required: true
    },
    address : {
        // 地址
        type: String,
        default: ''
    },
    status: {
        // 使用状态
        type: String,
        required: true,
        enum: ['启用', '禁用']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bank', BankSchema);
