const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const PurchaseContractSchema = new Schema({
    temp: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: '未审核',
        enum: ['未审核', '已审核']
    },
    files: {
        type: Array,
        default: []
    },
    creator: {
        type: ObjectId
    },
    auditor: {
        type: ObjectId
    },
    unAuditor: {
        type: ObjectId
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseContract', PurchaseContractSchema);
