"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const DpDataLoader = require('../systemClasses/dpDataLoader');

class CodeFileTransformer {

    constructor(pathAndFileName, removeTaskIdCode, originalContent = null) {
        this.pathAndFileName = pathAndFileName;
        this.removeTaskIdCode = removeTaskIdCode;
        this.newContent = '';
        if (originalContent == null) {
            this.originalContent = qfil.getContentOfFile(this.pathAndFileName);
        } else {
            this.originalContent = originalContent;
        }
        this.lines = qstr.convertStringBlockToLines(this.originalContent, false);
    }

    process(callback = null) {
        switch (this.removeTaskIdCode) {
            case 'removeOldPageLines':
                this.process_removeOldPageLines(callback);
                break;
            case 'removeOldItemTypeLines':
                this.process_removeOldItemTypeLines(callback);
                break;
            case 'commentOutLines':
                this.process_commentOutLines(callback);
                break;
        }
    }

    process_commentOutLines(callback) {
        const newLines = [];
        for (const line of this.lines) {
            const newLine = '//' + line;
            newLines.push(newLine);
        }
        this.newContent = qstr.convertLinesToStringBlock(newLines);
        callback(this);
    }

    process_removeOldPageLines(callback) {

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('pageItems', `SELECT * FROM pageItems WHERE subsite <> 'core' AND subsite <> 'systemPublish'`);
        const that = this;
        dpDataLoader.load(function (data) {
            const pageItems = data['pageItems'];

            let newLines = [];
            let markLineAfterMarkedLine = false;
            for (const line of that.lines) {
                //qdev.debug('line', line);
                let lineContainsMarker = false;
                let newLine = line;
                if (markLineAfterMarkedLine) {
                    newLine = '//DELETE ' + line;
                } else {

                    for (const pageItem of pageItems) {
                        const marker = `//:${pageItem.idCode}`;
                        qdev.debug('looking for', marker);
                        if (qstr.contains(line, marker)) {
                            newLine = '//DELETE ' + line;
                            lineContainsMarker = true;
                            if (qstr.contains(line, 'case \'')) {
                                markLineAfterMarkedLine = true;
                            }
                            break;
                        }
                    }
                }

                if (lineContainsMarker) {
                    newLines.push(newLine);
                } else if (markLineAfterMarkedLine) {
                    newLines.push(newLine);
                    markLineAfterMarkedLine = false;
                } else {
                    newLine = line;
                    newLines.push(newLine);
                }
            }

            //now delete from new lines
            newLines = that.removeLinesMarkedForDeletion(newLines);

            that.newContent = qstr.convertLinesToStringBlock(newLines);
            callback(that);
        });
    }

    process_removeOldItemTypeLines(callback) {

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('pageItems', `SELECT * FROM itemTypes WHERE subsite <> 'core' AND subsite <> 'systemPublish'`);
        const that = this;
        dpDataLoader.load(function (data) {
            const pageItems = data['pageItems'];

            let newLines = [];
            let markLineAfterMarkedLine = false;
            for (const line of that.lines) {
                //qdev.debug('line', line);
                let lineContainsMarker = false;
                let newLine = line;
                if (markLineAfterMarkedLine) {
                    newLine = '//DELETE ' + line;
                } else {

                    for (const pageItem of pageItems) {
                        const marker = `//:${pageItem.idCode}`;
                        qdev.debug('looking for', marker);
                        if (qstr.contains(line, marker)) {
                            newLine = '//DELETE ' + line;
                            lineContainsMarker = true;
                            if (qstr.contains(line, 'case \'')) {
                                markLineAfterMarkedLine = true;
                            }
                            break;
                        }
                    }
                }

                if (lineContainsMarker) {
                    newLines.push(newLine);
                } else if (markLineAfterMarkedLine) {
                    newLines.push(newLine);
                    markLineAfterMarkedLine = false;
                } else {
                    newLine = line;
                    newLines.push(newLine);
                }
            }

            //now delete from new lines
            newLines = that.removeLinesMarkedForDeletion(newLines);

            that.newContent = qstr.convertLinesToStringBlock(newLines);
            callback(that);
        });
    }

    removeLinesMarkedForDeletion(lines) {
        const newLines = [];
        for (const line of lines) {
            if (!qstr.contains(line, '//DELETE')) {
                newLines.push(line);
            }
        }
        return newLines;
    }

    getOriginalContent() {
        return this.originalContent;
    }

    getNewContent() {
        return this.newContent;
    }

    save() {
        qfil.writeToFile(this.pathAndFileName, this.newContent);
    }

}

module.exports = CodeFileTransformer