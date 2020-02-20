const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TerminalCircuitSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    des: {
        type: String,
        default: ''
    },
    client: {
        type: [],
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('TerminalCircuit', TerminalCircuitSchema);
