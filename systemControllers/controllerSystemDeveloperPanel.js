"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerSystemDeveloperPanel extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPanelData() {
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('pageItems', 'select * from pageItems');
		dpDataLoader.load(data => {


			this.responseData.pageItems = data.pageItems;

			qsys.currentUserData(this.request, userData => {
				this.responseData.userData = userData;
				this.sendResponse();
			});
		});
	}

}

module.exports = ControllerSystemDeveloperPanel