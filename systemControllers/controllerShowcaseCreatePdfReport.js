"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qdat = require('../qtools/qdat');
const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');

class ControllerShowcaseCreatePdfReport extends Controller {
    constructor(request, response) {
        super(request, response);
    }
    

    customFormValidation(field, errors) {
        // if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
        //     this.addFormError(field, 'should not contain a period character');
        // }
    }

    action_loadPageData() {
        this.responseStatus = 'loaded';
        this.formTypeDefinitionFieldBlock = `
       
        `;
        this.responseData = {};

        this.prepareFields();
        this.sendResponse();
    }

    action_processForm() {
        const pdfPathAndFileName = 'output/showcasePdfReport.pdf';

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('showcaseBooks', 'SELECT * FROM showcaseBooks');
        const test = '23';
        const that = this;
        dpDataLoader.load(function (data) {

            const showcaseBooks = data['showcaseBooks'];

            var fonts = {
                Roboto: {
                    normal: 'fonts/Roboto-Regular.ttf',
                    bold: 'fonts/Roboto-Bold.ttf',
                    italics: 'fonts/Roboto-Italic.ttf',
                    bolditalics: 'fonts/Roboto-BoldItalic.ttf'
                }
            };
            var printer = new PdfPrinter(fonts);
            const content = [];

            that.reportTitle = "Showcase Books";


            /* TITLE PAGE */

            content.push({
                margin: [0, 5, 20, 20],
                text: that.reportTitle,
                alignment: 'right',
                fontSize: 35
            });

            content.push({ text: '', pageBreak: 'after' });

            /* MAIN PAGES */

            const tableData = that.getTableData(showcaseBooks);


            that.addTableToContent(content, 'Showcase Books:', tableData);


            /* NOW PRINT IT ALL TOGETHER */
            var dd = {
                pageMargins: [40, 60, 40, 60],
                content: content,
                header: function (page, pages) {
                    if (page != 1) {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    text: that.reportTitle,
                                    fontSize: 9
                                },
                                {
                                    alignment: 'right',
                                    text: [
                                        { text: page.toString(), fontSize: 9 },
                                        { text: ' of ', fontSize: 9 },
                                        { text: pages.toString(), fontSize: 9 }
                                    ]
                                }
                            ],
                            margin: [40, 30, 40, 0]
                        };
                    } else {
                        return null;
                    }
                },
                footer: function (page, pages) {

                    if (page != 1) {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    text: 'Printed: ' + qdat.getCurrentDateTime(),
                                    fontSize: 9
                                },
                                {
                                    alignment: 'right',
                                    text: [
                                        { text: page.toString(), fontSize: 9 },
                                        { text: ' of ', fontSize: 9 },
                                        { text: pages.toString(), fontSize: 9 }
                                    ]
                                }
                            ],
                            margin: [40, 10]
                        };
                    } else {
                        return null;
                    }
                },
                styles: {
                    header: {
                        fontSize: 15,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 9,
                        color: 'black'
                    },
                    tableData: {
                        bold: false,
                        fontSize: 9,
                        color: 'black'
                    },
                    hyperlink: {
                        decoration: "underline",
                        color: 'blue'
                    }
                }
            }




            var pdfDoc = printer.createPdfKitDocument(dd);
            pdfDoc.pipe(fs.createWriteStream('public/' + pdfPathAndFileName)).on('finish', function () {

                that.formStatus = 'success';
                that.formMessage = `View the generated PDF Report <a target="_blank" href="${pdfPathAndFileName}">here</a>.`;
    
                that.sendResponse();
            });
            pdfDoc.end();


        });


    }


    getTableData(showcaseBooks) {
        const tableData = [
            [
                { text: 'Title', style: 'tableHeader' },
                { text: 'Description', style: 'tableHeader' },
                { text: 'Author', style: 'tableHeader' },
                { text: 'Number of Pages', style: 'tableHeader' }
            ]
        ];
        for (const record of showcaseBooks) {
            tableData.push(
                [record.title, record.description, record.author, {text: record.numberOfPages, alignment: 'right'}]
            );
        }
        return tableData;
    }

    addTableToContent(content, title, tableData) {

        content.push({ text: title, style: 'header', margin: [0, 0, 0, 5] });

        content.push({
            style: 'tableExample',
            margin: [0, 0, 0, 20],
            table: {
                widths: ['auto', 'auto', 70, 'auto'],
                body: tableData
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? .5 : .5;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? .5 : .5;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? '#bbb' : '#bbb';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? '#bbb' : '#bbb';
                },
                fillColor: function (rowIndex, node, columnIndex) {
                    if (rowIndex != 0 && columnIndex == 1) {
                        return '#D8E4BC';
                    } else if (rowIndex != 0 && columnIndex == 2) {
                        return '#DCE6F1';
                    } else if (rowIndex == 0) {
                        return '#ccc';
                    } else {
                        return null
                    }
                }
            }
        });

    }


}

module.exports = ControllerShowcaseCreatePdfReport