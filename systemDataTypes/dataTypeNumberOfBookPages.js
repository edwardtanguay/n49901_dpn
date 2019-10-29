"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const DataTypeWholeNumber = require('./dataTypeWholeNumber');

class DataTypeNumberOfBookPages extends DataTypeWholeNumber {
    constructor(label, extras = "") {
        super(label, extras);
        this.baseSetup();
    }

    validate() {

        super.validate();

        if (!this.validationError) {

            const lowerPageLimit = 10;
            const upperPageLimit = 2000;

            if (this.value > 0 && this.value < lowerPageLimit) {
                this.validationError = true;
                this.baseValidationMessage = `cannot be less than ${lowerPageLimit} since this is too small a number of pages for a book`;
            }

            if (this.value > upperPageLimit) {
                this.validationError = true;
                this.baseValidationMessage = `cannot be greater than ${upperPageLimit} since this is too high a number of pages for a book`;
            }

            if (this.value == 0) {
                this.validationError = true;
                this.baseValidationMessage = `cannot be zero because a book must have at least some pages`;
            }
        }

        this.allowIfNotRequiredAndBlank();
        return this.validationResponse();
    }
}

module.exports = DataTypeNumberOfBookPages;