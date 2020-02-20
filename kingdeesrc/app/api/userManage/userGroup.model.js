const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserGroupSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    name: {
        // 用户组名称
        type: String,
        required: true
    },
    explain: {
        // 说明
        type: String,
        default: ''
    },
    isDelete: {
        // 是否可以删除修改
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserGroup', UserGroupSchema);
