"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const System = require('../system/system');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerDeletePage extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    customFormValidation(field, errors) {
        // if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
        //     this.addFormError(field, 'should not contain a period character');
        // }
    }

    action_loadPageData() {
        this.responseData = {
            fields: {
                title: {
                    label: 'Title',
                    dataTypeIdCode: 'line',
                    value: '',
                    info: '',
                    example: 'Create Quarterly Report',
                    required: true,
                    errorStatus: '',
                    errorMessage: '',
                    displayStatus: 'show',
                    choicesList: '',
                    choiceSelector: ''
                }
            }
        };
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {
            const title = this.requestData.fields.title.value;
            const type = 'editItem'; // TODO: get from pageItems
            const kind = 'system'; // TODO: get from pageItems
            const pageBuilder = System.instantiatePageBuilder(title, type, kind, {});
            pageBuilder.delete();
            this.formStatus = 'success';
            this.formMessage = `The page <b>${pageBuilder.title}</b> was deleted: <a href="deletePage">refresh menu</a>`;
            //this.requestData.fields.title.value = '';
            this.sendResponse();            
        }
    }

}

module.exports = ControllerDeletePage