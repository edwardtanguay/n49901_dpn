"use strict"
const Item = require('./item');
const ShowcaseBooks = require('./showcaseBooks');

class ShowcaseBook extends Item {
    constructor(id) {
        super(id);
        this.items = new ShowcaseBooks();
        this.loadItem();
    }

    static instantiateWithRecord(record) {
        const item = new ShowcaseBook();
        item = super.addSystemFieldValues(item, record);
        item.title = record['title'];
        item.description = record['description'];
        item.author = record['author'];
        item.numberOfPages = record['numberOfPages'];
        item.kind = record['kind'];
        item.section = record['section'];
        return item;
    }

    static instantiateWithObjectRecord(objectRecord) {
        const item = new ShowcaseBook();
        item.id = objectRecord.id;
        item.title = objectRecord.title;
        item.description = objectRecord.description;
        item.author = objectRecord.author;
        item.numberOfPages = objectRecord.numberOfPages;
        item.kind = objectRecord.kind;
        item.section = objectRecord.section;
        return item;
    }
}

module.exports = ShowcaseBook