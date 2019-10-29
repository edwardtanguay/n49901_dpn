const qarr = require('../qtools/qarr');
const qdev = require('../qtools/qdev');

exports.sortArrayOfObjects = function (arr, prop) {
	return arr.sort(qarr._sortObjects(prop));
}

exports._sortObjects = function (prop) {
	var sortOrder = 1;
	if (prop[0] === "-") {
		sortOrder = -1;
		prop = prop.substr(1);
	}
	return function (a, b) {
		var result = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
		return result * sortOrder;
	}
}

exports.multisort = function (arr, columns, order_by) {
	if (arr == undefined || arr.length <= 1) {
		return arr;
	}
	if (typeof columns == 'undefined') {
		columns = []
		for (x = 0; x < arr[0].length; x++) {
			columns.push(x);
		}
	}

	if (typeof order_by == 'undefined') {
		order_by = []
		for (x = 0; x < arr[0].length; x++) {
			order_by.push('asc');
		}
	}

	function multisort_recursive(a, b, columns, order_by, index) {
		var direction = order_by[index] == 'desc' ? 1 : 0;

		var is_numeric = !isNaN(a[columns[index]] - b[columns[index]]);

		var x = is_numeric ? a[columns[index]] : a[columns[index]].toLowerCase();
		var y = is_numeric ? b[columns[index]] : b[columns[index]].toLowerCase();

		if (!is_numeric) {
			x = a[columns[index]].toLowerCase(), b[columns[index]].toLowerCase();
		}

		if (x < y) {
			return direction == 0 ? -1 : 1;
		}

		if (x == y) {
			return columns.length - 1 > index ? multisort_recursive(a, b, columns, order_by, index + 1) : 0;
		}

		return direction == 0 ? 1 : -1;
	}

	return arr.sort(function (a, b) {
		return multisort_recursive(a, b, columns, order_by, 0);
	});
}

exports.getSumOfProperty = function (objs, property) {
	let sum = 0;
	for (const obj of objs) {
		const propertyValue = parseInt(obj[property]);
		sum += propertyValue;
	}
	return sum;
}

exports.shuffle = function (array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}