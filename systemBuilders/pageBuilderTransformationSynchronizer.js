"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');

class PageBuilderTransformationSynchronizer extends PageBuilder {

    constructor(title, type, kind, data) {
        super(title, type, kind, data);
    }

    initialize() {
        //this.pageData.specialVariable = 'nnn';
    }

}

module.exports = PageBuilderTransformationSynchronizer