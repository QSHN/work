const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ExchangeRateSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    typeId: {
        // 汇率类型
        type: ObjectId,
        required: true
    },
    currencyId: {
        // 币别id
        type: ObjectId,
        required: true
    },
    rate: {
        // 汇率
        type: Number,
        required: true
    },
    effectiveDate: {
        // 生效日期
        type: Date,
        required: true
    },
    expiryDate: {
        // 失效日期
        type: Date,
        required: true
    },
    auditId: {
        // 审核人Id
        type: ObjectId,
        default: null
    },
    status: {
        // 状态
        type: String,
        required: true,
        enum: ['启用', '禁用']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExchangeRate', ExchangeRateSchema);
