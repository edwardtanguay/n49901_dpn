"use strict"
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const DataTypeLine = require('./dataTypeLine');

class DataTypeSystemWhoCreated extends DataTypeLine {
    constructor(label, extras = "") {
        super(label, extras);
        this.kind = 'system';
        this.dataTypeIdCode = 'systemWhoCreated';
    }
    generatesAutomaticValueOnSave() {
        return true;
    }
    
    getAutomaticallyGeneratedValue() {
        return qsys.getCurrentUserIdCode(this.request);
    }
}

module.exports = DataTypeSystemWhoCreated;