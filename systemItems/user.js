"use strict"
const Item = require('./item');
const Users = require('./users');

class User extends Item {
    constructor(id) {
        super(id);
        this.items = new Users();
        this.loadItem();
    }

    static instantiateWithRecord(record) {
        const item = new User();
        item.login = record['login'];
        item.password = record['password'];
        item.firstName = record['firstName'];
        item.lastName = record['lastName'];
        item.email = record['email'];
        item.accessGroups = record['accessGroups'];
        return item;
    }

    static instantiateWithObjectRecord(objectRecord) {
        const item = new User();
        item.login = objectRecord.login;
        item.password = objectRecord.password;
        item.firstName = objectRecord.firstName;
        item.lastName = objectRecord.lastName;
        item.email = objectRecord.email;
        item.accessGroups = objectRecord.accessGroups;
        return item;
    }    
}

module.exports = User