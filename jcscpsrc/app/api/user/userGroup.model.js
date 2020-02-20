const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserGroupSchema = new Schema({
    customer: {
        type: [],
        default: []
    },
    employee: {
        type: [],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserGroup', UserGroupSchema);
