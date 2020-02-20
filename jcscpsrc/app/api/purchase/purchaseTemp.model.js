const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const temp = require('./_temp').temp

const PurchaseTempSchema = new Schema({
    temp: {
        type: Object,
        default: temp
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseTemp', PurchaseTempSchema);
