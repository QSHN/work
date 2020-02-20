const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const CxInventorySchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    inventory: {
        type: [{
            numberPlate: {
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
                        type: Number,
                        default: 0
                    },
                    salesNumber: {
                        type: Number,
                        default: 0
                    },
                    returnNumber: {
                        type: Number,
                        default: 0
                    },
                    swapNumber: {
                        type: Number,
                        default: 0
                    }
                }],
                default: []
            }
        }],
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('CxInventory', CxInventorySchema);
