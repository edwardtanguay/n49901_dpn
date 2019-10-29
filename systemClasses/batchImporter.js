"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

class BatchImporter {
    
    constructor(batchText) {
        this.batchText = batchText;
        this.batchLines = qstr.convertStringBlockToLinesRetainLeadingTabs(this.batchText);
    }

    display() {
        
    }

    getDebuggingInfosBatchLines() {
        let r = '';
        let line = 1;
        for(const batchLine of this.batchLines) {
            r += `LINE ${line}: ${batchLine}` + qstr.NEW_LINE();
            line++;
        }
        return r;
    }

    getDebuggingInfos() {
        return {
            'batchLines' : this.getDebuggingInfosBatchLines()
        };
    }    

}

module.exports = BatchImporter