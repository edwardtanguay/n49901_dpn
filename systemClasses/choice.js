"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const DynamicFileCodeArea = require('./dynamicFileCodeArea');
const fs = require('fs');
const config = require('../system/config');

class Choice {
    constructor(choiceLine) {
        this.choiceLine = choiceLine;
        this.processLine = this.choiceLine;
        this.idCode = '';
        this.label = '';
        this.default = false;
        this.disabled = false;

        this.processDefault();
        this.processDisabled();
        this.processCustomLabel();

    }

    processDefault() {
        if (qstr.contains(this.processLine, '*')) {
            this.default = true;
            this.processLine = qstr.replaceAll(this.processLine, '*', '');
        }
    }

    processDisabled() {
        if (qstr.contains(this.processLine, '!')) {
            this.disabled = true;
            this.processLine = qstr.replaceAll(this.processLine, '!', '');
        }
    }

    processCustomLabel() {
        if (qstr.contains(this.processLine, '[')) {
            this.processLine = qstr.chopRight(this.processLine, ']');
            const parts = qstr.breakIntoParts(this.processLine, '[');
            this.label = qstr.getSmartPart(parts, 0);
            this.idCode = qstr.getSmartPart(parts, 1);
        } else {
            this.label = this.processLine;
            this.idCode = qstr.forceCamelNotation(this.label);
        }
    }

    initialize() {
        this.contents = fs.readFileSync(this.pathAndFileName, 'utf8');
        this.lines = qstr.convertStringBlockToLinesNoTrim(this.contents);
        this.areas = this.buildAreas();
    }

    displayForDebugging() {
        qdev.debug('this.idCode',this.idCode);
        qdev.debug('this.label',this.label);
        qdev.debug('this.default',this.default);
        qdev.debug('this.disabled',this.disabled);
        qdev.debug('---','--');  
    }

}

module.exports = Choice