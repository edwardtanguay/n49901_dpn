const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const path = require('path');
const config = require('../system/config');
const convert = require('xml-js');
const mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;

exports.appendToFile = function (pathAndFileName, content) {
    fs.appendFileSync(pathAndFileName, content);
}
exports.createFileWithStringBlock = function (pathAndFileName, content) {
    fs.writeFileSync(pathAndFileName, content);
}
exports.writeToFile = function (pathAndFileName, content) {
    qfil.createFileWithStringBlock(pathAndFileName, content);
}

exports.createFileWithLines = function (pathAndFileName, lines) {
    const content = qstr.convertLinesToStringBlock(lines);
    return qfil.createFileWithStringBlock(pathAndFileName, content);
}

exports.overwriteFileWithLines = function (pathAndFileName, lines) {
    return qfil.createFileWithLines(pathAndFileName, lines);
}

exports.deleteFile = function (pathAndFileName) {
    if (qfil.fileExists(pathAndFileName)) {
        fs.unlinkSync(pathAndFileName);
    }
}

exports.fileExists = function (pathAndFileName) {
    return fs.existsSync(pathAndFileName);
}
exports.directoryExists = function (pathAndFileName) {
    return qfil.fileExists(pathAndFileName);
}

exports.copyFileAbsolute = function (absoluteSourcePathAndFileName, absoluteTargetPathAndFileName) {
    fs.createReadStream(absoluteSourcePathAndFileName).pipe(fs.createWriteStream(absoluteTargetPathAndFileName));
}

exports.copyFile = function (sourcePathAndFileName, targetPathAndFileName) {
    fs.createReadStream(sourcePathAndFileName).pipe(fs.createWriteStream(targetPathAndFileName));
}

exports.getContentOfDataFile = function (pathAndFileName) {
    const fullPathAndFileName = config.getApplicationPath() + 'data/' + pathAndFileName;
    return fs.readFileSync(fullPathAndFileName, 'utf8');
}
exports.getContentOfDataFileWithFullPathAndFileName = function (fullPathAndFileName) {
    return fs.readFileSync(fullPathAndFileName, 'utf8');
}

exports.getContentOfFile = function (pathAndFileName) {
    const fullPathAndFileName = config.getApplicationPath() + pathAndFileName;
    return fs.readFileSync(fullPathAndFileName, 'utf8');
}

exports.getFileAsLines = function (pathAndFileName) {
    const content = qfil.getContentOfFile(pathAndFileName);
    return qstr.convertStringBlockToLines(content, false);
}

exports.getJsonFromDataFile = function (fullOrRelativePathAndFileName, pathKind = 'relative') {
    let xml = '';
    switch (pathKind) {
        case 'relative':
            xml = qfil.getContentOfDataFile(fullOrRelativePathAndFileName);
            break;
        case 'full':
            xml = qfil.getContentOfDataFileWithFullPathAndFileName(fullOrRelativePathAndFileName);
            break;
        default:
            qdev.debug('error', `bad pathKind "${pathKind}"`);
            return '';
    }
    const jsonText = convert.xml2json(xml, {
        compact: true,
        spaces: 4
    });
    const json = JSON.parse(jsonText);
    return json;
}

exports.saveJsonToFile = function (fullOrRelativePathAndFileName, json, pathKind = 'relative') {
    const xml = convert.json2xml(json, {
        compact: true,
        spaces: 2
    });
    qfil.writeToFile(fullOrRelativePathAndFileName, xml);
    qdev.debug('wrote to', fullOrRelativePathAndFileName);
    // switch (pathKind) {
    //     case 'relative':
    //         xml = qfil.getContentOfDataFile(fullOrRelativePathAndFileName)
    //         break;
    //     case 'full':
    //         xml = qfil.getContentOfDataFileWithFullPathAndFileName(fullOrRelativePathAndFileName)
    //         break;
    //     default:
    //         qdev.debug('error', `bad pathKind "${pathKind}"`);
    //         return '';
    // }
}

