"use strict"
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');

class DataType {
	constructor(label, extras = "") {
		this.label = label;
		this.idCode = ''; // e.g. "firstName"
		this.extras = extras;
		this.dataTypeIdCode = this.buildDataTypeIdCode();
		this.defaultValue = '';
		this.value = null;
		this.sqlFieldVariable = '?';
		this.validationError = false;
		this.baseValidationMessage = '';
		this.required = false;
		this.choicesList = '';
		this.choices = [];
		this.info = '';
		this.example = '';
		this.dataTypeDefinitionLine = '';
		this.kind = 'custom'; // system DataTypes override with "system"
		this.request = null;

		this.addExtrasToBase();

		this.initialize();
	}

	initialize() {
		if (qstr.isEmpty(this.idCode)) {
			this.idCode = qstr.forceCamelNotation(this.label);
		}
	}

	generatesAutomaticValueOnSave() {
		return false;
	}

	getAutomaticallyGeneratedValue() {
		return null;
	}

	addExtrasToBase() {
		this.objectExtras = qstr.parseDataTypeExtras(this.extras);
		for (const key in this.objectExtras) {
			const value = this.objectExtras[key];
			this[key] = value;
		}
		this.choices = qstr.convertChoicesListToChoices(this.choicesList);
	}

	initializeWithField(field) {
		this.label = field.label;
		this.value = field.value;
		this.info = field.info;
		this.example = field.example;
		this.required = field.required;
		this.errorStatus = field.errorStatus;
		this.errorMessage = field.errorMessage;
		this.displayStatus = field.displayStatus;
		this.choicesList = field.choicesList;
		this.choices = qstr.convertChoicesListToChoices(this.choicesList);
	}

	buildDataTypeIdCode() {
		const constructorName = this.constructor.name; // e.g. "DataTypeWholeNumber"
		const pascalNotation = qstr.chopLeft(constructorName, 'DataType'); // e.g. "WholeNumber"
		const dataTypeIdCode = qstr.forceCamelNotation(pascalNotation); // e.g. "wholeNumber"
		return dataTypeIdCode;
	}

	baseSetup() {
		this.value = this.defaultValue;
	}

	getCreateStatementChunk() {
		return this.idCode + '...undefined...';
	}

	displayForDebugging() {
		return `${this.label} (${this.idCode}) of type ${this.dataTypeIdCode}`;
	}

	static instantiate(dataTypeDefinitionLine) {
		console.log('in here');
	}

	validate() {
		if (this.required && qstr.isEmpty(this.value)) {
			this.validationError = true;
			this.baseValidationMessage = 'is required and cannot be empty';
		}
		return this.validationResponse();
	}

	buildMessage(message) {
		return `Value ${this.baseValidationMessage}.`;
	}

	buildFullMessage() {
		return `The field ${this.label.toUpperCase()} ${this.baseValidationMessage}.`;
	}

	validationResponse() {
		if (this.validationError) {
			return {
				valid: false,
				baseValidationMessage: this.baseValidationMessage,
				validationMessage: this.buildMessage(),
				fullValidationMessage: this.buildFullMessage()
			};
		} else {
			return {
				valid: true
			};
		}
	}

	getHtml() {
		let r = '';
		r += '<div class="dataTypeInfo">'
		r += `<div class="label"><code>${this.label} (${this.idCode}) [${this.dataTypeIdCode}]</code></div>`;
		r += `<div class="content">`;
		r += `<table>`;
		for (const key in this.objectExtras) {
			const value = this.objectExtras[key];
			r += `<tr>`;
			r += `<td class="theLabel">${key}:</td><td><code>${value}</code></td>`;
			r += `</tr>`;

			if (key == 'choicesList') {
				r += `<tr>`;
				r += `<td></td>`;
				r += `<td>`;
				for (const choice of this.choices) {
					r += `<ul>`;
					r += `<li style="height:5px">`;
					r += `<code>${choice.label} </code>&nbsp;= <code><b>${choice.idCode}</b></code>`;
					if (choice.default) {
						r += ` <code>[DEFAULT]</code>`;
					}
					if (choice.disabled) {
						r += ` <code>[disabled]</code>`;
					}
					r += `</li>`;
					r += `</ul>`;
				}
				r += `</td>`;
				r += `</tr>`;
			}


		}
		r += `</table>`;
		r += `</div>`;
		r += '</div>'
		return r;
	}

	getEntityFieldObject() {
		return {
			label: this.label,
			dataTypeIdCode: this.dataTypeIdCode,
			value: this.getDefaultValue(),
			info: this.info,
			example: this.example,
			required: this.required,
			errorStatus: '',
			errorMessage: '',
			displayStatus: this.displayStatus,
			choices: this.choices,
			choicesList: this.choicesList,
			choiceSelector: this.getChoiceSelector()
		};
	}

	getDefaultValue() {
		if (this.thereAreChoices()) {
			return qstr.getDefaultChoice(this.choices);
		} else {
			return this.defaultValue;
		}
	}

	thereAreChoices() {
		return this.choices.length > 0;
	}

	getChoiceSelector() {
		if (this.thereAreChoices()) {
			return this.choiceSelector;
		} else {
			return '';
		}
	}

