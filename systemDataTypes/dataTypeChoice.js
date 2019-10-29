"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const DataTypeLine = require('./dataTypeLine');

class DataTypeChoice extends DataTypeLine {
	constructor(label, extras = "") {
		super(label, extras);

		//smart-select the choiceSelector
		if (qstr.isEmpty(this.choiceSelector)) {
			if (this.choices.length < 3) {
				this.choiceSelector = 'radioHorizontal';
			} else if (this.choices.length < 10) {
				this.choiceSelector = 'radioVertical';
			} else {
				this.choiceSelector = 'dropdown';
			}
		}

	}

	validate() {

		super.validate();

		if (!this.validationError) {

			let valueIsApproved = false;
			const labels = [];
			const idCodes = [];
			const pairs = [];
			for (const choice of this.choices) {
				if (choice.idCode == this.value) {
					valueIsApproved = true;
				}
				//also ok if empty and not required (null)
				if (qstr.isEmpty(this.value) && !this.required) {
					valueIsApproved = true;
				}
				labels.push(choice.label);
				idCodes.push(choice.idCode);
				pairs.push(choice.label + ' (<b>' + choice.idCode + '</b>)');
			}

			const pairsSegment = pairs.join(', ');

			if (!valueIsApproved) {
				this.validationError = true;
				if (this.required) {
					this.baseValidationMessage = 'must be one of the following values: ' + pairsSegment;
				} else {
					this.baseValidationMessage = 'must either be empty or one of the following values: ' + pairsSegment;
				}
			}
		}
		return this.validationResponse();
	}


	getFieldCodeText_formControl() {
		return `<!--radioVertical-->
                            <div v-if="fields.${this.idCode}.choiceSelector == 'radioVertical'" class="display_radioVertical">
                                <ul>
                                    <li v-for="choice in fields.${this.idCode}.choices">
                                        <label class="prohibitSelectionClickable" v-on:keyup.enter="onEnterClick()"><input
                                        type="radio" v-model="fields.${this.idCode}.value" :value="choice.idCode">
                                        {{choice.label}}</label>
                                    </li>
                                </ul>
                            </div>
                            <!--radioHorizontal-->
                            <div v-if="fields.${this.idCode}.choiceSelector == 'radioHorizontal'" class="display_radioHorizontal">
                                <ul>
                                    <li v-for="choice in fields.${this.idCode}.choices">
                                        <label class="prohibitSelectionClickable" v-on:keyup.enter="onEnterClick()"><input
                                        type="radio" v-model="fields.${this.idCode}.value" :value="choice.idCode">
                                        {{choice.label}}</label>
                                    </li>
                                </ul>
                            </div>
                            <!--dropdown-->
                            <div v-if="fields.${this.idCode}.choiceSelector == 'dropdown'" class="display_dropdown">
                                <select v-model="fields.${this.idCode}.value">
                                    <option v-for="choice in fields.${this.idCode}.choices" :value="choice.idCode">
                                    {{choice.label}}</option>
                                </select>
                            </div>`;
	}
}


module.exports = DataTypeChoice;