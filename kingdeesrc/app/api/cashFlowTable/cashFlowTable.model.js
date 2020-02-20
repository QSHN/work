const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const cashTable = require('../../designDatabase/cashFlowTable').cashTable

const CashFlowTableSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    table: {
        // 现金流量表
        type: [],
        default: cashTable
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CashFlowTable', CashFlowTableSchema);
