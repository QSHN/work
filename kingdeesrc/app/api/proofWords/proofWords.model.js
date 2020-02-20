const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ProofWordsSchema = new Schema({
    accountSetId: {
        // 账套id
        type: String,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    },
    printTitle: {
        // 打印标题
        type: String,
        default: '记账凭证'
    },
    defaultValue: {
        // 默认值
        type: String,
        default: '否',
        enum: ['否', '是']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProofWords', ProofWordsSchema);
