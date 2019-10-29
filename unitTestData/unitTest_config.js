"use strict"
const qstr = require('../qtools/qstr');
const config = require('../system/config');
//checkLineTest
// === manually-defined configs ===================

exports.port = function () {
    return '11111';//DYNAMIC_LINE:port
}

exports.layout = function () {
    //checkLineWithTab
    return 'plain'; // plain, bootstrap
}