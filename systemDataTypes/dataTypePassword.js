"use strict"
const qstr = require('../qtools/qstr');
const DataTypeLine = require('./dataTypeLine');

class DataTypePassword extends DataTypeLine {
    constructor(label, extras = "") {
        super(label, extras);
    }

    validate() {
        super.validate();
        return this.validationResponse();
    }

    getNiceValue(item) {
        return '<span class="dataTypePassword">' + qstr.repeat('*', 20) + '</span>';
    }


    getFieldCodeText_formControl() {
        return `<input id="field_${this.idCode}" type="password" v-model="fields.${this.idCode}.value" class="form-control dataType_${this.dataTypeIdCode}"
                                @keydown="keyWasPressed" @keyup="keyWasPressed" v-on:keyup.enter="onEnterClick()"
                                :disabled="pageStatus=='busy'" />`;
    }

}

module.exports = DataTypePassword;