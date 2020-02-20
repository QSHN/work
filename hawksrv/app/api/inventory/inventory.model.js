const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const commoditySchema = new Schema({
    commodity: {
        type: Object,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    des: {
        type: String,
        default: ''
    }
})

const InventorySchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    commodity: {
        type: [commoditySchema],
        required: true
    },
    photos: {
        type: [],
        default: []
    },
    des: {
        type: String,
        default: ''
    },
    coding: {
        type: String,
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    visitId: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Inventory', InventorySchema);
