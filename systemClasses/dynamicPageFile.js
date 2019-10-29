"use strict"
const qstr = require('../qtools/qstr');
const DynamicFile = require('./dynamicFile');
const config = require('../system/config');


class DynamicPageFile extends DynamicFile {
    constructor(pathAndFileName) {
        super(pathAndFileName);
        this.type = 'ejs';
    }

    getDqlStatements() {
        const ra = [];
        const dataPrefix = '//DYNAMIC_VARIABLE:data=';
        for (const line of this.lines) {
            if (line.startsWith(dataPrefix)) {
                ra.push(qstr.chopLeft(line, dataPrefix));
            }
        }
        return ra;
    }

    getExtensionIdCodes() {
        const extensionIdCodes = this.getIdCodeArrayFromVariableLine('extensions');
        return extensionIdCodes;
    }

    static instantiateWithPageItemIdCode(pageIdCode) {
        const pagePathAndFileName = config.getApplicationPath() + "systemPages" + config.systemSlash() + pageIdCode + '.ejs';
        const dynamicPageFile = new DynamicPageFile(pagePathAndFileName);
        return dynamicPageFile;
    }
}

module.exports = DynamicPageFile