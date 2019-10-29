"use strict"
const Items = require('./items');

class Users extends Items {

    getItemTypeDefinitionBlock() {
        return `
        ** Users
        Login
        Password;pw
        First Name
        Last Name
        Email
        Access Groups
        `;
    }

    constructor(loadIdCode) {
        super(loadIdCode);
        this.itemTypeIdCode = 'users';
        this.loadItems();
    }

    loadItems() {
        super.loadItems();
    }

}

module.exports = Users