const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ClearingFormSchema = new Schema({
    accountSetId: {
        // 账套id
        type: String,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ClearingForm', ClearingFormSchema);
