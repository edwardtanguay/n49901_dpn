"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const ShowcaseBook = require('../systemItems/showcaseBook');
const DynamicFile = require('../systemClasses/dynamicFile');

class ControllerShowcaseMultipleAjaxSteps extends Controller {
    constructor(request, response) {
        super(request, response);
        this.timesExecuted = 0;
    }


    customFormValidation(field, errors) {
        // if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
        //     this.addFormError(field, 'should not contain a period character');
        // }
    }

    action_loadPageData() {
        this.responseStatus = 'loaded';
        this.formTypeDefinitionFieldBlock = `
       
        `;
        this.responseData = {};

        this.prepareFields();
        //this.responseData.fields.title.value = `putDefaultValueHere`;
        this.sendResponse();
    }

    action_checkingForSpace() {
        console.log(`checking for space...`);
        qsys.sleep(4000);
        this.sendResponse();
    }

    action_preparingForCopying() {
        console.log(`preparing for copying...`);
        qsys.sleep(3000);
        this.sendResponse();
    }

    action_copyingFiles() {
        console.log(`copying files...`);
        qsys.sleep(6000);
        this.sendResponse();
    }

}

module.exports = ControllerShowcaseMultipleAjaxSteps