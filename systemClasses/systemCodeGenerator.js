"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

class SystemCodeGenerator {

    // static getCodeChunk(codeChunkIdCode) {
    //     const methodName = 'getCodeChunk_' + codeChunkIdCode;
    //     return SystemCodeGenerator[methodName]();
    // }

    static getCodeChunk_itemTypeUpgrade(itemTypeIdCode) {
        return `// for itemType ${itemTypeIdCode}

fillWithLines(lines) {
    this.idCode = lines[0];
    this.title = lines[1];
    this.description = lines[2];
    this.whenPublished = lines[3];
}

getDebuggingInfosValues() {
    return {
        'idCode': this.idCode,
        'title': this.title,
        'description': this.description,
        'whenPublished': this.whenPublished
    };
}

getFieldObjects() {
    const ra = [];
    for (const dataType of this.items.dataTypes) {
        if (dataType.kind == 'custom') {
            const dataTypeIdCode = dataType.idCode;
            ra.push(dataType.asObject(this[dataTypeIdCode]));
        }
    }
    return ra;
}`;
    }

}

module.exports = SystemCodeGenerator