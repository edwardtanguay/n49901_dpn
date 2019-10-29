"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const config = require('../system/config');
const DynamicFile = require('../systemClasses/dynamicFile');

class ControllerLogout extends Controller {
	constructor(request, response) {
		super(request, response);
	}


	customFormValidation(field, errors) {
		// if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
		//     this.addFormError(field, 'should not contain a period character');
		// }
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.formTypeDefinitionFieldBlock = `
Dummy Info       
        `;
		this.responseData = {};

		this.prepareFields();
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();

		const currentUserIdCode = qsys.getCurrentUserIdCode(this.request);
		if (config.developing()) {
			qsys.logLocalDevUserOut();
		} else {
			qsys.setCurrentUserIdCode(this.request, 'anonymousUser');
		}
		this.sendResponse();
	}

}

module.exports = ControllerLogout