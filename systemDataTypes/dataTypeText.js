"use strict"
const qstr = require('../qtools/qstr');
const DataType = require('./dataType');

class DataTypeText extends DataType {
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

    getNiceValue(item) {
        return '<dev class="dataTypeText">' + qstr.convertLineBreaksAndEncodeToHtml(this.getValue(item)) + '</dev>';
    }

}

module.exports = DataTypeText;