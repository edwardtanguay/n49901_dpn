"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const DataType = require('./dataType');

class DataTypeWholeNumber extends DataType {
	constructor(label, extras = "") {
		super(label, extras);
		this.baseSetup();
		this.topLimit = 999999999999999;
	}
	getCreateStatementChunk() {
		return `${this.idCode} INTEGER NOT NULL`;
	}

	validate() {

		super.validate();
		if (!this.validationError) {

			if (!qstr.isInteger(this.value)) {
				this.validationError = true;
				this.baseValidationMessage = 'must be a whole number';
			}

			if (this.value > this.topLimit) {
				this.validationError = true;
				this.baseValidationMessage = 'cannot be higher than ' + this.topLimit;
			}

			if (this.value < 0) {
				this.validationError = true;
				this.baseValidationMessage = 'cannot be below zero';
			}
		}
		this.allowIfNotRequiredAndBlank();
		return this.validationResponse();
	}

	getFieldCodeText_formControl() {
		return `<input id="field_${this.idCode}" :disabled="pageStatus=='busy'" v-on:keyup.enter="onEnterClick()"
                                    @keydown="keyWasPressed" @keyup="keyWasPressed" v-model="fields.${this.idCode}.value"
                                    class="form-control dataType_${this.dataTypeIdCode}_control" />`;
	}

	getSqliteTableCreationCommand() {
		return `${this.idCode} INTEGER`;
	}

	getNiceValue(item) {
		if (this.getIntegerValue(item) < 0) {
			return '<span class="dataTypeWholeNumber_minus">' + this.getValue(item) + '</span>';
		} else {
			return this.getValue(item);
		}
	}
}

module.exports = DataTypeWholeNumber;