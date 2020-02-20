const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const SupplierGroupSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    name: {
        // 名称
        type: String,
        required: true
    },
    parentIds: {
        // 父级ids
        type: [ObjectId],
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SupplierGroup', SupplierGroupSchema);
