const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const temp = require('./_temp').temp

const purchaseSelfTempSchema = new Schema({
    temp: {
        type: Object,
        default: temp
    },
    userId: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('purchaseSelfTemp', purchaseSelfTempSchema);
