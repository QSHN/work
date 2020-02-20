const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CurrencySchema = new Schema({
    accountSetId: {
        // 账套号
        type: String,
        required: true
    },
    code: {
        // 币别编码
        type: String,
        required: true
    },
    name: {
        // 币别名称
        type: String,
        required: true
    },
    rate: {
        // 记账汇率
        type: Number,
        required: true
    },
    convert: {
        // 折算方式
        type: String,
        required: true,
        enum: ['multi', 'divide']
    },
    float: {
        // 金额小数位数
        type: Number,
        required: true
    },
    isEdit: {
        type: Boolean,
        default: true
    },
    status: {
        // 使用状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Currency', CurrencySchema);
