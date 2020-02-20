const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const RefundRegistrationSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    receivable: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    coding: {
        type: String,
        required: true
    },
    operator: {
        type: ObjectId,
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

module.exports = mongoose.model('RefundRegistration', RefundRegistrationSchema);
