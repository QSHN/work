const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CxBackSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    numberPlate: {
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
            realNumber: {
                type: Number,
                default: 0
            },
            returnNumber: {
                type: Number,
                default: 0
            },
            swapNumber: {
                type: Number,
                default: 0
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
    backType: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('CxBack', CxBackSchema);
