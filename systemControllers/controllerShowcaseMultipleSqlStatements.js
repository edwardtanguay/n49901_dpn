"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');

class ControllerShowcaseMultipleSqlStatements extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        this.responseStatus = 'loaded';
        this.responseData = {};

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('showcaseBooks', `select * from showcaseBooks`);
        dpDataLoader.getRecordsWithSql('showcaseUsers', `select * from showcaseUsers`);
        const that = this;
        dpDataLoader.load(function (data) {
            that.responseData.showcaseBooks = data['showcaseBooks'];
            that.responseData.showcaseUsers = data['showcaseUsers'];
            that.sendResponse();
        });
    }

}

module.exports = ControllerShowcaseMultipleSqlStatements