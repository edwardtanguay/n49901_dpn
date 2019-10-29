"use strict"
const qstr = require('../qtools/qstr');
const DataTypeLine = require('./dataTypeLine');

class DataTypeIdCode extends DataTypeLine {
    constructor(label, extras = "") {
        super(label, extras);
    }
}

module.exports = DataTypeIdCode;