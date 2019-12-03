"use strict"
const Item = require('./item');
const TestServers = require('./testServers');

class TestServer extends Item {
    constructor(id) {
        super(id);
        this.items = new TestServers();
        this.loadItem();
    }

    static instantiateWithRecord(record) {
        const item = new TestServer();
        item.title = record['title'];
        item.notes = record['notes'];
        return item;
    }

    static instantiateWithObjectRecord(objectRecord) {
        const item = new TestServer();
        item.title = objectRecord.title;
        item.notes = objectRecord.notes;
        return item;
    }
}

module.exports = TestServer