	getFieldCodeText() {
		return `                <!-- field: ${this.label.toUpperCase()} -->
                <dl class="dataType_${this.dataTypeIdCode}">
                    <dt><span v-if="fields.${this.idCode}.required">*</span>{{fields.${this.idCode}.label}}${this.getTitleInfoArea()}${this.getHelpIconArea()}</dt>
                    <dd>
                        <div>
                            ${this.getFieldCodeText_formControl()}
                        </div>
                        <!-- field info, examples, and error messags -->${this.getHelpInfoArea()}
                        <div>
                            <small v-if="fields.${this.idCode}.errorMessage != ''" class="error">{{fields.${this.idCode}.errorMessage}}
                            </small>
                            <small v-if="fields.${this.idCode}.info" class="info">{{fields.${this.idCode}.info}} </small>
                            <small v-if="fields.${this.idCode}.example" class="example"><span class="exampleLabel">Example:</span> <span class="exampleText">{{fields.${this.idCode}.example}}</span>
                            </small>
                        </div>
                    </dd>
                </dl>` + qstr.NEW_LINE(2);
	}

	getHelpInfoArea() {
		if (!qstr.isEmpty(this.getHelpInfoHtml())) {
			return `                        <div class="helpArea" v-show="fields.${this.idCode}.showHelp">
        ${this.getHelpInfoHtml()}
        ${this.getHelpInfoParseArea()}
    </div>`;
		} else {
			return ``;
		}
	}

	getHelpInfoHtml() {
		return ``;
	}

	getHelpInfoParseArea() {
		return ``;
	}

	getTitleInfoArea() {
		if (!qstr.isEmpty(this.getTitleInfo())) {
			return `<span class="titleInfo"> (${this.getTitleInfo()})</span>`;
		} else {
			return ``;
		}
	}

	getTitleInfo() {
		return ``;
	}

	getHelpIconArea() {
		return ``;
	}

	getFieldCodeForEmptyObject() {
		return `                ${this.idCode}: {
                    label: '',
                    dataTypeIdCode: '',
                    value: '',
                    info: '',
                    example: '',
                    required: false,
                    errorStatus: '',
                    errorMessage: '',
                    displayStatus: '',
                    choices: '',
                    choiceSelector: ''
                }`;
	}

	getCodeBlockDefineLocalVariableLine() {
		return `const ${this.idCode} = this.getFieldValue('${this.idCode}');`;
	}

	getCodeBlockVariableValuePart() {
		return '<li>' + this.idCode + ' = <code>${' + this.idCode + '}</code></li>';
	}

	allowIfNotRequiredAndBlank() {
		if (!this.required && qstr.isEmpty(this.value)) {
			this.validationError = false;
			this.baseValidationMessage = '';
		}
	}

	getSqliteTableCreationCommand() {
		return `${this.idCode} TEXT`;
	}

	asObject(value) {
		return {
			label: this.label,
			idCode: this.idCode,
			dataTypeIdCode: this.dataTypeIdCode,
			value: value
		}
	}

	getTemplateTextLine() {
		return this.idCode.toUpperCase();
	}

	// e.g. "dataTypeLine"
	getDataTypeClassName() {
		return `dataType` + qstr.forcePascalNotation(this.dataTypeIdCode);
	}

	addSoftSpaceIfNecessary() {
		if (this.idCode == 'id') {
			return `<span class="softSpace">&nbsp;</span>`;
		} else {
			return ``;
		}
	}

	addHardSpaceIfNecessary() {
		if (this.idCode != 'id') {
			return `&nbsp;`;
		} else {
			return ``;
		}
	}

	buildCode_tableHeaderElement() {
		return `<th class="dataType ${this.getDataTypeClassName()} prohibitSelectionClickable" v-show="fields.${this.idCode}.visible"
        @click="advanceSortSetting(fields.${this.idCode})">${this.label}${this.addSoftSpaceIfNecessary()}<span v-if="pageState.sortFieldIdCode == '${this.idCode}'">${this.addHardSpaceIfNecessary()}<i
                class="fa fa-chevron-up columnDirectionMarker" v-if="pageState.sortFieldDirection == 'desc'"></i><i
                class="fa fa-chevron-down columnDirectionMarker" v-if="pageState.sortFieldDirection == 'asc'"></i></span></th>`;
	}


	buildCode_tableDataElement() {
		return `<td class="${this.getDataTypeClassName()}" v-show="fields.${this.idCode}.visible">{{item.${this.idCode}}}</td>`;
	}

	buildCode_fieldObject() {
		return `                ${this.idCode}: {
            idCode: '${this.idCode}',
            label: '${this.label}',
            visible: false,
            sort: 'none'
        }`;
	}

	buildCode_responseDataBlockLine() {
		return `that.responseData.fields.${this.idCode}.value = item.${this.idCode} || "";`;
	}

	buildCode_defineFieldValueLine() {
		return `const ${this.idCode} = this.getFieldValue('${this.idCode}');`;
	}

	buildCode_definePropertyLine(singularItemTypeIdCode) {
		return `${singularItemTypeIdCode}.${this.idCode} = ${this.idCode};`;
	}

	getIntegerValue(item) {
		return parseInt(this.getValue(item));
	}

	getValue(item) {
		return item[this.idCode];
	}

	getNiceValue(item) {
		return this.getValue(item);
	}

	getFieldDecorationCodeBlockForController() {
		return ``;
	}

	getJavaScriptExtendedCodeBlock() {
		return ``;
	}

	getItemTextBlockLine(value) {
		return this.idCode + '::' + value + qstr.NEW_LINE();
	}

}

module.exports = DataType;