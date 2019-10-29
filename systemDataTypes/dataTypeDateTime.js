"use strict"
const qstr = require('../qtools/qstr');
const DataTypeLine = require('./dataTypeLine');

class DataTypeDateTime extends DataTypeLine {
    constructor(label, extras = "") {
        super(label, extras);
        this.dataTypeIdCode = 'dateTime';
    }
}

module.exports = DataTypeDateTime;