const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const L = require('debug')('app:api');

const DeviceSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Device', DeviceSchema);
