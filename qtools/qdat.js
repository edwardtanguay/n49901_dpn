const qdat = require('../qtools/qdat');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const qdev = require('../qtools/qdev');

exports.getCurrentDateTime = function () {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	if (month.toString().length == 1) {
		month = '0' + month;
	}
	if (day.toString().length == 1) {
		day = '0' + day;
	}
	if (hour.toString().length == 1) {
		hour = '0' + hour;
	}
	if (minute.toString().length == 1) {
		minute = '0' + minute;
	}
	if (second.toString().length == 1) {
		second = '0' + second;
	}
	var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	return dateTime;
}

exports.getCurrentDate = function () {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	if (month.toString().length == 1) {
		month = '0' + month;
	}
	if (day.toString().length == 1) {
		day = '0' + day;
	}
	var dateTime = year + '-' + month + '-' + day;
	return dateTime;
}

exports.getCurrentDateGermanFormat = function () {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	if (month.toString().length == 1) {
		month = '0' + month;
	}
	if (day.toString().length == 1) {
		day = '0' + day;
	}
	var dateTime = day + '.' + month + '.' + year;
	return dateTime;
}

exports.getCurrentDateAmericanFormat = function () {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	if (month.toString().length == 1) {
		month = '0' + month;
	}
	if (day.toString().length == 1) {
		day = '0' + day;
	}
	var dateTime = month + '/' + day + '/' + year;
	return dateTime;
}

//2018-12-31 to 31.12.2018 
exports.formatDateAsGermanDate = function (date) {
	const year = date.substring(0, 4);
	const month = date.substring(5, 7);
	const day = date.substring(8, 10);
	return day + '.' + month + '.' + year;
}

exports.formatDateAsAmericanDate = function (date) {
	const year = date.substring(0, 4);
	const month = date.substring(5, 7);
	const day = date.substring(8, 10);
	return month + '/' + day + '/' + year;
}

exports.formatDateTimeAsStandardDate = function (date) {
	const year = date.substring(0, 4);
	const month = date.substring(5, 7);
	const day = date.substring(8, 10);
	return year + '-' + month + '-' + day;
}

// 2018-12-11T18:00:00 --> 2018-12-11 18:00:00
exports.convertTDateTimeToStandardDateTime = function (tDateTime) {
	return qstr.replaceAll(tDateTime, 'T', ' ');
}

// Apr 03
exports.getShortMonthDay = function (dateTime) {
	if (dateTime == null) {
		dateTime = '';
	}
	const year = dateTime.substring(0, 4);
	const month = dateTime.substring(5, 7);
	const niceDay = qstr.padZeros(dateTime.substring(8, 10), 2);
	const niceMonth = qdat.getAbbreviatedMonthByMonthNumber(month);
	return `${niceMonth} ${niceDay}`;
}

// Apr 03, 2019
exports.getShortMonthDayYear = function (dateTime) {
	if (dateTime == null) {
		dateTime = '';
	}
	const year = dateTime.substring(0, 4);
	const month = dateTime.substring(5, 7);
	const niceDay = qstr.padZeros(dateTime.substring(8, 10), 2);
	const niceMonth = qdat.getAbbreviatedMonthByMonthNumber(month);
	return `${niceMonth} ${niceDay}, ${year}`;
}

exports.getAbbreviatedMonthByMonthNumber = function (monthNumberPerhapsInt) {
	return qdat.getMonthByMonthNumber(monthNumberPerhapsInt).substring(0, 3);
}

exports.getMonthByMonthNumber = function (monthNumberPerhapsInt) {
	monthNumber = qmat.forceInteger(monthNumberPerhapsInt);
	switch (monthNumber) {
		case 1:
			return 'January'
		case 2:
			return 'February'
		case 3:
			return 'March'
		case 4:
			return 'April'
		case 5:
			return 'May'
		case 6:
			return 'June'
		case 7:
			return 'July'
		case 8:
			return 'August'
		case 9:
			return 'September'
		case 10:
			return 'October'
		case 11:
			return 'November'
		case 12:
			return 'December'
	}
	return 'UNKNOWN MONTH NUMBER: ' + monthNumber;
}

// 2017-05-03 09:30
exports.standardizeDateTime = function (questionableDateTime) {
	let fixedDateTime = questionableDateTime;
	if (fixedDateTime.length == 16) {
		fixedDateTime += ':00';
	}
	const theDate = new Date(fixedDateTime);
	return fixedDateTime;
}

exports.getMinutesBetweenTwoDateTimes = function (dateTime1, dateTime2) {
	const theDateTime1 = new Date(dateTime1);
	const theDateTime2 = new Date(dateTime2);
	const milliseconds = theDateTime2.getTime() - theDateTime1.getTime();
	const minutes = milliseconds / 60000;
	return minutes;
}

exports.getDateFromDateTime = function (dateTime) {
	return dateTime.substr(0, 10);
}

exports.dateTimeIsToday = function (dateTime) {
	const todaysDate = qdat.getCurrentDate();
	const date = qdat.getDateFromDateTime(dateTime);
	return qstr.areEqual(todaysDate, date);
}

exports.dateTimeIsCertainDate = function (dateTime, targetDate) {
	const date = qdat.getDateFromDateTime(dateTime);
	return qstr.areEqual(targetDate, date);
}

// e.g. "09:30" from 2017-05-03 09:30:00
exports.getShortTimeFromDateTime = function (dateTime) {
	return dateTime.substr(11, 5);
}

