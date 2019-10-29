"use strict"
const dpdata = require('../systemClasses/dpdata');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qdev = require('../qtools/qdev');

class ShowcaseDataAccessManager {

    static TestAll() {
        const sdam = new ShowcaseDataAccessManager();


        /*

        sdam.TestGetRecordNoParameters(); // #1
        sdam.TestGetRecordWithParameters(); // #2
        sdam.TestGetRecordNoneFound(); // #3

        sdam.TestGetRecordsNoParameters(); // #4
        sdam.TestGetRecordsWithParameters(); // #5
        sdam.TestGetRecordsNoneFound(); // #6

        sdam.TestGetRecordsWithSearch(); // #7

        sdam.TestInsertWithNewId(); // #8
        sdam.TestInsert(); // #9
        //sdam.TestInsertWithParameters(); // #9.5 (9 and 9.5 conflict, so call them inside each other)

        sdam.TestDelete(); // #10
        sdam.TestUpdate(); // #11


        // these you have to test individually 
        //sdam.TestCreateTableAndFill(); // #12
        //sdam.TestDropTable(); // #13

        // this only works reliably by itself
        //sdam.TestHandleError(); // #00


        */

        // NOTE: IF YOU ARE SENDING MORE THAN ONE COMMAND TO CHANGE THE DATABASE, THEN CHAIN IT TO PREVENT CONFLICTS AND ABORTS
        // BUT YOU CAN SEND AS MANY QUERY COMMANDS AS YOU WANT

        sdam.TestInsert(); // #9

        // dpDataLoader
        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordWithSql('showcaseUser1', 'SELECT * FROM showcaseUsers WHERE id=4');
        dpDataLoader.getRecordWithSql('showcaseUser2', 'SELECT * FROM showcaseUsers WHERE id=?', [3]);
        dpDataLoader.getRecordsWithSql('showcaseBooks', 'SELECT * FROM showcaseBooks');
        dpDataLoader.getRecordsWithSql('showcaseUsers', 'SELECT * FROM showcaseUsers');
        dpDataLoader.getRecordsWithSearch('searchResults', 'showcaseUsers', 'er', ['firstName', 'lastName']);
        // dpDataLoader.executeSql('newShowcaseBookResult', "INSERT INTO showcaseBooks (title, author) VALUES ('Book 111', 'Jim Atkins')");
        // dpDataLoader.executeSql('newShowcaseBookWithParameters', "INSERT INTO showcaseBooks (title, author) VALUES(?, ?)", ["Book 222", "Helga Authoria"]);
        // dpDataLoader.executeSql('deleteShowcaseBook', "DELETE FROM showcaseBooks WHERE id=323");


        dpDataLoader.load(function(data) {
            const showcaseUser1 = data['showcaseUser1'];
            const showcaseUser2 = data['showcaseUser2'];
            const showcaseBooks = data['showcaseBooks'];
            const showcaseUsers = data['showcaseUsers'];
            const searchResults = data['searchResults'];
            // const newShowcaseBookResult = data['newShowcaseBookResult'];
            // const newShowcaseBookWithParameters = data['newShowcaseBookWithParameters'];
            // const deleteShowcaseBook = data['deleteShowcaseBook'];
            console.log(`The first showcase user is ${showcaseUser1.lastName}.`);
            console.log(`The second showcase user (with parameters) is ${showcaseUser2.lastName}.`);
            console.log(`There are ${showcaseBooks.length} showcase books.`);
            console.log(`There are ${showcaseUsers.length} showcase users.`);
            console.log(`There are ${searchResults.length} search results.`);

            //note: the ids that come back here are always the same and the last id that was added
            // console.log(`The status of adding the first showcase book was ${newShowcaseBookResult.status} and the id added was ${newShowcaseBookResult.id}.`);
            // console.log(`The status of adding the second showcase book was ${newShowcaseBookWithParameters.status} and the id added was ${newShowcaseBookWithParameters.id}.`);
            // console.log(`Deleted the book`);
        });



/*
    TestDelete() {
        const sql = ``; // to test this, change to delete a specific record that you know exists
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#10 TestDelete:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`deleted`);
            }                   
        });
    }

    TestUpdate() {
        const sql = `UPDATE showcaseBooks SET author="new author" WHERE id=137`; // to test this, change to edit a specific record that you know exists
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#11 TestUpdate:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`updated`);
            }             
        });
    }
    */        

    }

    // GET RECORD

    TestGetRecordNoParameters() {
        const that = this;
        dpdata.getRecordWithSql('SELECT * FROM showcaseUsers WHERE id=2', null, function (record) {
            that._displaySubtitle("#1 TestGetRecordNoParameters:");
            console.log(`The last name is "${record.lastName}".`);
        });
    }
    TestGetRecordWithParameters() {
        const id = 3;
        const lastName = "Meyer";
        const that = this;
        dpdata.getRecordWithSql('SELECT * FROM showcaseUsers WHERE id=? AND lastName=?', [id, lastName], function (record) {
            that._displaySubtitle("#2 TestGetRecordWithParameters:");
            if (record == null) {
                console.log(`RECORD WAS NOT FOUND.`);
            } else {
                console.log(`The last name is "${record.lastName}" and id = ${record.id}.`);
            }
        });
    }
    TestGetRecordNoneFound() {
        const that = this;
        dpdata.getRecordWithSql('SELECT * FROM showcaseUsers WHERE id=99999', null, function (record) {
            that._displaySubtitle("#3 TestGetRecordNoneFound:");
            if (record == null) {
                console.log(`RECORD WAS NOT FOUND.`);
            } else {
                console.log(`The last name is "${record.lastName}".`);
            }
        });
    }

