"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseDpDataLoader extends Controller {
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
*Number of Showcase Book Records to Create;wn;$defaultValue=10     
        `;
        this.responseData = {};

        this.prepareFields();
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const numberOfShowcaseBookRecordsToCreate = this.getFieldValue('numberOfShowcaseBookRecordsToCreate');

            const dpDataLoader = new DpDataLoader();
            for (let i = 1; i <= numberOfShowcaseBookRecordsToCreate; i++) {
                const title = 'Book #' + i;
                dpDataLoader.executeSql('addBook' + i, `insert into showcaseBooks (title) values ("${title}")`);
                dpDataLoader.executeSql('changeBook' + i, `update showcaseBooks set author="changed" where id=340`);
                dpDataLoader.getRecordsWithSql('records', 'select * from showcaseBooks LIMIT 3');
            }
            const that = this;
            dpDataLoader.load(function (data) {

                // const dpDataLoader = new DpDataLoader();
                // dpDataLoader.executeSql('execute1', `delete from showcaseBooks where id > 343`);
                // dpDataLoader.load(function (data) {
                //     that.formStatus = 'success';
                //     that.formMessage = `finished`;

                //     that.sendResponse();
                // });
                that.sendResponse();

            });

        }
    }

}

module.exports = ControllerShowcaseDpDataLoader