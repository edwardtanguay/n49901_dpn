"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const SmartItemType = require('../systemClasses/smartItemType');


class ControllerShowcaseParseItemTypeDefinitionBlock extends Controller {
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
                definitionBlock: {
                    label: 'Item Type Definition Block',
                    dataTypeIdCode: 'paragraph',
                    value: `** Showcase Test Users
First Name;line;$required
Last Name;line;$required
Age;wn;$info=Age at the beginning of the year.;$example=55;$defaultValue=30
Department;choice;$choices=Sales|Development*|Marketing|E-Marketing[emarketing]!
Newsletter;choice;$choices=Yes, please send it to me.[yes]| No, please don't send it to me.[no]*|Not sure yet (will decide later).[notSure];$required;$info=Remember, you can unsubscribe at any time.`,
                    info: 'Paste in text here.',
                    example: '',
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

            const definitionBlock = this.requestData.fields.definitionBlock.value;

            const smartItemType = new SmartItemType(definitionBlock);
            const fields = smartItemType.getFields();
            const htmlOutput = smartItemType.getHtml();

            this.responseData.outputHtml = htmlOutput;
            this.sendResponse();
        }
    }

}

module.exports = ControllerShowcaseParseItemTypeDefinitionBlock