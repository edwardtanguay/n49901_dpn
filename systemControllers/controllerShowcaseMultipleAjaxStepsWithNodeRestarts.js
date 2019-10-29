"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const ShowcaseBook = require('../systemItems/showcaseBook');
const DynamicFile = require('../systemClasses/dynamicFile');
const System = require('../system/system');
const SmartItemType = require('../systemClasses/smartItemType');

class ControllerShowcaseMultipleAjaxStepsWithNodeRestarts extends Controller {
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

    action_createItemType() {
        console.log(`createItemType...`);
        const itemTypeDefinitionBlock = `** Test Large Items
Title
Message
Number Of Errors;wn`;

        const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
        const that = this;
        smartItemType.delete(); // change this to create for testing
        this.sendResponse();
    }

    action_creatingPage() {
        console.log(`creating...`);
        const pageBuilder = System.instantiatePageBuilder('Test 333', 'textParser', 'system', {});
        pageBuilder.buildNow();
        this.sendResponse();
    }

    action_deletingPage() {
        console.log(`deleting...`);
        const pageBuilder = System.instantiatePageBuilder('Test 333', 'textParser', 'system', {});
        pageBuilder.delete();
        this.sendResponse();
    }

}

module.exports = ControllerShowcaseMultipleAjaxStepsWithNodeRestarts