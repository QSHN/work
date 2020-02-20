const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const commodityLabelSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    groupId: {
        // 商品标签组
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
    des: {
        // 备注
        type: String
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

module.exports = mongoose.model('commodityLabel', commodityLabelSchema);
