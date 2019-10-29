"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

class SmartText {
    constructor(text) {
        this.text = text;
    }

    display() {
        return this.text;
    }


}

module.exports = SmartText