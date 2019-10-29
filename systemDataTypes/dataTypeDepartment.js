"use strict"
const qstr = require('../qtools/qstr');
const DataTypeLine = require('./dataTypeLine');

class DataTypeDepartment extends DataTypeLine {
    constructor(label, extras = "") {
        super(label, extras);
    }

    validate() {
        super.validate();
        return this.validationResponse();
    }
    
    //getNiceValue(item) {
    //  return '<span class="dataTypeDepartment">' + this.getValue(item) + '</span>';
    //}

}

module.exports = DataTypeDepartment;