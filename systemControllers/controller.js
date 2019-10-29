"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const qsys = require('../qtools/qsys');
const system = require('../system/system');
const _ = require('lodash');
const FormType = require('../systemClasses/smartFormType');

class Controller {
	constructor(request, response) {
		this.request = request;
		this.response = response;
		this.requestData = this.request.body;
		this.responseData = {};
		this.responseHasBeenSent = false;
		this.action = this.requestData.action;
		this.actionMethodName = 'action_' + this.action
		this.formStatus = 'ok';
		this.formMessage = '';
		this.formErrors = [];
		//this.disallowUserIfNotAllowed(); //TODO: protect controllers based on accessGroups
	}

	process() {
		this[this.actionMethodName]();
	}

	disallowUserIfNotAllowed() {
		if (!this.userIsLoggedIn()) {
			this.responseData = {
				processStatus: 'error'
			};
			this.sendResponse();
		}
	}

	setDataInFields(idCode, property, value) {
		//this.responseData.fields[idCode][property] = value; //this works without lodash, but has no error checking
		const field = `fields.${idCode}.${property}`;
		_.set(this.responseData, field, value)
	}

	addFormError(field, message) {
		this.formErrors.push(`The field ${field.label.toUpperCase()} ${message}.`);
		this.setDataInFields(field.idCode, 'errorMessage', `This value ${message}.`);
	}

	validateForm() {
		this.responseData.fields = this.requestData.fields;
		this.formStatus = 'ok';
		this.formMessage = '';
		for (const key in this.responseData.fields) {
			const field = this.responseData.fields[key];
			field.idCode = key;

			this.setDataInFields(field.idCode, 'errorMessage', '');
			// DATATYPE VALIDATION
			const dataType = system.instantiateDataType_withField(field);
			dataType.label = field.label;
			dataType.required = field.required;
			const validationResponse = dataType.validate();
			if (!validationResponse.valid) {
				this.addFormError(field, validationResponse.baseValidationMessage);
			}

			this.customFormValidation(field, this.formErrors);

		}
		if (this.formErrors.length > 0) {
			this.formStatus = 'invalid';
			this.formMessage = this.formErrors.join(' ');
		}
		if (this.formStatus != 'ok') {
			this.sendResponse();
		}
		return this.formErrors.length == 0;
	}

	customFormValidation(field, errors) {
		//override as necessary
	}

	// e.g. ("title", "line", value)
	validateAsDataType(idCode, dataTypeIdCode, value) {
		const dataType = system.instantiateDataType_forValidation(dataTypeIdCode, value);
		const validationResponse = dataType.validate();
		if (!validationResponse.valid) {
			this.responseFieldErrors.push({
				idCode: idCode,
				message: validationResponse.validationMessage
			});
		}
	}

	validateAsNotEmpty(idCode, value) {
		if (qstr.isEmpty(value)) {
			this.responseFieldErrors.push({
				idCode: idCode,
				message: `Value cannot be empty.`
			});
		}
	}

	setFocusedField() {
		let r = '';
		for (const idCode in this.responseData.fields) {
			const field = this.responseData.fields[idCode];
			if (r == '' && field.displayStatus == 'show' && field.dataTypeIdCode != 'choice') {
				r = idCode;
			}
			if (field.errorMessage != '') {
				r = idCode;
				break;
			}
		}
		return r;
	}

	sendResponse() {
		const formFocusedFieldIdCode = this.setFocusedField();
		const responseObject = {
			formStatus: this.formStatus,
			formMessage: this.formMessage,
			formFocusedFieldIdCode: formFocusedFieldIdCode,
			data: this.responseData
		};

		responseObject.formMessage = qstr.protectStringForHtmlInjection(responseObject.formMessage);

		if (!this.responseHasBeenSent) {
			this.response.send(JSON.stringify(responseObject));
			this.responseHasBeenSent = true;
		}
	}

	userIsLoggedIn() {
		return qsys.userIsCurrentlyLoggedIn(this.request);
	}

	prepareFields() {
		if (!this.responseData.fields) {
			const formType = new FormType(this.formTypeDefinitionFieldBlock);
			this.responseData.fields = formType.getFields();
		} else {
			for (const idCode in this.responseData.fields) {
				const field = this.responseData.fields[idCode];
				if (field.dataTypeIdCode == 'choice') {
					field.choices = qstr.convertChoicesListToChoices(field.choicesList);
				}
			}
		}

	}

	getFieldValue(fieldIdCode) {
		return this.requestData.fields[fieldIdCode].value;
	}

	getValue(idCode) {
		return this.requestData[idCode];
	}



}

module.exports = Controller