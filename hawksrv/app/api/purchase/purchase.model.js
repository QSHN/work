const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PurchaseSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    coding: {
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
            realNumber: {
                type: Number,
                required: true
            },
            number: {
                type: Number,
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
    allPrice: {
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

module.exports = mongoose.model('Purchase', PurchaseSchema);
