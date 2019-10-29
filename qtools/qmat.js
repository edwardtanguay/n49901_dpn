exports.getRandomItemFromArray = function (items) {
	return items[Math.floor(Math.random() * items.length)];
}

exports.getRandomNumber = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.isInteger = function (potentialInteger) {
	return (
		!isNaN(potentialInteger) &&
		parseInt(Number(potentialInteger)) == potentialInteger &&
		!isNaN(parseInt(potentialInteger, 10))
	);
};

exports.forceInteger = function (potentialInteger) {
	return parseInt(potentialInteger);
};

exports.formatMoney = function (number, decPlaces, decSep, thouSep) {
	decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
		decSep = typeof decSep === "undefined" ? "." : decSep;
	thouSep = typeof thouSep === "undefined" ? "," : thouSep;
	var sign = number < 0 ? "-" : "";
	var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
	var j = (j = i.length) > 3 ? j % 3 : 0;

	return sign +
		(j ? i.substr(0, j) + thouSep : "") +
		i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
		(decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}