exports.getDayOfWeekNumber = function (dateTime) {
	const d = new Date(dateTime);
	return d.getUTCDay();
}

// Wed, Apr 15
exports.getShortMonthWithWeekDay = function (dateTime, options = { fullWeekDay: false }) {
	const weekDayNumber = qdat.getDayOfWeekNumber(dateTime);

	let weekDay = '';
	const fullWeekDayName = qdat.getWeekDayNameFromWeekDayNumber(weekDayNumber);
	if (options.fullWeekDay) {
		weekDay = fullWeekDayName;
	} else {
		weekDay = fullWeekDayName.substr(0, 3);
	}
	return weekDay + ', ' + qdat.getShortMonthDay(dateTime);
}

exports.getWeekDayNameFromWeekDayNumber = function (weekDayNumber) {
	switch (weekDayNumber) {
		case 0:
			return 'Sunday';
		case 1:
			return 'Monday';
		case 2:
			return 'Tuesday';
		case 3:
			return 'Wednesday';
		case 4:
			return 'Thursday';
		case 5:
			return 'Friday';
		case 6:
			return 'Saturday';
	}
}

exports.getAbbreviatedMonthByMonthNumberGerman = function (monthNumberPerhapsInt) {
	return qdat.getMonthByMonthNumberGerman(monthNumberPerhapsInt).substring(0, 3);
}

exports.getShortMonthWithWeekDay = function (dateTime, options = { fullWeekDay: false }) {
	const weekDayNumber = qdat.getDayOfWeekNumber(dateTime);

	let weekDay = '';
	const fullWeekDayName = qdat.getWeekDayNameFromWeekDayNumber(weekDayNumber);
	if (options.fullWeekDay) {
		weekDay = fullWeekDayName;
	} else {
		weekDay = fullWeekDayName.substr(0, 3);
	}
	return weekDay + ', ' + qdat.getShortMonthDay(dateTime);
}

exports.getShortMonthWithWeekDayGerman = function (dateTime, options = { fullWeekDay: false }) {
	const weekDayNumber = qdat.getDayOfWeekNumber(dateTime);

	let weekDay = '';
	const fullWeekDayName = qdat.getWeekDayNameFromWeekDayNumberGerman(weekDayNumber);
	if (options.fullWeekDay) {
		weekDay = fullWeekDayName;
	} else {
		weekDay = fullWeekDayName.substr(0, 2) + '.';
	}
	return weekDay + ', den ' + qdat.getShortMonthDayGerman(dateTime);
}

exports.getWeekDayNameFromWeekDayNumberGerman = function (weekDayNumber) {
	switch (weekDayNumber) {
		case 0:
			return 'Sonntag';
		case 1:
			return 'Montag';
		case 2:
			return 'Dienstag';
		case 3:
			return 'Mittwoch';
		case 4:
			return 'Donnerstag';
		case 5:
			return 'Freitag';
		case 6:
			return 'Samstag';
	}
}

// if valid date in form 2019-11-22
exports.isStandardDate = function (potentionalDate) {
	if (potentionalDate.length == 10 && qstr.regexCheck(potentionalDate, "\\d{4}-[01]\\d-[0-3]\\d")) {
		if (qdat.isDate(potentionalDate)) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

exports.isDate = function (potentialDate) {
	const timestamp = Date.parse(potentialDate);
	if (isNaN(timestamp) == false) {
		return true;
	} else {
		return false;
	}
}

exports.getShortMonthDayGerman = function (dateTime) {
	if (dateTime == null) {
		dateTime = '';
	}
	const year = dateTime.substring(0, 4);
	const month = dateTime.substring(5, 7);
	const niceDay = qstr.padZeros(dateTime.substring(8, 10), 2);
	const niceMonth = qdat.getMonthByMonthNumberGerman(month);
	return `${niceDay}. ${niceMonth}`;
}


exports.getMonthByMonthNumberGerman = function (monthNumberPerhapsInt) {
	monthNumber = qmat.forceInteger(monthNumberPerhapsInt);
	switch (monthNumber) {
		case 1:
			return 'Januar'
		case 2:
			return 'Februar'
		case 3:
			return 'März'
		case 4:
			return 'April'
		case 5:
			return 'Mai'
		case 6:
			return 'Juni'
		case 7:
			return 'Juli'
		case 8:
			return 'August'
		case 9:
			return 'September'
		case 10:
			return 'Oktober'
		case 11:
			return 'November'
		case 12:
			return 'Dezember'
	}
	return 'UNKNOWN MONTH NUMBER: ' + monthNumber;
}

exports.addDaysToDate = function (date, daysToAdd) {
	const dt = new Date(date);
	dt.setDate(dt.getDate() + daysToAdd);
	return dt.toISOString().split('T')[0];
}

exports.getMonthNumberFromYearMonth = function (yearMonth) {
	return yearMonth.substr(5, 2);
}
exports.getYearFromYearMonth = function (yearMonth) {
	return yearMonth.substr(0, 4);
}

// "2020-03" to "March 2020"
exports.convertYearMonthToNiceYearMonth = function (yearMonth) {
	const monthNumber = qstr.forceAsInteger(qdat.getMonthNumberFromYearMonth(yearMonth));
	const year = qdat.getYearFromYearMonth(yearMonth);
	const monthName = qdat.getMonthByMonthNumber(monthNumber);
	return `${monthName} ${year}`;
}