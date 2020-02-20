const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
// const permission = require('../../designDatabase/permission').permission

const UserPermissionSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    userId: ObjectId,
    groupId: ObjectId,
    permission: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserPermission', UserPermissionSchema);
