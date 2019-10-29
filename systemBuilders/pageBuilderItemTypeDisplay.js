"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');
const System = require('../system/system');

class PageBuilderItemTypeDisplay extends PageBuilder {

    constructor(title, type, kind, data) {
        super(title, type, kind, data);
    }

    initialize() {

        const items = System.instantiateItems(this.data.itemTypeIdCode);

        this.pageData.itemTypeIdCode = this.data.itemTypeIdCode;
        this.pageData.itemTypeTitlePlural = qstr.forceTitleNotation(this.data.itemTypeIdCode);
        this.pageData.itemTypeTitleSingular = qstr.forceSingular(qstr.forceTitleNotation(this.data.itemTypeIdCode));
        this.pageData.itemTypePascalPlural = qstr.forcePascalNotation(this.data.itemTypeIdCode);
        this.pageData.itemTypePascalSingular = qstr.forceSingular(qstr.forcePascalNotation(this.data.itemTypeIdCode));
        this.pageData.itemTypeCamelPlural = qstr.forceCamelNotation(this.data.itemTypeIdCode);
        this.pageData.itemTypeCamelSingular = qstr.forceSingular(qstr.forceCamelNotation(this.data.itemTypeIdCode));
        this.pageData.itemTypeTextPlural = qstr.forceTextNotation(this.data.itemTypeIdCode);
        this.pageData.itemTypeTextSingular = qstr.forceSingular(qstr.forceTextNotation(this.data.itemTypeIdCode));
        this.pageData.identifyingField = items.getIdentifyingField();
        this.pageData.searchFieldList = items.getSearchFieldList();

        this.controllerData.itemTypeIdCode = this.data.itemTypeIdCode;
        this.controllerData.itemTypeTitlePlural = qstr.forceTitleNotation(this.data.itemTypeIdCode);
        this.controllerData.itemTypeTitleSingular = qstr.forceSingular(qstr.forceTitleNotation(this.data.itemTypeIdCode));
        this.controllerData.itemTypePascalPlural = qstr.forcePascalNotation(this.data.itemTypeIdCode);
        this.controllerData.itemTypePascalSingular = qstr.forceSingular(qstr.forcePascalNotation(this.data.itemTypeIdCode));
        this.controllerData.itemTypeCamelPlural = qstr.forceCamelNotation(this.data.itemTypeIdCode);
        this.controllerData.itemTypeCamelSingular = qstr.forceSingular(qstr.forceCamelNotation(this.data.itemTypeIdCode));
        this.controllerData.itemTypeTextPlural = qstr.forceTextNotation(this.data.itemTypeIdCode);

    }

}

module.exports = PageBuilderItemTypeDisplay