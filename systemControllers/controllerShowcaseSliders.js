"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');

class ControllerShowcaseSliders extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		this.responseData.age = 41;
		this.sendResponse();
	}

}

module.exports = ControllerShowcaseSliders