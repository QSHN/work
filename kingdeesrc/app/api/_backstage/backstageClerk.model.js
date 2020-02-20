const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BackstageClerkSchema = new Schema({
    name: {
        // 名称
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BackstageClerk', BackstageClerkSchema);
