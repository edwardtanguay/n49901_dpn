"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdat = require('../qtools/qdat');
const qdev = require('../qtools/qdev');
const qmat = require('../qtools/qmat');

class ControllerShowcaseLoadFromMultipleDataSources extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadData() {
		const idCode = this.getValue('idCode');
		this.responseStatus = 'loaded';
		this.responseData = {};
		const theWait = qmat.getRandomNumber(200, 555);
		qsys.sleep(theWait);
		this.responseData.message = `executed "${idCode}" at: ` + qdat.getCurrentDateTime() + ` taking ${theWait} milliseconds.`;
		this.sendResponse();
	}

	action_getVerb() {
		qsys.sleep(500);
		this.responseStatus = 'loaded';
		this.responseData = {};
		this.responseData.verbObject = {
			name: 'ecrire',
			present: {
				firstPerson: 'ecris',
				secondPerson: 'ecris',
				thirdPerson: 'ecrit'
			}
		};
		this.sendResponse();
	}
	action_getHeadlines() {
		qsys.sleep(500);
		this.sendResponse();
	}
	action_getDirectoryInfo() {
		qsys.sleep(500);
		this.sendResponse();
	}
	action_getPageItemInfo() {
		qsys.sleep(500);
		this.sendResponse();
	}
	action_getExcelData() {
		qsys.sleep(500);
		this.sendResponse();
	}

}

module.exports = ControllerShowcaseLoadFromMultipleDataSources