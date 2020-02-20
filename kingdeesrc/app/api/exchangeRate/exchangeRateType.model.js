const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ExchangeRateTypeSchema = new Schema({
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
    rate: {
        // 汇率精度
        type: Number,
        required: true
    },
    des: {
        // 备注
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExchangeRateType', ExchangeRateTypeSchema);
