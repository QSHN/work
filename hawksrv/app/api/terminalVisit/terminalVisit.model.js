const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TerminalVisitSchema = new Schema({
    companyId: {
        type: ObjectId, //公司ID
        required: true
    },
    creator: {
        type: ObjectId,
        required: true
    },
    visitor: {
        type: ObjectId,
        required: true
    },
    visitType: {
        type: String,      //'计划拜访'，'临时拜访'
        required: true
    },
    status: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    client: {
        type: Object,
        required: true
    },
    task: {
        type: [],
        default: []
    },
    startVisit: {
        type: {
            time: Date,
            position: Object,
            photos: []
        },
        default:  null
    },
    endVisit: {
        type: {
            time: Date,
            position: Object,
            photos: []
        },
        default:  null
    },
    startTime: {
        type: Date,
        default: ''
    },
    endTime: {
        type: Date,
        default: ''
    },
    planId: {
        type: String,
        default: ''
    },
    lost: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

module.exports = mongoose.model('TerminalVisit', TerminalVisitSchema);
