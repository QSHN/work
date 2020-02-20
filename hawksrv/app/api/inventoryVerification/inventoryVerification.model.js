const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const InventoryVerificationSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    inventoryType: {
        type: String,
        required: true
    },
    warehouse: {
        type: String,
        required: true
    },
    operator: {
        type: String,
        required: true
    },
    coding: {
        type: String,
        required: true
    },
    commodity: {
        type: [{
            commodity: {
                type: Object,
                required: true
            },
            realNumber: {
                type: String,
                required: true
            },
            number: {
                type: String,
                required: true
            },
            des: {
                type: String,
                default: ''
            }
        }],
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
    }
},{
    timestamps: true
});

module.exports = mongoose.model('InventoryVerification', InventoryVerificationSchema);
