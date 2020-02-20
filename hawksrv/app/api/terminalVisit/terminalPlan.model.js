const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TerminalPlanSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    visitor: {
        type: ObjectId,
        required: true
    },
    planStartTime: {
        type: Date,
        required: true
    },
    planEndTime: {
        type: Date,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    client: {
        type: [],
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('TerminalPlan', TerminalPlanSchema);
