"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');

class ControllerShowcaseMobileDevelopment extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        this.responseStatus = 'loaded';
        this.responseData = {};

        const sqlStatement = `SELECT id,title,author FROM showcaseBooks ORDER BY id DESC`;

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('records', sqlStatement);
        const that = this;
        dpDataLoader.load(function (data) {
            if (qsys.isSqliteError(data)) {
                that.responseData.records = [];
            } else {
                const records = data['records'];
                that.responseData.records = records;
            }
            that.sendResponse();
        });
    }

}

module.exports = ControllerShowcaseMobileDevelopment