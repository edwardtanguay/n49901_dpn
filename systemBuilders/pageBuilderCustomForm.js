"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');
const FormType = require('../systemClasses/smartFormType');

class PageBuilderCustomForm extends PageBuilder {

    constructor(title, type, kind, data) {
        super(title, type, kind, data);
    }

    initialize() {
        const formType = new FormType(this.data.formTypeDefinitionFieldBlock);

        this.pageData.codeBlockFormFields = formType.getFieldsAsCodeText();
        this.pageData.outputCodeEmptyObject = formType.getFieldCodeForEmptyObject();
        
        this.pageData.javaScriptExtendedCodeBlock = formType.getJavaScriptExtendedCodeBlock();

        this.controllerData.fieldDecorationCodeBlock = formType.getFieldDecorationCodeBlock();

        this.controllerData.formTypeDefinitionFieldBlock = this.data.formTypeDefinitionFieldBlock;
        this.controllerData.codeBlockDefineLocalVariables = formType.getCodeBlockDefineLocalVariables();
        this.controllerData.codeBlockVariableValueLine = formType.getCodeBlockVariableValueLine();
    }

}

module.exports = PageBuilderCustomForm