"use strict"
const Item = require('./item');
const ShowcaseUsers = require('./showcaseUsers');

class ShowcaseUser extends Item {
    constructor(id) {
        super(id);
        this.items = new ShowcaseUsers();
        this.loadItem();
    }

    static instantiateWithRecord(record) {
        const item = new ShowcaseUser();
        item.login = record['login'];
        item.password = record['password'];
        item.firstName = record['firstName'];
        item.lastName = record['lastName'];
        item.status = record['status'];
        item.accessGroups = record['accessGroups'];
        item.displayOrder = record['displayOrder'];
        item.description = record['description'];
        item.extendedDescription = record['extendedDescription'];
        item.notes = record['notes'];
        return item;
    }

    static instantiateWithObjectRecord(objectRecord) {
        const item = new ShowcaseUser();
        item.login = objectRecord.login;
        item.password = objectRecord.password;
        item.firstName = objectRecord.firstName;
        item.lastName = objectRecord.lastName;
        item.status = objectRecord.status;
        item.accessGroups = objectRecord.accessGroups;
        item.displayOrder = objectRecord.displayOrder;
        item.description = objectRecord.description;
        item.extendedDescription = objectRecord.extendedDescription;
        item.notes = objectRecord.notes;
        return item;
    }
}

module.exports = ShowcaseUser