exports.getSiteRelativePathAndFileNames = function (absoluteDirectory, files_) {
    absoluteDirectory = absoluteDirectory || config.getApplicationDirectory();
    files_ = files_ || [];
    var files = fs.readdirSync(absoluteDirectory);
    for (var i in files) {
        var absolutePathAndFileName = absoluteDirectory + `\\` + files[i];
        if (!qstr.contains(absolutePathAndFileName, '\\node_modules\\')) {
            absolutePathAndFileName = qstr.replaceAll(absolutePathAndFileName, `\\\\`, `\\`);
            if (fs.statSync(absolutePathAndFileName).isDirectory()) {
                qfil.getSiteRelativePathAndFileNames(absolutePathAndFileName, files_);
            } else {
                const relativePathAndFileName = qfil.getRelativePathAndFileName(absolutePathAndFileName);
                const fixedPathAndFileName = qfil.convertBackSlashesToForwardSlashes(relativePathAndFileName);
                files_.push(fixedPathAndFileName);
            }
        }
    }
    return files_;
}

exports.getRelativePathAndFileName = function (absolutePathAndFileName) {
    return qstr.chopLeft(absolutePathAndFileName, config.getApplicationDirectory());
}

exports.createDirectory = function (relativeDirectoryName) {
    if (!fs.existsSync(relativeDirectoryName)) {
        fs.mkdirSync(relativeDirectoryName);
    }
}

exports.forceDestroyCreateEmptyDirectory = function (relativeDirectoryName) {
    qfil.deleteEverythingInDirectory(relativeDirectoryName);
    if (!fs.existsSync(relativeDirectoryName)) {
        fs.mkdirSync(relativeDirectoryName);
    }
}

