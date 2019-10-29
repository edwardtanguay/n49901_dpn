"use strict"
const qstr = require('../qtools/qstr');
const system = require('../system/system');

class TextParser {
    constructor(body) {
        this.body = body;
        this.lines = qstr.convertStringBlockToLines(this.body, false);
    }

    parse() {
        return 'parsed from base class';
    }
}

module.exports = TextParser