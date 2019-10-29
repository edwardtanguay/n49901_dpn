"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

class DqlParser {

    constructor(dql) {
        this.dql = dql;
        this.itemTypeIdCode = '';
        this.field = '';
        this.value = '';
        this.parse();
    }

    //`pageItem where idCode = home`
    parse() {
        if (qstr.contains(this.dql, ' where ')) {
            this.parseWhere();
        }
        if (!qstr.isEmpty(this.dql) && !qstr.contains(this.dql, ' ')) {
            this.parseItemTypeIdCode();
        }
    }

    //`pageItem where idCode = home`
    parseWhere() {
        const parts = qstr.breakIntoParts(this.dql, ' where ');
        this.itemTypeIdCode = qstr.forcePlural(parts[0]);
        const assignment = parts[1]; // idCode = home
        const pieces = qstr.breakIntoParts(assignment, '=');
        this.field = pieces[0];
        this.value = pieces[1];
    }

    parseItemTypeIdCode() {
        this.itemTypeIdCode = this.dql;
    }

    display() {
        return this.text;
    }

}

module.exports = DqlParser