exports.deleteEverythingInDirectory = function (relativeDirectoryName) {
    if (qstr.isEmpty(relativeDirectoryName)) {
        return null;
    }
    if (fs.existsSync(relativeDirectoryName)) {
        fs.readdirSync(relativeDirectoryName).forEach(function (file) {
            var curPath = relativeDirectoryName + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                qfil.deleteEverythingInDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(relativeDirectoryName);
    }
}

exports.forceCopyFile = function (sourcePathAndFileName, targetPathAndFileName) {
    const [directory, fileName] = (qfil.getDirectoryAndFileNameFromRelativePathAndFileName(targetPathAndFileName));
    qfil.forceCreateDirectory(directory);
    qfil.copyFile(sourcePathAndFileName, targetPathAndFileName);
}

// e.g. "../n49901_dpnversion/systemPages/createPage.ejs" returns :
// [0] = "../n49901_dpnversion/systemPages"
// [1] = "createPage.ejs"
exports.getDirectoryAndFileNameFromRelativePathAndFileName = function (relativePathAndFileName) {
    if (qstr.contains(relativePathAndFileName, '/')) {
        const parts = qstr.breakIntoParts(relativePathAndFileName, '/');
        const fileName = parts.pop();
        const directory = parts.join('/');
        return [directory, fileName];
    } else {
        return ['', relativePathAndFileName];
    }
}

exports.forceCreateDirectory = function (relativeDirectoryName) {
    mkdirp.sync(relativeDirectoryName);
}

exports.convertBackSlashesToForwardSlashes = function (pathAndFileName) {
    return qstr.replaceAll(pathAndFileName, '\\', '/');
}

exports.forceDestroyDirectory = function (relativeDirectoryName) {
    qfil.deleteEverythingInDirectory(relativeDirectoryName);
}

exports.replaceTextInPathAndFileName = function (pathAndFileName, searchText, replaceText) {
    let fileText = qfil.getContentOfFile(pathAndFileName);
    fileText = qstr.replaceAll(fileText, searchText, replaceText);
    qfil.writeToFile(pathAndFileName, fileText);
}
exports.removeLineWithText = function (pathAndFileName, searchText) {
    const newLines = [];
    const lines = qfil.getFileAsLines(pathAndFileName);
    for (const line of lines) {
        if (!qstr.contains(line, searchText)) {
            newLines.push(line);
        }
    }
    qfil.createFileWithLines(pathAndFileName, newLines);
}

exports.getFileNamesInDirectory = function (relativeDirectory) {
    const fileNames = [];
    if (fs.existsSync(relativeDirectory)) {
        fs.readdirSync(relativeDirectory).forEach(function (fileName) {
            var relativePathAndFileName = relativeDirectory + "/" + fileName;
            if (!fs.lstatSync(relativePathAndFileName).isDirectory()) {
                fileNames.push(fileName);
            }
        });
    }
    return fileNames;
}


exports.getRelativePathFromRelativePathAndFileName = function (relativePathAndFileName) {
    const [relativeDirectory, fileName] = (qfil.getDirectoryAndFileNameFromRelativePathAndFileName(relativePathAndFileName));
    return relativeDirectory + '/';
}

// NOTE: this method had problems deleting the directory from which the files were recently moved, 
// so I had to split this the copying and deleting, saying it was not yet empty
exports.moveDirectory = function (sourceRelativeDirectory, targetRelativeDirectory) {
    let responseIdCode = '';
    if (qfil.directoryExists(sourceRelativeDirectory)) {
        if (qfil.directoryExists(targetRelativeDirectory)) {
            responseIdCode = 'targetRelativeDirectoryAlreadyExists';
        } else {
            qfil.copyDirectory(sourceRelativeDirectory, targetRelativeDirectory);
            responseIdCode = 'success';
        }
    } else {
        responseIdCode = 'sourceRelativeDirectoryDoesNotExist';
    }
    qfil.forceDestroyDirectory(sourceRelativeDirectory);
    return responseIdCode;
}

exports.convertDirectoryToPath = function (directory) {
    return directory + '/';
}

exports.copyDirectory = function (sourceRelativeDirectory, targetRelativeDirectory) {
    const sourceRelativePathAndFileNames = qfil.getSiteRelativePathAndFileNames(sourceRelativeDirectory);
    const sourceRelativePath = qfil.convertDirectoryToPath(sourceRelativeDirectory);
    const targetRelativePath = qfil.convertDirectoryToPath(targetRelativeDirectory);

    for (const sourceRelativePathAndFileName of sourceRelativePathAndFileNames) {
        const innerPathAndFileName = qstr.chopLeft(sourceRelativePathAndFileName, sourceRelativePath);
        const targetRelativePathAndFileName = targetRelativePath + innerPathAndFileName;
        qfil.forceCopyFile(sourceRelativePathAndFileName, targetRelativePathAndFileName);
    }
}

exports.copyDirectoryWithFeedback = function (sourceRelativeDirectory, targetRelativeDirectory) {
    let responseIdCode = '';
    if (qfil.directoryExists(sourceRelativeDirectory)) {
        if (qfil.directoryExists(targetRelativeDirectory)) {
            responseIdCode = 'targetRelativeDirectoryAlreadyExists';
        } else {
            qfil.copyDirectory(sourceRelativeDirectory, targetRelativeDirectory);
            responseIdCode = 'success';
        }
    } else {
        responseIdCode = 'sourceRelativeDirectoryDoesNotExist';
    }
    return responseIdCode;
}

exports.fileContainsText = function (pathAndFileName, text) {
    const content = qfil.getContentOfFile(pathAndFileName);
    return qstr.contains(content, text);
}

exports.replaceTextInFileBetweenTwoLineMarkers = function (pathAndFileName, marker, text) {
    const lines = qfil.getFileAsLines(pathAndFileName);
    let ignoringLines = false;
    const fullMarkerBegin = `//${marker}.begin`;
    const fullMarkerEnd = `//${marker}.end`;
    const newLines = [];
    for (const line of lines) {
        if (qstr.contains(line, fullMarkerBegin)) {
            newLines.push(line);
            newLines.push(text);
            ignoringLines = true;
        }
        if (qstr.contains(line, fullMarkerEnd)) {
            ignoringLines = false;
        }
        if (!ignoringLines) {
            newLines.push(line);
        }
    }
    qfil.overwriteFileWithLines(pathAndFileName, newLines);
}