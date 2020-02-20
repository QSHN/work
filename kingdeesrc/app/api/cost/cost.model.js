const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CostSchema = new Schema({
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
    costTypeId: {
        // 费用类型id
        type: ObjectId,
        required: true
    },
    costType: {
        // 费用类型
        type: String,
        required: true
    },
    unit: {
        // 计量单位
        type: String,
        default: ''
    },
    des: {
        // 备注
        type: String,
        default: ''
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cost', CostSchema);
