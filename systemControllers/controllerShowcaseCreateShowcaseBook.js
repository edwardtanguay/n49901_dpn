"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseCreateShowcaseBook extends Controller {
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
*Title
Description;p
Author
Number of Pages;numberOfBookPages
Kind
Section        
        `;
        this.responseData = {};

        this.prepareFields();
        //this.responseData.fields.title.value = `putDefaultValueHere`;
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const title = this.getFieldValue('title');
            const description = this.getFieldValue('description');
            const author = this.getFieldValue('author');
            const numberOfPages = this.getFieldValue('numberOfPages');
            const kind = this.getFieldValue('kind');
            const section = this.getFieldValue('section');

            const showcaseBook = new ShowcaseBook();
            showcaseBook.title = title;
            showcaseBook.description = description;
            showcaseBook.author = author;
            showcaseBook.numberOfPages = numberOfPages;
            showcaseBook.kind = kind;
            showcaseBook.section = section;
            showcaseBook.imbueWithRequest(this.request);
            qdev.debug('getFieldValuesWithoutId', showcaseBook.getFieldValuesWithoutId());
            showcaseBook.save();

            //qdev.debug(showcaseBook);

            this.formStatus = 'success';
            this.formMessage = `A Showcase Book with the title "<code>${title}</code>" was created.`;

            this.sendResponse();

        }
    }

}

module.exports = ControllerShowcaseCreateShowcaseBook