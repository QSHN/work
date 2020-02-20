const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const FreightSpaceGroupSchema = new Schema({
    accountSetId: {
        // 账套id
        type: ObjectId,
        required: true
    },
    code: {
        // 仓位组编码
        type: String,
        required: true
    },
    name: {
        // 仓位组名称
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FreightSpaceGroup', FreightSpaceGroupSchema);
