"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseTextParser extends Controller {
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
                inputText: {
                    label: 'Input Text',
                    dataTypeIdCode: 'paragraph',
                    value: 'Showcase: Text Parser\nShowcase: Data Loading\nShowcase: Bootbox\nShowcase: JavaScript Sorting',
                    info: 'Paste in text here',
                    example: '',
                    required: true,
                    errorStatus: '',
                    errorMessage: '',
                    displayStatus: 'show',
                    choices: '',
                    choiceSelector: ''
                },
                outputText: {
                    label: 'Output Text',
                    dataTypeIdCode: 'paragraph',
                    value: '',
                    info: 'Copy text that appears here',
                    example: '',
                    required: false,
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

            const lines = qstr.convertStringBlockToLines(this.requestData.fields.inputText.value);

            const newLines = [];
            for (const line of lines) {
                const newLine = qstr.forceCamelNotation(line);
                newLines.push(newLine);
            }
            this.requestData.fields.outputText.value = qstr.convertLinesToStringBlock(newLines);

            this.sendResponse();
        }
    }

}

module.exports = ControllerShowcaseTextParser