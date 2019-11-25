"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const DqlDataLoader = require('../systemClasses/dqlDataLoader');
var md5 = require('md5');
const DynamicFile = require('../systemClasses/dynamicFile');

class ControllerLogin extends Controller {
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
*Login
*Password       
        `;
		this.responseData = {};

		this.prepareFields();
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const login = this.getFieldValue('login');
			const password = this.getFieldValue('password');

			const toCheckLogin = login.toLowerCase();

			const dqlStatements = [
				`load_user(login="${qsys.protectSqlVariable(toCheckLogin)}" AND password="${md5(qsys.protectSqlVariable(password))}")`
			];
			const dqlDataLoader = new DqlDataLoader(dqlStatements);
			const that = this;
			dqlDataLoader.load(function (data) {

				if (data.user === undefined) {
					that.formStatus = 'error';
					that.formMessage = `Login was unsuccessful. Please try again.`;
				} else {
					that.formStatus = 'userIsLoggedIn';
					qsys.setCurrentUserIdCode(that.request, data.user.login);

					//when developer is logged in, we need him logged in by default so that when a file changes, the server restarts, and the developer is still logged in
					if (qsys.siteLocation() == 'offline' && data.user.login == 'dev') {
						const dynamicPage = new DynamicFile('system/config_developer.js');
						dynamicPage.changeMarkerLineAndSave('defaultUserIdCode', "return 'dev';");
					}

				}
				that.sendResponse();
			});
		}
	}

}

module.exports = ControllerLogin