"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qdat = require('../qtools/qdat');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const config = require('../system/config');
const System = require('../system/system');

class ControllerHome extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		this.responseData.message = 'Welcome to this site';
		const version = config.dpnVersion();
		const niceVersion = qsys.convertVersionIdCodeToNiceVersion(version);
		this.responseData.niceVersion = niceVersion;

		qsys.currentUserData(this.request, userData => {
			this.responseData.userData = userData;
			this.sendResponse();
		});
	}
}

module.exports = ControllerHome