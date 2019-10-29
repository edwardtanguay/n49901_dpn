"use strict"
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const dpod = require('../system/dpod');
const config = require('../system/config');
const Item = require('../systemItems/item');
const Items = require('../systemItems/items');
const DqlParser = require('../systemClasses/dqlParser');


exports.fetchItem = function (dql, callback) {
    // const item = {
    //     title: 'testing',
    //     idCode: 'skdj'
    // };
    // dpod.lookupName(23, function (item) {
    //     callback(item);
    // });


    const dqlParser = new DqlParser(dql);

    if (!qstr.isEmpty(dqlParser.itemTypeIdCode) && !qstr.isEmpty(dqlParser.field) && !qstr.isEmpty(dqlParser.value)) {
        Item.fetchWithField(dqlParser.itemTypeIdCode, dqlParser.field, dqlParser.value, function (item) {
            callback(item);
        });
    } else {
        callback(null);
    }

    // callback({
    //     title: 'okokok'
    // });

}

exports.lookupName = function (id, callback) {
    const person = {
        firstName: 'Joseph',
        lastName: 'Kubrachko',
        title: 'Dr.',
        age: 44
    };
    callback(person);
}

exports.fetchItems = function (dql, callback) {
    const dqlParser = new DqlParser(dql);
    if (qsys.isValidItemTypeIdCode(dqlParser.itemTypeIdCode)) {
        Items.fetchAll(dqlParser.itemTypeIdCode, function (item) {
            callback(item);
        });
    } else {
        callback(null);
    }
}

exports.deleteItem = function (dql, callback = null) {
    const dqlParser = new DqlParser(dql);
    Item.deleteWithField(dqlParser.itemTypeIdCode, dqlParser.field, dqlParser.value, function () {
        if (callback != null) {
            callback();
        }
    });
}