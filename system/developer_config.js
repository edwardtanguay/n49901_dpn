"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const config = require('./config');

// FOR DEVELOPING, SET TO TRUE
// outputs debugging information to console
// keeps dev logged in even after backend modifications to code
exports.developing = function () {
return true;//DYNAMIC_LINE:configDeveloping
}
exports.defaultUserIdCode = function () {
return 'dev';//DYNAMIC_LINE:defaultUserIdCode
}