"use strict"
const Items = require('./items');

class ItemTypes extends Items {

    getItemTypeDefinitionBlock() {
        return `
        ** Item Types
        idCode
        Title
        Description;p
        Kind
        Subsite
        Display Order; wn
        `;
    }

    constructor(loadIdCode) {
        super(loadIdCode);
        this.itemTypeIdCode = 'itemTypes';
        this.loadItems();
    }

    loadItems() {
        super.loadItems();
        switch (this.loadIdCode) { }
    }
}

module.exports = ItemTypes