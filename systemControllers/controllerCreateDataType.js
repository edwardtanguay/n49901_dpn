"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const DataTypeBuilder = require('../systemClasses/dataTypeBuilder');

class ControllerCreateDataType extends Controller {
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
        this.formTypeDefinitionFieldBlock = `
*Name;$example=Password
Inherit From Data Type;$example=line  
        `;
        this.responseData = {};

        this.prepareFields();
        this.responseData.fields.inheritFromDataType.value = `line`;
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const name = this.getFieldValue('name');
            const inheritFromDataType = this.getFieldValue('inheritFromDataType');

            const dataTypeBuilder = new DataTypeBuilder(name, inheritFromDataType);

            dataTypeBuilder.buildNow();

            this.formStatus = 'success';
            this.formMessage = `DataType <b>${name}</b> has been created.`;

            this.sendResponse();

        }
    }

}

module.exports = ControllerCreateDataType