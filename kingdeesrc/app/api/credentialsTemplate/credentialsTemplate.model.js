const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CredentialsTemplateSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    name: {
        // 模式凭证名字
        type: String,
        required: true
    },
    child: {
        // 数据
        type: [{
            abstract: {
                // 摘要
                type: String,
                default: ''
            },
            subjectCode: {
                // 科目code
                type: String,
                required: true
            },
            subject: {
                // 科目
                type: String,
                required: true
            },
            currency: {
                // 币别
                type: String,
                default: ''
            },
            rateType: {
                // 汇率类型
                type: String,
                default: ''
            },
            rate: {
                // 公司汇率
                type: Number,
                default: null
            },
            currencyAmount: {
                // 原币金额
                type: Number,
                default: null
            },
            unit: {
                // 单位
                type: String,
                default: ''
            },
            number: {
                // 数量
                type: Number,
                default: null
            },
            price: {
                // 单价
                type: Number,
                default: null
            },
            borrower: {
                // 借方
                type: Number,
                default: null
            },
            lender: {
                // 贷方
                type: Number,
                default: null
            }
        }],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CredentialsTemplate', CredentialsTemplateSchema);
