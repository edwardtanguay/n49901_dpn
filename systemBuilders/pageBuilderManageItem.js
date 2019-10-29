"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');
const System = require('../system/system');
const FormType = require('../systemClasses/smartFormType');


class PageBuilderManageItem extends PageBuilder {

    constructor(title, type, kind, data) {
        super(title, type, kind, data);
    }

    initialize() {

        this.menu = 'hidden';

        const items = System.instantiateItems(this.data.itemTypeIdCode);
        const formType = new FormType(items.getFieldBlock());

        this.controllerData.fieldBlock = items.getFieldBlock();
        this.controllerData.responseDataBlock = items.buildCode_responseDataBlock();
        this.controllerData.itemTypeIdCode = this.data.itemTypeIdCode;
        this.controllerData.singularItemTypeIdCode = qstr.forceSingular(this.data.itemTypeIdCode);
        this.controllerData.pascalItemTypeIdCode = qstr.forcePascalNotation(this.data.itemTypeIdCode);
        this.controllerData.defineFieldValueLines = items.buildCode_defineFieldValueLines();
        this.controllerData.definePropertyLines = items.buildCode_definePropertyLines();
        this.controllerData.fieldDecorationCodeBlock = formType.getFieldDecorationCodeBlock();

        this.pageData.singularTitleItemTypeIdCode = qstr.forceSingular(qstr.forceTitleNotation(this.data.itemTypeIdCode));
        this.pageData.codeBlockFormFields = formType.getFieldsAsCodeText();
        this.pageData.outputCodeEmptyObject = formType.getFieldCodeForEmptyObject();
        this.pageData.pascalItemTypeIdCode = qstr.forcePascalNotation(this.data.itemTypeIdCode);
        this.pageData.singularPascalItemTypeIdCode = qstr.forceSingular(qstr.forcePascalNotation(this.data.itemTypeIdCode));
        this.pageData.javaScriptExtendedCodeBlock = formType.getJavaScriptExtendedCodeBlock();
    }
}

module.exports = PageBuilderManageItem