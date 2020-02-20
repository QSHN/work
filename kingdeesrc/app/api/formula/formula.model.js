const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const assets = require('../../designDatabase/reportFormula').assets
const profit = require('../../designDatabase/reportFormula').profit
const ownerEquity = require('../../designDatabase/reportFormula').ownerEquity
const cash = require('../../designDatabase/reportFormula').cash
const department = require('../../designDatabase/reportFormula').department


const FormulaSchema = new Schema({
    accountSetId: {
        // 账套id
        type: String,
        required: true
    },
    assets: {
        type: Array,
        default: assets
    },
    profit: {
        type: Array,
        default: profit
    },
    ownerEquity: {
        type: Array,
        default: ownerEquity
    },
    cash: {
        type: Array,
        default: cash
    },
    department: {
        type: Array,
        default: department
    },
    custom: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('Formula', FormulaSchema);
