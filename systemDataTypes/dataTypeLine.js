"use strict"
const qstr = require('../qtools/qstr');
const DataType = require('./dataType');

class DataTypeLine extends DataType {
    constructor(label, extras = "") {
        super(label, extras);
        this.baseSetup();
    }
    getCreateStatementChunk() {
        return `${this.idCode} TEXT NOT NULL`;
    }

    validate() {

        super.validate();

        if (!this.validationError) {
            const maximum = 255;
            const currentLength = this.value.length

            if (currentLength > maximum) {
                this.validationError = true;
                this.baseValidationMessage = `is too long (${currentLength} characters), it may only be ${maximum} characters long`;
            }
        }

        return this.validationResponse();
    }

    getFieldCodeText_formControl() {
        return `<input id="field_${this.idCode}" v-model="fields.${this.idCode}.value" class="form-control dataType_${this.dataTypeIdCode}"
                                @keydown="keyWasPressed" @keyup="keyWasPressed" v-on:keyup.enter="onEnterClick()"
                                :disabled="pageStatus=='busy'" />`;
    }
}

module.exports = DataTypeLine;