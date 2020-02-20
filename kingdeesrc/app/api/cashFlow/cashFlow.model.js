const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CashFlowSchema = new Schema({
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
    pFirstId: {
        // 第一级id
        type: ObjectId,
        default: null
    },
    pSecondId: {
        // 第二级id
        type: ObjectId,
        default: null
    },
    audit: {
        // 审核人
        type: ObjectId,
        default: null
    },
    creator: {
        // 创建人
        type: ObjectId,
        default: null
    },
    editor: {
        // 修改人
        type: ObjectId,
        default: null
    },
    editTime: {
        // 修改时间
        type: Date,
        default: null
    },
    statusTime: {
        // 状态修改时间
        type: Date,
        default: null
    },
    statusId: {
        // 状态修改人
        type: ObjectId,
        default: null
    },
    status: {
        // 状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    },
    isEdit: {
        // 是否可更改code和name
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CashFlow', CashFlowSchema);
