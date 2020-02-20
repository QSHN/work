const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const FeeDiscountSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    feeSubjectCode: {
        type: String,
        default: null
    },
    discountSubjectCode: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FeeDiscount', FeeDiscountSchema);