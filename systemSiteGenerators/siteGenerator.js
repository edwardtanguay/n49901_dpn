"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const qdat = require('../qtools/qdat');
const qsys = require('../qtools/qsys');
const qarr = require('../qtools/qarr');
const fs = require('fs');
const config = require('../system/config');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const ApplicationFile = require('../systemItems/applicationFile');

class SiteGenerator {

    constructor() {
        this.siteRelativePathAndFileNames = [];
        this.applicationFiles = [];
        this.strayApplicationFiles = [];
        this.addedToDatabaseFiles = [];
        this.withEmptySiteIdCodesApplicationFiles = [];
        this.count = 0;

        this.siteIdCode = '';
        this.siteRelativeDirectory = '';
        this.siteApplicationFilesSql = '';
    }

    initialize() {
        //this.siteApplicationFilesSql = `SELECT * FROM applicationFiles WHERE siteIdCodes = '${this.siteIdCode}' OR siteIdCodes = 'core'`;
        //this.siteApplicationFilesSql = `SELECT * FROM applicationFiles WHERE siteIdCodes <> 'ignore'`;
        this.siteApplicationFilesSql = `SELECT * FROM applicationFiles`;
    }


    deleteEntriesOfFilesThatDontExistAnymore(callback) {
        this.siteRelativePathAndFileNames = qfil.getSiteRelativePathAndFileNames();
        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('applicationFiles', `SELECT * FROM applicationFiles`);
        const that = this;

        // FIND THEM
        dpDataLoader.load(function (data) {
            that.applicationFiles = data['applicationFiles'];
            const idsToDelete = [];
            for (const applicationFile of that.applicationFiles) {
                if (!that.siteRelativePathAndFileNames.includes(applicationFile.relativePathAndFileName)) {
                    that.strayApplicationFiles.push(applicationFile.relativePathAndFileName);
                    idsToDelete.push(applicationFile.id);
                }
            }

            // DELETE THEM
            const dpDataLoader = new DpDataLoader();
            const sql = `DELETE FROM applicationFiles WHERE id IN (${idsToDelete.join(',')})`;
            dpDataLoader.executeSql('delete', sql);
            dpDataLoader.load(function (data) {
                callback();
            });

        });
    }

    fillApplicationFilesRelativePathAndFileNames(applicationFiles) {
        const ra = [];
        for (const applicationFile of this.applicationFiles) {
            ra.push(applicationFile.relativePathAndFileName);
        }
        return ra;
    }

    addNewFilesToDatabase(callback) {
        this.siteRelativePathAndFileNames = qfil.getSiteRelativePathAndFileNames();

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('applicationFiles', `SELECT * FROM applicationFiles`);
        const that = this;

        // FIND THEM
        const toBeAddedFiles = [];
        dpDataLoader.load(function (data) {
            that.applicationFiles = data['applicationFiles'];
            that.applicationFilesRelativePathAndFileNames = that.fillApplicationFilesRelativePathAndFileNames();
            for (const siteRelativePathAndFileName of that.siteRelativePathAndFileNames) {
                if (!that.applicationFilesRelativePathAndFileNames.includes(siteRelativePathAndFileName)) {
                    toBeAddedFiles.push(siteRelativePathAndFileName);
                }
            }

            if (toBeAddedFiles.length > 0) {

                // ADD THEM
                const dpDataLoader = new DpDataLoader();
                for (const toBeAddedFile of toBeAddedFiles) {
                    const sql = `INSERT INTO applicationFiles (relativePathAndFileName, status, systemWhenCreated, systemWhoCreated) VALUES ('${toBeAddedFile}', 'todo', '${qdat.getCurrentDateTime()}', 'dev')`;
                    dpDataLoader.executeSql('addIt', sql);
                }
                dpDataLoader.load(function (data) {
                    that.addedToDatabaseFiles = toBeAddedFiles;
                    that.fillApplicationFilesWithEmptySiteIdCodes(callback);
                });
            } else {
                that.fillApplicationFilesWithEmptySiteIdCodes(callback);
            }
        });
    }

    fillApplicationFilesWithEmptySiteIdCodes(callback) {
        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('withEmptySiteIdCodesApplicationFiles', `SELECT * FROM applicationFiles WHERE siteIdCodes = '' OR siteIdCodes IS NULL`);
        const that = this;
        dpDataLoader.load(function (data) {
            that.withEmptySiteIdCodesApplicationFiles = data['withEmptySiteIdCodesApplicationFiles'];

            //add suggestions
            for (const withEmptySiteIdCodesApplicationFile of that.withEmptySiteIdCodesApplicationFiles) {

                //anything in qtools
                if (
                    qstr.contains(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, 'qtools') ||
                    qstr.startsWith(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, 'system')
                ) {
                    withEmptySiteIdCodesApplicationFile.siteIdCodes = 'core';
                }

                //everything in OLD or dev
                if (
                    qstr.contains(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, 'OLD\\') ||
                    qstr.contains(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, 'dev\\')
                ) {
                    withEmptySiteIdCodesApplicationFile.siteIdCodes = 'dev';
                }

                // various external temp files
                if (withEmptySiteIdCodesApplicationFile.relativePathAndFileName == 'bash.exe.stackdump') {
                    withEmptySiteIdCodesApplicationFile.siteIdCodes = 'ignore';
                }
                if (qstr.contains(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, '.sqlite-')) {
                    withEmptySiteIdCodesApplicationFile.siteIdCodes = 'ignore';
                }

                // all generated files
                if (
                    qstr.contains(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, 'public\\output\\')
                ) {
                    withEmptySiteIdCodesApplicationFile.siteIdCodes = 'ignore';
                }

                // any backup files
                if (qstr.endsWith(withEmptySiteIdCodesApplicationFile.relativePathAndFileName, '.zip')) {
                    withEmptySiteIdCodesApplicationFile.siteIdCodes = 'ignore';
                }
            }

            callback();
        });
    }

    saveSiteIdCodes(applicationFiles, callback) {
        const dpDataLoader = new DpDataLoader();
        for (const applicationFile of applicationFiles) {
            const sql = `UPDATE applicationFiles SET siteIdCodes = '${applicationFile.siteIdCodes}', status='confirmed' WHERE id = ${applicationFile.id}`;
            dpDataLoader.executeSql('update', sql);
        }
        dpDataLoader.load(function (data) {
            callback();
        });
    }

    forceDestroyCreateSiteDirectory() {
        qfil.forceDestroyCreateEmptyDirectory(this.siteRelativeDirectory);
    }

    createSite(callback) {
        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('siteApplicationFiles', this.siteApplicationFilesSql);
        const that = this;
        dpDataLoader.load(function (data) {
            const siteApplicationFiles = data['siteApplicationFiles'];
            for (const siteApplicationFile of siteApplicationFiles) {
                let sourcePathAndFileName = siteApplicationFile.relativePathAndFileName;
                let targetPathAndFileName = that.siteRelativeDirectory + '/' + sourcePathAndFileName;
                sourcePathAndFileName = qstr.replaceAll(sourcePathAndFileName, '\\', '/');
                targetPathAndFileName = qstr.replaceAll(targetPathAndFileName, '\\', '/');
                qfil.forceCopyFile(sourcePathAndFileName, targetPathAndFileName);
            }
            callback();
        });

    }

}

module.exports = SiteGenerator