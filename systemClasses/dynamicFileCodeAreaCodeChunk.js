"use strict"
const qstr = require('../qtools/qstr');
const config = require('../system/config');

class DynamicFileCodeAreaCodeChunk {
    constructor(idCode) {
        this.idCode = idCode;
        this.numberOfPrecedingTabs = [];
        this.lines = [];
    }

    addLine(fullLine) {
        const values = qstr.removeEndMarkerAndGetNumberOfPrecedingTabsAndLine(fullLine, config.dynamicFileCodeChunkMarker());
        const numberOfPrecedingTabs = values[0];
        const line = values[1];
        this.numberOfPrecedingTabs.push(numberOfPrecedingTabs);
        this.lines.push(line);
    }

    getPrecedingTabsOfFirstLine() {
        return this.numberOfPrecedingTabs[0];
    }

    addNewContent(numberOfPrecedingTabs, lines) {
        this.numberOfPrecedingTabs = numberOfPrecedingTabs;
        this.lines = lines;
    }

    debugOutput() {
        console.log('      [' + this.idCode + ']');
        let index = 0;
        for (const line of this.lines) {
            const numberOfPrecedingTabs = this.numberOfPrecedingTabs[index];
            console.log('         (tab=' + numberOfPrecedingTabs + ') |' + line + '|');
            index++;
        }
    }

    getLinesForTemplateInsertion() {
        const newLines = [];
        let index = 0;
        for (const line of this.lines) {
            const numberOfPrecedingTabs = this.numberOfPrecedingTabs[index];
            let marker = '';
            if (index == 0) {
                marker = ' //:' + this.idCode;
            }
            const newLine = qstr.tabs(numberOfPrecedingTabs) + line + marker;
            newLines.push(newLine);
            index++;
        }
        return newLines;
    }

}

module.exports = DynamicFileCodeAreaCodeChunk