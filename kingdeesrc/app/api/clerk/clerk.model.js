const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ClerkSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    groupId: {
        // 部门
        type: ObjectId
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
    gender: {
        // 性别
        type: String
    },
    phone: {
        // 电话
        type: Number
    },
    status: {
        // 状态
        type: String,
        default: '启用',
        enum: ['启用', '禁用']
    },
    creator: {
        // 创建人
        type: ObjectId,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Clerk', ClerkSchema);
