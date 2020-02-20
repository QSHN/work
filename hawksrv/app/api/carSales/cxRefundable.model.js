const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CxRefundableSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    numberPlate: {
        type: String,
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
            returnPrice: {
                type: String,
                required: true
            },
            returnNumber: {
                type: Number,
                required: true
            },
            returnDes: {
                type: String,
                default: ''
            },
            swapNumber: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    allPrice: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        default: ''
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
    }
},{
    timestamps: true
});

module.exports = mongoose.model('CxRefundable', CxRefundableSchema);
