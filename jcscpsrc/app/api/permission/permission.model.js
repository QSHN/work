const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const permission = require('./_permission').permission

const PermissionSchema = new Schema({
    groupId: {
        type: Number
    },
    userId: {
        type: ObjectId
    },
    expanded: {
        type: Array,
        default: permission.expanded
    },
    checked: {
        type: Array,
        default: permission.checked
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Permission', PermissionSchema);
