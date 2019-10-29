"use strict"
const qstr = require('../qtools/qstr');
const DataTypeLine = require('./dataTypeLine');

class DataTypeLongLine extends DataTypeLine {
	constructor(label, extras = "") {
		super(label, extras);
	}

	validate() {
		super.validate();
		return this.validationResponse();
	}

	//getNiceValue(item) {
	//  return '<span class="dataTypeLongLine">' + this.getValue(item) + '</span>';
	//}

}

module.exports = DataTypeLongLine;