const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const AutomaticTransferSchema = new Schema({
    accountSetId: {
        // 账套号
        type: String,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    },
    mechanism: {
        // 机制凭证
        type: String,
        required: true,
        enum: ['否', '期末调汇', '结转损益', '自动转账']
    },
    period: {
        // 转账期间
        type: [],
        default: []
    },
    proofWordId: {
        // 凭证字id
        type: ObjectId,
        default: null
    },
    proofWords: {
        // 凭证字
        type: String,
        default: ''
    },
    child: {
        // 内容
        type: [{
            abstract: {
                // 凭证摘要
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
            mode: {
                // 方式
                type: String,
                default: null,
                enum: ['转入', '按比例转出余额', '按比例转出借方发生额', '按比例转出贷方发生额']
            },
            isPost: {
                // 包含本期未过账凭证
                type: Boolean,
                default: false,
            },
            accountingItem: {
                // 核算项目
                type: [],
                default: []
            }
        }],
        default: []
    },
    lastTime: {
        // 最近一次转账时间
        type: Date,
        default: null
    },
    lastMode: {
        // 最近一次转账方式
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AutomaticTransfer', AutomaticTransferSchema);
