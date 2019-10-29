"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseFormToEditDatabase extends Controller {
    constructor(request, response) {
        super(request, response);
    }


    customFormValidation(field, errors) {
        // if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
        //     this.addFormError(field, 'should not contain a period character');
        // }
    }

    action_loadPageData() {
        this.responseStatus = 'loaded';
        this.responseData = {
            fields: {
                title: {
                    label: 'Title',
                    dataTypeIdCode: 'line',
                    value: '',
                    info: 'Enter the title of the report.',
                    example: '',
                    required: true,
                    errorStatus: '',
                    errorMessage: '',
                    displayStatus: 'show',
                    choices: '',
                    choiceSelector: ''
                },
                numberOfPages: {
                    label: 'Number of Pages',
                    dataTypeIdCode: 'numberOfPages',
                    value: '',
                    info: 'The number of pages in the report.',
                    example: '',
                    required: true,
                    errorStatus: '',
                    errorMessage: '',
                    displayStatus: 'show',
                    choices: '',
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


            this.sendResponse();
        }
    }

}

module.exports = ControllerShowcaseFormToEditDatabase