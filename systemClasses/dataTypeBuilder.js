"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qsys = require('../qtools/qsys');
const fs = require('fs');
const config = require('../system/config');
const DpFileSystem = require('../systemClasses/dpFileSystem');
const DynamicFile = require('../systemClasses/dynamicFile');

class DataTypeBuilder {

    constructor(dataTypeName, inheritFromDataType) {
        this.dataTypeName = dataTypeName;
        this.inheritFromDataType = inheritFromDataType;

        this.dataTypeIdCode = qstr.forceCamelNotation(this.dataTypeName);
        this.directory = 'systemDataTypes';

        const dataTypeNamePascalNotation = qstr.forcePascalNotation(this.dataTypeName);
        const inheritDataTypeNamePascalNotaion = qstr.forcePascalNotation(this.inheritFromDataType);

        this.data = {};
        this.data.dataTypeClassName = 'DataType' + dataTypeNamePascalNotation;
        this.data.inheritDataTypeClassName = 'DataType' + inheritDataTypeNamePascalNotaion;
        this.data.inheritDataTypeClassFileName = qstr.forceCamelNotation(this.data.inheritDataTypeClassName);
        this.data.theDataTypeClassNameCamelNotation = qstr.forceCamelNotation(this.data.dataTypeClassName);

        this.dataTypePathAndFileName = this.directory + '/dataType' + dataTypeNamePascalNotation + '.js';
        this.dataTypeFileTemplateIdCode = 'newDataType';
    }

    buildNow() {

        //create the class
        DpFileSystem.createFileWithTemplate(this.dataTypePathAndFileName, this.dataTypeFileTemplateIdCode, this.data);

        //set file to alter
        const systemDynamicFile = new DynamicFile('system/system.js');

        //add lines to load the data type class at top of file
        const loadLine = `const ${this.data.dataTypeClassName} = require('../systemDataTypes/${this.data.theDataTypeClassNameCamelNotation}');`;
        systemDynamicFile.addCodeChunkToCodeArea('dataTypeIncludeArea', this.dataTypeIdCode, loadLine);

        //add lines to instantiate the class
        const switchStatementLines = [
            `case '${this.dataTypeIdCode}':`,
            `dataType = new ${this.data.dataTypeClassName}(label, extras);`,
            `break;`
        ];
        systemDynamicFile.addCodeChunkToCodeArea('dataTypeSwitchBlock', this.dataTypeIdCode, switchStatementLines);

        //save it
        systemDynamicFile.save();
    }

}

module.exports = DataTypeBuilder