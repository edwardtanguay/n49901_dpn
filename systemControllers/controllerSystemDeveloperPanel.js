"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qarr = require('../qtools/qarr');
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

			const pageItemObjects = System.instantiateItemObjectsWithRecords('pageItems', data.pageItems);
			const developerMainPageItems = qarr.multisort(pageItemObjects.filter(item => item.menu == 'developerMain'), ['displayOrder'], ['asc']);
			const developerManagePageItems = qarr.multisort(pageItemObjects.filter(item => item.menu == 'developerManage'), ['displayOrder'], ['asc']);
			const developerShowcasePageItems = qarr.multisort(pageItemObjects.filter(item => item.menu == 'developerShowcase'), ['displayOrder'], ['asc']);

			this.responseData.pageItems = pageItemObjects;
			this.responseData.developerMainPageItems = developerMainPageItems;
			this.responseData.developerManagePageItems = developerManagePageItems;
			this.responseData.developerShowcasePageItems = developerShowcasePageItems;
			qsys.sleep(1000);
			qsys.currentUserData(this.request, userData => {
				this.responseData.userData = userData;
				this.sendResponse();
			});
		});
	}

}

module.exports = ControllerSystemDeveloperPanel