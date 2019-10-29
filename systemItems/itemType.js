"use strict"
const Item = require('./item');
const ItemTypes = require('./itemTypes');
const system = require('../system/system');
const qstr = require('../qtools/qstr');

class ItemType extends Item {
    constructor(id) {
        super(id);
        this.items = new ItemTypes();
        this.loadItem();
    }

    static instantiateWithRecord(record) {
        const item = new ItemType();
        item.idCode = record['idCode'];
        item.title = record['title'];
        item.description = record['description'];
        item.kind = record['kind'];
        item.subsite = record['subsite'];
        item.displayOrder = record['displayOrder'];
        return item;
    }

    static instantiateWithObjectRecord(objectRecord) {
        const item = new ItemType();
        item.idCode = objectRecord.idCode;
        item.title = objectRecord.title;
        item.description = objectRecord.description;
        item.kind = objectRecord.kind;
        item.subsite = objectRecord.subsite;
        item.displayOrder = objectRecord.displayOrder;
        return item;
    }

    // CUSTOM METHODS

    getBatchImportItemTypeRecord() {
        return {
            itemTypeIdCode: this.idCode,
            title: this.title,
            singularTitle: qstr.forceSingular(this.title),
            templateText: this.getDynamicTemplateText()
        };
    }

    getDynamicTemplateText() {
        const item = system.instantiateItem(this.idCode);
        return item.getTemplateText();
    }
}

module.exports = ItemType