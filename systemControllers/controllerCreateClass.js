"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const SmartText = require('../systemClasses/smartText');
const ClassBuilder = require('../systemBuilders/classBuilder');


class ControllerCreateClass extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    customFormValidation(field, errors) {
        if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
            this.addFormError(field, 'should not contain a period character');
        }
        if (field.idCode == 'title' && qstr.contains(field.value, ',')) {
            this.addFormError(field, 'should not contain a comma');
        }
    }
 
    action_loadPageData() {
        this.responseStatus = 'loaded';
        this.formTypeDefinitionFieldBlock = `
Class Name; line; $example = SmartFile; $required
Directory; choice; $choices = customClasses, system, systemBuilders, systemClasses*, systemFactories, systemTextParsers, systemDataTypes, systemSiteGenerators; $required
Scope; choice; $choices = Single, Inherited
Example Code; p
        `;
        this.responseData = {};
        this.prepareFields();
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const className = this.requestData.fields.className.value;
            const directory = this.requestData.fields.directory.value;
            const scope = this.requestData.fields.scope.value;

            const classBuilder = new ClassBuilder(className, directory, scope, {});
            classBuilder.buildNow();
            const exampleCode = classBuilder.exampleCode;

            this.requestData.fields.exampleCode.value = exampleCode;
            
            this.formStatus = 'success';
            this.formMessage = `The class <b>${className}</b> was created. Copy code below to use the class.`;

            this.sendResponse();
        }
    }


}

module.exports = ControllerCreateClass