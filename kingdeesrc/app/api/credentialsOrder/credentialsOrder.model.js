const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CredentialsOrderSchema = new Schema({
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
    proofWordId: {
        // 凭证字
        type: ObjectId,
        required: true
    },
    dateTime: {
        type: String,
        default: '单据日期',
        enum: ['单据日期', '系统日期']
    },
    filesType: {
        type: String,
        default: '业务单据数',
        enum: ['业务单据数', '单据附件数']
    },
    des: String,
    orderType: String,
    list: {
        type: [{
            subjectForm: String,
            subjectCode: String,
            balance: {
                type: String,
                enum: ['借', '贷']
            },
            number: {
                type: String,
                enum: ['无', '商品数量']
            },
            price: {
                type: String,
                enum: ['无', '商品单价']
            },
            rate: Number,
            money: String
        }],
        required: true
    },
    category: String,
    creator: ObjectId,
    status: Boolean,
    isDefault: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('CredentialsOrder', CredentialsOrderSchema);
