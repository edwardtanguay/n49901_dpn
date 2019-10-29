"use strict"
const qstr = require('../qtools/qstr');
const DataType = require('./dataType');

class DataTypeParagraph extends DataType {
    constructor(label, extras = "") {
        super(label, extras);
    }

    validate() {
        super.validate();
        return this.validationResponse();
    }

    getFieldCodeText_formControl() {
        return `<textarea id="field_${this.idCode}" :disabled="pageStatus=='busy'" v-model="fields.${this.idCode}.value"
                                    @keydown="keyWasPressed" @keyup="keyWasPressed" class="form-control dataType_${this.dataTypeIdCode}_control"></textarea>`;
    }

    getItemTextBlockLine(value) {
        let r = '';
        r += this.idCode + '::[[' + qstr.NEW_LINE();
        r += value + qstr.NEW_LINE();
        r += `]]` + qstr.NEW_LINE();;
        return r;
    }

}

module.exports = DataTypeParagraph;