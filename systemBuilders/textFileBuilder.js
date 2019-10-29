"use strict"
const fs = require('fs');
const qstr = require('../qtools/qstr');
const config = require('../system/config');

class TextFileBuilder {
    constructor(idCode) {
        this.idCode = idCode;
        this.templateFullPathAndFileName = config.getFullApplicationPathAndFileName('systemFileTemplates/fileTemplate_' + this.idCode + '.txt');
        this.content = fs.readFileSync(this.templateFullPathAndFileName, 'utf8');
        this.parsedContent = '';
        this.lines = qstr.convertStringBlockToLines(this.content);
        this.data = {};
    }

    parseContent() {
        this.parsedContent = this.content;
        for (const key in this.data) {
            const value = this.data[key];
            const marker = '@@' + key;
            //this.parsedContent = this.parsedContent.replace(marker, value);
            this.parsedContent = qstr.replaceAll(this.parsedContent, marker, value);
        }
    }

    buildNow(pathAndFileName) {
        const fullApplicationPathAndFileName = config.getFullApplicationPathAndFileName(pathAndFileName);
        this.parseContent();
        fs.writeFileSync(fullApplicationPathAndFileName, this.parsedContent);
    } 

    buildLines() {

    }
}

module.exports = TextFileBuilder