"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const SmartEntityType = require('./smartEntityType');

class SmartFormType extends SmartEntityType {

    constructor(entityTypeDefinitionBlock) {
        super(entityTypeDefinitionBlock);
        this.entityIdentifier = '##';
        this.parse();
    }

}

module.exports = SmartFormType