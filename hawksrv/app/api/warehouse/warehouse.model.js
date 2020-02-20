const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const warehouseSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    warehouse: {
        type: [{
            name: {
                type: String,
                required: true
            },
            coding: {
                type: String,
                required: true
            },
            commodity: {
                type: [{
                    commodity: {
                        type: Object,
                        default: {}
                    },
                    realNumber: {
                        type: String,
                        default: ''
                    },
                    dropShipping: {
                        type: String,
                        default: ''
                    },
                    salesNumber: {
                        type: String,
                        default: ''
                    },
                    billNumber: {
                        type: Number,
                        default: ''
                    }
                }],
                default: []
            }
        }],
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('warehouse', warehouseSchema);

