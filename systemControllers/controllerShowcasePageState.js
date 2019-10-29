"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');

class ControllerShowcasePageState extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		const that = this;
		qsys.currentUserData(this.request, function (userData) {
			const sqlStatement = `SELECT * FROM showcaseUsers`;
			const dpDataLoader = new DpDataLoader();
			dpDataLoader.getRecordsWithSql('records', sqlStatement);
			dpDataLoader.load(function (data) {
				if (qsys.isSqliteError(data)) {
					that.responseData.records = [];
				} else {
					const records = data['records'];
					that.responseData.records = records;
				}
				that.responseData.userIsDeveloper = qstr.atLeastOneTermMatchesInLists('developers', userData.accessGroups);
				that.sendResponse();
			});
		});
	}

}

module.exports = ControllerShowcasePageState