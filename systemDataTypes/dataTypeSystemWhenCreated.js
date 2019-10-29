"use strict"
const qstr = require('../qtools/qstr');
const qdat = require('../qtools/qdat');
const DataTypeDateTime = require('./dataTypeDateTime');

class DataTypeSystemWhenCreated extends DataTypeDateTime {
    constructor(label, extras = "") {
        super(label, extras);
        this.kind = 'system';
        this.dataTypeIdCode = 'systemWhenCreated';
    }
    generatesAutomaticValueOnSave() {
        return true;
    }
    
    getAutomaticallyGeneratedValue() {
        return qdat.getCurrentDateTime();
    }
}

module.exports = DataTypeSystemWhenCreated;