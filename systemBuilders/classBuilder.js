"use strict"
const config = require('../system/config');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdbs = require('../qtools/qdbs');
const DpFileSystem = require('../systemClasses/dpFileSystem');


class ClassBuilder {
    constructor(className, directory, scope, data) {
        this.className = qstr.forcePascalNotation(className); // SmartFile
        this.directory = qstr.forceCamelNotation(directory); // systemClasses
        this.scope = qstr.forceCamelNotation(scope); // single,inherited
        this.data = data;

        this.data.className = this.className;

        this.exampleCode = '';

        this.classNameCamel = qstr.forceCamelNotation(this.className);
        this.classPathAndFileName = this.directory + '/' + this.classNameCamel + '.js';
        this.classFileTemplateIdCode = 'newClass';
    }

    buildNow() {
        DpFileSystem.createFileWithTemplate(this.classPathAndFileName, this.classFileTemplateIdCode, this.data);

        this.exampleCode = `const ${this.className} = require('../${this.directory}/${this.classNameCamel}');

const ${this.classNameCamel} = new ${this.className}('test');
const output = ${this.classNameCamel}.display();
qdev.debug('output',output); `;

    }
}

module.exports = ClassBuilder 