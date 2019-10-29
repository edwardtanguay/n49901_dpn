"use strict"
const Items = require('./items');

class ShowcaseUsers extends Items {

    getItemTypeDefinitionBlock() {
        return `
        ** Showcase Users
        Login
        Password;password
        First Name
        Last Name
        Status
        Access Groups
        Display Order;wn
        Description;text
        Extended Description;markdown
        Notes;outline
        `;
    }

    constructor(loadIdCode) {
        super(loadIdCode);
        this.itemTypeIdCode = 'showcaseUsers';
        this.loadItems();
    }

    loadItems() {
        super.loadItems();
        switch (this.loadIdCode) { }

    }

}

module.exports = ShowcaseUsers