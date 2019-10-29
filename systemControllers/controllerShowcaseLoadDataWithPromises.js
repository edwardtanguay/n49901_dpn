"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdat = require('../qtools/qdat');
const qdev = require('../qtools/qdev');
const qmat = require('../qtools/qmat');

class ControllerShowcaseLoadDataWithPromises extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadData() {
		const idCode = this.getValue('idCode');
		this.responseStatus = 'loaded';
		this.responseData = {};
		const theWait = qmat.getRandomNumber(200, 1888);
		qsys.sleep(theWait);
		this.responseData.message = `executed "${idCode}" at: ` + qdat.getCurrentDateTime() + ` taking ${theWait} milliseconds.`;
		this.sendResponse();
	}

}

module.exports = ControllerShowcaseLoadDataWithPromises