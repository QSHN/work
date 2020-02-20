const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const FunPermissionSchema = new Schema({
    bClientId: {
        // 后台客户id
        type: ObjectId,
        required: true
    },
    permission: {
        // 权限
        type: [],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FunPermission', FunPermissionSchema);
