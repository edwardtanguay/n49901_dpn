"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');

class PageBuilderItemTypeManager extends PageBuilder {

    constructor(title, type, kind, data) {
        super(title, type, kind, data);
    }

    initialize() {
        this.controllerData.itemTypeIdCode = this.data.itemTypeIdCode;
        this.controllerData.pascalItemTypeIdCode = qstr.forcePascalNotation(this.data.itemTypeIdCode);
        this.controllerData.textItemTypeIdCode = qstr.forceTextNotation(this.data.itemTypeIdCode);

        this.pageData.itemTypeIdCode = this.data.itemTypeIdCode;
        this.pageData.pascalItemTypeIdCode = qstr.forcePascalNotation(this.data.itemTypeIdCode);
        this.pageData.textItemTypeIdCode = qstr.forceTextNotation(this.data.itemTypeIdCode);
    }

}

module.exports = PageBuilderItemTypeManager