    // GET RECORDS

    TestGetRecordsNoParameters() {
        const that = this;
        dpdata.getRecordsWithSql('SELECT * FROM showcaseUsers ORDER BY id DESC', null, function (records) {
            that._displaySubtitle("#4 TestGetRecordsNoParameters:");
            for (const record of records) {
                console.log(`id = ${record.id}, lastName = ${record.lastName}`);
            }
        });
    }

    TestGetRecordsWithParameters() {
        const status = "inactive";
        const minimumDisplayOrder = 0;
        const that = this;
        dpdata.getRecordsWithSql('SELECT * FROM showcaseUsers WHERE status = ? AND displayOrder > ?', [status, minimumDisplayOrder], function (records) {
            that._displaySubtitle("#5 TestGetRecordsWithParameters:");
            for (const record of records) {
                console.log(`status = ${record.status}, displayOrder = ${record.displayOrder}, lastName = ${record.lastName}`);
            }
        });
    }

    TestGetRecordsNoneFound() {
        const status = "BADDATA";
        const that = this;
        dpdata.getRecordsWithSql('SELECT * FROM showcaseUsers WHERE status = ?', [status], function (records) {
            that._displaySubtitle("#6 TestGetRecordsNoneFound:");
            if (records.length == 0) {
                console.log("NO RECORDS FOUND");
            } else {
                for (const record of records) {
                    console.log(`status = ${record.status}, lastName = ${record.lastName}`);
                }
            }
        });
    }

    // RECORDS WITH SEARCH

    TestGetRecordsWithSearch() {
        const searchString = 'ra im';
        const that = this;
        dpdata.getRecordsWithSearch('showcaseUsers', searchString, ['firstName', 'lastName'], function (records) {
            that._displaySubtitle("#7 TestGetRecordsWithSearch:");
            for (const record of records) {
                console.log(`id = ${record.id}, status = ${record.status}, displayOrder = ${record.displayOrder}, firstName = ${record.firstName}, lastName = ${record.lastName}`);
            }
        });
    }

    // CHANGE DATABASE

    TestInsertWithNewId() {
        const sql = "INSERT INTO showcaseUsers (login, password, firstName, lastName, status, accessGroups, displayOrder, createdAt, updatedAt) VALUES('tempUser', '310dcqbf4cce62f762a2aaa148d556bd', 'Temp', 'User', 'active', 'developers,loggedInUsers', 10, '2018-05-16 14:52:20.358 +00:00', '2018-05-16 14:52:20.358 +00:00')";
        const that = this;
        dpdata.executeSql(sql, null, function (status, error, id) {
            that._displaySubtitle("#8 TestInsertWithNewId:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`TestInsertWithNewId: inserted id was ${id}`);
            }            
        });
    }

    TestInsert() {
        const sql = `INSERT INTO showcaseBooks (title, author) VALUES ('The Book of Tests', 'Jim Atkins')`;
        const that = this;
        dpdata.executeSql(sql, null, function (status, error, id) {
            that._displaySubtitle("#9 TestInsert:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`record added to showcaseBooks with id=${id}`);
                that.TestInsertWithParameters(); //run other inserts here after finished
            }
        });
    }

    TestInsertWithParameters() {
        const title = "title WITH PARAMS";
        const author = "author WITH PARAMS";
        const sql = `INSERT INTO showcaseBooks (title, author) VALUES(?, ?)`;
        const that = this;
        dpdata.executeSql(sql, [title, author], function (status, error, id) {
            that._displaySubtitle("#9.5 TestWithParameters:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`record added to showcaseBooks with id=${id}`);
            }                
        });
    }

    TestDelete() {
        const sql = `DELETE FROM showcaseBooks WHERE id=135`; // to test this, change to delete a specific record that you know exists
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#10 TestDelete:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`deleted`);
            }                   
        });
    }

    TestUpdate() {
        const sql = `UPDATE showcaseBooks SET author="new author" WHERE id=137`; // to test this, change to edit a specific record that you know exists
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#11 TestUpdate:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`updated`);
            }             
        });
    }

    TestCreateTableAndFill() {
        const sql = `CREATE TABLE showcaseTests (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
            title TEXT, 
            description TEXT, 
            numberOfPages INTEGER, 
            createdAt DATETIME, 
            updatedAt DATETIME)`;
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#12 TestCreateDeleteTables - PART 1:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`table created`);
                const sql2 = `INSERT INTO showcaseTests (title, description) VALUES('This is a test added right after table creation.', 'The description.')`;
                dpdata.executeSql(sql2, null, function (status, error) {
                    that._displaySubtitle("#12 TestCreateDeleteTables - PART 2:");
                    if (status == 'error') {
                        console.log('ERROR: ' + error.message);
                    } else {
                        console.log(`one record created in new table`);
                    }   
                });                
            }   
        });
    }

    TestDropTable() {
        const sql = `DROP TABLE showcaseTests`;
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#13 TestDropTable:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`table dropped`);
            }               
        });
    }


    // only seems to work reliably if it is executed by itself
    TestHandleError() {
        const sql = `DELETE FROM nnnnnnnnnnnnnnnnnnnnnn WHERE id=19`;
        const that = this;
        dpdata.executeSql(sql, null, function (status, error) {
            that._displaySubtitle("#00 TestHandleError:");
            if (status == 'error') {
                console.log('ERROR: ' + error.message);
            } else {
                console.log(`successful, i.e. no error`);
            } 
        });
    }





    _displaySubtitle(subtitle) {
        console.log('--------------');
        console.log('>>> ' + subtitle);
    }

    _displayLine(line) {
        console.log('--------------');
        console.log(line);
    }

}

module.exports = ShowcaseDataAccessManager