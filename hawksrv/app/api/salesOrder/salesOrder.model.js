const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const SalesOrderSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    warehouse: {
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
                type: String,
                required: true
            },
            giveNumber: {
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
    allPrice: {
        type: String,
        required: true
    },
    photos: {
        type: [],
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
    time: {
        type: Date,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    contactAddress: {
        type: String,
        required: true
    },
    receivable: {
        type: String,
        required: true
    },
    des: {
        type: String,
        default: ''
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
    shippingStatus: {
        type: Boolean,
        default: false
    },
    shipper: {
        type: String,
        default: ''
    },
    visitId: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);
