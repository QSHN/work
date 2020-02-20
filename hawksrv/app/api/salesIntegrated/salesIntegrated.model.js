const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const SalesIntegratedSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    commodity: {
        type: [{
            commodity: {
                type: Object,
                required: true
            },
            price: {
                type: String,
                required: true
            },
            number: {
                type: Number,
                default: 0
            },
            inventory: {
                type: Number,
                default: 0
            },
            des: {
                type: String,
                default: ''
            }
        }],
        required: true
    },
    photos: {
        type: [],
        required: true
    },
    des: {
        type: String,
        default: ''
    },
    approver: {
        type: [{
            uid: {
                type: ObjectId,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                default: ''
            }
        }],
        required: true
    },
    status: {
        type: String,
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    coding: {
        type: String,
        required: true
    },
    visitId: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

module.exports = mongoose.model('SalesIntegrated', SalesIntegratedSchema);
