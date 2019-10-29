"use strict"
const qstr = require('../qtools/qstr');
const DataTypeLine = require('./dataTypeLine');

class DataTypeList extends DataTypeLine {

	constructor(label, extras = "") {
		super(label, extras);
		this.dataTypeIdCode = 'list';
	}

	validate() {
		if (!this.validationError) {
			const maximum = 2000;
			const currentLength = this.value.length

			if (currentLength > maximum) {
				this.validationError = true;
				this.baseValidationMessage = `is too long (${currentLength} characters), it may only be ${maximum} characters long`;
			}
		}

		return this.validationResponse();
	}


}

module.exports = DataTypeList