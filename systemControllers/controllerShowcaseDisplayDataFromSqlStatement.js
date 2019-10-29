"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseDisplayDataFromSqlStatement extends Controller {
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
Sql Statement;p       
        `;
        this.responseData = {};

        this.prepareFields();

        this.responseData.fields.sqlStatement.value = `SELECT id,title,author FROM showcaseBooks ORDER BY ID DESC`;


        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const sqlStatement = this.getFieldValue('sqlStatement');
            const dpDataLoader = new DpDataLoader();
            dpDataLoader.getRecordsWithSql('records', sqlStatement);
            const that = this;
            dpDataLoader.load(function (data) {
                if (qsys.isSqliteError(data)) {
                    const errorMessage = data.records.message;
                    that.responseData.records = [];
                    that.formStatus = 'error';
                    that.formMessage = `${errorMessage}`;
                } else {
                    const records = data['records'];
                    that.responseData.records = records;
                }
                that.sendResponse();
            });

        }
    }



}

module.exports = ControllerShowcaseDisplayDataFromSqlStatement