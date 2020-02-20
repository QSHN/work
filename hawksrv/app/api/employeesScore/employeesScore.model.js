const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const EmployeesScoreSchema = new Schema({
    companyId: {
        type: ObjectId,
        required: true
    },
    employeesId: {
        type: ObjectId,
        required: true
    },
    score: {
        type: [{
            time: String,
            score: String,
            comment: String,
            leader: [{
                leaderId: ObjectId,
                leaderComment: String,
                leaderScore: String
            }]
        }],
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('EmployeesScore', EmployeesScoreSchema);
