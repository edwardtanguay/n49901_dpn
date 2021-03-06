"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qmat = require('../qtools/qmat');

class ControllerShowcaseES6MapFunction extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};
		let messages = [];

		const numbers = [1, 2, 5, 78, 564];
		const doubles = numbers.map(m => m * 2);
		const descriptions = numbers.map(m => this.getDescription(m));

		messages.push(`Numbers are ${numbers.join(', ')}.`);
		messages.push(`Doubles are ${doubles.join(', ')}.`);
		messages.push(`Descriptions are ${descriptions.join(', ')}.`);
		messages.push(`All customer IDs: ${this.getCustomers().map(m => m.customerID).join(', ')}.`);

		// map() to search in spectific property
		messages.push(`New customer objects with "the" in the name: ` + JSON.stringify(this.getCustomers().map(m => { return { id: m.customerID, name: m.companyName }; }).filter(m => m.name.toLowerCase().includes('the'))));

		// map/filter with a format function
		messages.push(`Product prices: ${this.getProducts().map(m => qmat.formatMoney(m.unitPrice)).join(', ')}.`);

		// reduce() to find total
		messages.push(`Total price: ${qmat.formatMoney(this.getProducts().reduce((total, m) => { return total + m.unitPrice }, 0))}.`);

		// reduce() to find the most expensive
		messages.push(`Most expensive product is: ${JSON.stringify(this.getProducts().reduce((mostExpensive, m) => { return mostExpensive.unitPrice > m.unitPrice ? mostExpensive : m }, {}))}.`);

		// find() to find a unique record
		const record = this.getProducts().find(m => m.productID == 8);
		messages.push(`Unique Record: ${record ? record.name : '(not found)'}`);

		this.responseData.messages = messages;
		this.sendResponse();
	}

	getDescription(number) {
		let r = ''
		if (number > 100) {
			r = 'high';
		} else if (number > 50) {
			r = 'medium';
		} else {
			r = 'low';
		}
		return r;
	}

	// more data at: https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/northwind/data/json 
	getProducts() {
		return [
			{
				"productID": 4,
				"supplierID": 2,
				"categoryID": 2,
				"quantityPerUnit": "48 - 6 oz jars",
				"unitPrice": 21,
				"unitsInStock": 53,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Chef Anton's Cajun Seasoning"
			},
			{
				"productID": 5,
				"supplierID": 2,
				"categoryID": 2,
				"quantityPerUnit": "36 boxes",
				"unitPrice": 21.35,
				"unitsInStock": 0,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": true,
				"name": "Chef Anton's Gumbo Mix"
			},
			{
				"productID": 6,
				"supplierID": 3,
				"categoryID": 2,
				"quantityPerUnit": "12 - 8 oz jars",
				"unitPrice": 254.32,
				"unitsInStock": 120,
				"unitsOnOrder": 0,
				"reorderLevel": 25,
				"discontinued": false,
				"name": "Grandma's Boysenberry Spread"
			},
			{
				"productID": 7,
				"supplierID": 3,
				"categoryID": 7,
				"quantityPerUnit": "12 - 1 lb pkgs.",
				"unitPrice": 30,
				"unitsInStock": 15,
				"unitsOnOrder": 0,
				"reorderLevel": 10,
				"discontinued": false,
				"name": "Uncle Bob's Organic Dried Pears"
			},
			{
				"productID": 8,
				"supplierID": 3,
				"categoryID": 2,
				"quantityPerUnit": "12 - 12 oz jars",
				"unitPrice": 40,
				"unitsInStock": 6,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Northwoods Cranberry Sauce"
			},
			{
				"productID": 9,
				"supplierID": 4,
				"categoryID": 6,
				"quantityPerUnit": "18 - 500 g pkgs.",
				"unitPrice": 97,
				"unitsInStock": 29,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": true,
				"name": "Mishi Kobe Niku"
			},
			{
				"productID": 10,
				"supplierID": 4,
				"categoryID": 8,
				"quantityPerUnit": "12 - 200 ml jars",
				"unitPrice": 31,
				"unitsInStock": 31,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Ikura"
			},
			{
				"productID": 2,
				"supplierID": 1,
				"categoryID": 1,
				"quantityPerUnit": "24 - 12 oz bottles",
				"unitPrice": 19,
				"unitsInStock": 17,
				"unitsOnOrder": 40,
				"reorderLevel": 25,
				"discontinued": false,
				"name": "Chang"
			},
			{
				"productID": 3,
				"supplierID": 1,
				"categoryID": 2,
				"quantityPerUnit": "12 - 550 ml bottles",
				"unitPrice": 10,
				"unitsInStock": 13,
				"unitsOnOrder": 70,
				"reorderLevel": 25,
				"discontinued": false,
				"name": "Aniseed Syrup"
			},
			{
				"productID": 11,
				"supplierID": 5,
				"categoryID": 4,
				"quantityPerUnit": "1 kg pkg.",
				"unitPrice": 21,
				"unitsInStock": 22,
				"unitsOnOrder": 30,
				"reorderLevel": 30,
				"discontinued": false,
				"name": "Queso Cabrales"
			},
			{
				"productID": 12,
				"supplierID": 5,
				"categoryID": 4,
				"quantityPerUnit": "10 - 500 g pkgs.",
				"unitPrice": 38,
				"unitsInStock": 86,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Queso Manchego La Pastora"
			},
			{
				"productID": 13,
				"supplierID": 6,
				"categoryID": 8,
				"quantityPerUnit": "2 kg box",
				"unitPrice": 6,
				"unitsInStock": 24,
				"unitsOnOrder": 0,
				"reorderLevel": 5,
				"discontinued": false,
				"name": "Konbu"
			},
			{
				"productID": 14,
				"supplierID": 6,
				"categoryID": 7,
				"quantityPerUnit": "40 - 100 g pkgs.",
				"unitPrice": 23.25,
				"unitsInStock": 35,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Tofu"
			},
			{
				"productID": 15,
				"supplierID": 6,
				"categoryID": 2,
				"quantityPerUnit": "24 - 250 ml bottles",
				"unitPrice": 15.5,
				"unitsInStock": 39,
				"unitsOnOrder": 0,
				"reorderLevel": 5,
				"discontinued": false,
				"name": "Genen Shouyu"
			},
			{
				"productID": 1,
				"supplierID": 1,
				"categoryID": 1,
				"quantityPerUnit": "10 boxes x 20 bags",
				"unitPrice": 18,
				"unitsInStock": 39,
				"unitsOnOrder": 0,
				"reorderLevel": 10,
				"discontinued": false,
				"name": "Chai"
			},
			{
				"productID": 16,
				"supplierID": 7,
				"categoryID": 3,
				"quantityPerUnit": "32 - 500 g boxes",
				"unitPrice": 17.45,
				"unitsInStock": 29,
				"unitsOnOrder": 0,
				"reorderLevel": 10,
				"discontinued": false,
				"name": "Pavlova"
			},
			{
				"productID": 17,
				"supplierID": 7,
				"categoryID": 6,
				"quantityPerUnit": "20 - 1 kg tins",
				"unitPrice": 39,
				"unitsInStock": 0,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": true,
				"name": "Alice Mutton"
			},
			{
				"productID": 18,
				"supplierID": 7,
				"categoryID": 8,
				"quantityPerUnit": "16 kg pkg.",
				"unitPrice": 62.5,
				"unitsInStock": 42,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Carnarvon Tigers"
			},
			{
				"productID": 19,
				"supplierID": 8,
				"categoryID": 3,
				"quantityPerUnit": "10 boxes x 12 pieces",
				"unitPrice": 9.2,
				"unitsInStock": 25,
				"unitsOnOrder": 0,
				"reorderLevel": 5,
				"discontinued": false,
				"name": "Teatime Chocolate Biscuits"
			},
			{
				"productID": 20,
				"supplierID": 8,
				"categoryID": 3,
				"quantityPerUnit": "30 gift boxes",
				"unitPrice": 81,
				"unitsInStock": 40,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Sir Rodney's Marmalade"
			},
			{
				"productID": 24,
				"supplierID": 10,
				"categoryID": 1,
				"quantityPerUnit": "12 - 355 ml cans",
				"unitPrice": 4.5,
				"unitsInStock": 20,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": true,
				"name": "Guaraná Fantástica"
			},
			{
				"productID": 25,
				"supplierID": 11,
				"categoryID": 3,
				"quantityPerUnit": "20 - 450 g glasses",
				"unitPrice": 14,
				"unitsInStock": 76,
				"unitsOnOrder": 0,
				"reorderLevel": 30,
				"discontinued": false,
				"name": "NuNuCa Nuß-Nougat-Creme"
			},
			{
				"productID": 26,
				"supplierID": 11,
				"categoryID": 3,
				"quantityPerUnit": "100 - 250 g bags",
				"unitPrice": 31.23,
				"unitsInStock": 15,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": false,
				"name": "Gumbär Gummibärchen"
			},
			{
				"productID": 27,
				"supplierID": 11,
				"categoryID": 3,
				"quantityPerUnit": "100 - 100 g pieces",
				"unitPrice": 43.9,
				"unitsInStock": 49,
				"unitsOnOrder": 0,
				"reorderLevel": 30,
				"discontinued": false,
				"name": "Schoggi Schokolade"
			},
			{
				"productID": 28,
				"supplierID": 12,
				"categoryID": 7,
				"quantityPerUnit": "25 - 825 g cans",
				"unitPrice": 45.6,
				"unitsInStock": 26,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": true,
				"name": "Rössle Sauerkraut"
			},
			{
				"productID": 29,
				"supplierID": 12,
				"categoryID": 6,
				"quantityPerUnit": "50 bags x 30 sausgs.",
				"unitPrice": 123.79,
				"unitsInStock": 0,
				"unitsOnOrder": 0,
				"reorderLevel": 0,
				"discontinued": true,
				"name": "Thüringer Rostbratwurst"
			},
			{
				"productID": 30,
				"supplierID": 13,
				"categoryID": 8,
				"quantityPerUnit": "10 - 200 g glasses",
				"unitPrice": 25.89,
				"unitsInStock": 10,
				"unitsOnOrder": 0,
				"reorderLevel": 15,
				"discontinued": false,
				"name": "Nord-Ost Matjeshering"
			},
			{
				"productID": 31,
				"supplierID": 14,
				"categoryID": 4,
				"quantityPerUnit": "12 - 100 g pkgs",
				"unitPrice": 12.5,
				"unitsInStock": 0,
				"unitsOnOrder": 70,
				"reorderLevel": 20,
				"discontinued": false,
				"name": "Gorgonzola Telino"
			},
			{
				"productID": 32,
				"supplierID": 14,
				"categoryID": 4,
				"quantityPerUnit": "24 - 200 g pkgs.",
				"unitPrice": 32,
				"unitsInStock": 9,
				"unitsOnOrder": 40,
				"reorderLevel": 25,
				"discontinued": false,
				"name": "Mascarpone Fabioli"
			},
			{
				"productID": 33,
				"supplierID": 15,
				"categoryID": 4,
				"quantityPerUnit": "500 g",
				"unitPrice": 2.5,
				"unitsInStock": 112,
				"unitsOnOrder": 0,
				"reorderLevel": 20,
				"discontinued": false,
				"name": "Geitost"
			},
			{
				"productID": 34,
				"supplierID": 16,
				"categoryID": 1,
				"quantityPerUnit": "24 - 12 oz bottles",
				"unitPrice": 14,
				"unitsInStock": 111,
				"unitsOnOrder": 0,
				"reorderLevel": 15,
				"discontinued": false,
				"name": "Sasquatch Ale"
			},
			{
				"productID": 22,
				"supplierID": 9,
				"categoryID": 5,
				"quantityPerUnit": "24 - 500 g pkgs.",
				"unitPrice": 21,
				"unitsInStock": 104,
				"unitsOnOrder": 0,
				"reorderLevel": 25,
				"discontinued": false,
				"name": "Gustaf's Knäckebröd"
			},
			{
				"productID": 21,
				"supplierID": 8,
				"categoryID": 3,
				"quantityPerUnit": "24 pkgs. x 4 pieces",
				"unitPrice": 10,
				"unitsInStock": 3,
				"unitsOnOrder": 40,
				"reorderLevel": 5,
				"discontinued": false,
				"name": "Sir Rodney's Scones"
			},
			{
				"productID": 35,
				"supplierID": 16,
				"categoryID": 1,
				"quantityPerUnit": "24 - 12 oz bottles",
				"unitPrice": 18,
				"unitsInStock": 20,
				"unitsOnOrder": 0,
				"reorderLevel": 15,
				"discontinued": false,
				"name": "Steeleye Stout"
			},
			{
				"productID": 23,
				"supplierID": 9,
				"categoryID": 5,
				"quantityPerUnit": "12 - 250 g pkgs.",
				"unitPrice": 9,
				"unitsInStock": 61,
				"unitsOnOrder": 0,
				"reorderLevel": 25,
				"discontinued": false,
				"name": "Tunnbröd"
			}
		];
	}
	getCustomers() {
		return [
			{
				"customerID": "AROUT",
				"companyName": "Around the Horn",
				"contactName": "Thomas Hardy",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "120 Hanover Sq.",
					"city": "London",
					"region": "NULL",
					"postalCode": "WA1 1DP",
					"country": "UK",
					"phone": "(171) 555-7788"
				}
			},
			{
				"customerID": "BERGS",
				"companyName": "Berglunds snabbköp",
				"contactName": "Christina Berglund",
				"contactTitle": "Order Administrator",
				"address": {
					"street": "Berguvsvägen  8",
					"city": "Luleå",
					"region": "NULL",
					"postalCode": "S-958 22",
					"country": "Sweden",
					"phone": "0921-12 34 65"
				}
			},
			{
				"customerID": "BLAUS",
				"companyName": "Blauer See Delikatessen",
				"contactName": "Hanna Moos",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Forsterstr. 57",
					"city": "Mannheim",
					"region": "NULL",
					"postalCode": 68306,
					"country": "Germany",
					"phone": "0621-08460"
				}
			},
			{
				"customerID": "BLONP",
				"companyName": "Blondesddsl père et fils",
				"contactName": "Frédérique Citeaux",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "24 place Kléber",
					"city": "Strasbourg",
					"region": "NULL",
					"postalCode": 67000,
					"country": "France",
					"phone": "88.60.15.31"
				}
			},
			{
				"customerID": "BOLID",
				"companyName": "Bólido Comidas preparadas",
				"contactName": "Martín Sommer",
				"contactTitle": "Owner",
				"address": {
					"street": "67C Araquil",
					"city": "Madrid",
					"region": "NULL",
					"postalCode": 28023,
					"country": "Spain",
					"phone": "(91) 555 22 82"
				}
			},
			{
				"customerID": "BONAP",
				"companyName": "Bon app'",
				"contactName": "Laurence Lebihan",
				"contactTitle": "Owner",
				"address": {
					"street": "12 rue des Bouchers",
					"city": "Marseille",
					"region": "NULL",
					"postalCode": 13008,
					"country": "France",
					"phone": "91.24.45.40"
				}
			},
			{
				"customerID": "ANTON",
				"companyName": "Antonio Moreno Taquería",
				"contactName": "Antonio Moreno",
				"contactTitle": "Owner",
				"address": {
					"street": "Mataderos  2312",
					"city": "México D.F.",
					"region": "NULL",
					"postalCode": 5023,
					"country": "Mexico",
					"phone": "(5) 555-3932"
				}
			},
			{
				"customerID": "ANATR",
				"companyName": "Ana Trujillo Emparedados y helados",
				"contactName": "Ana Trujillo",
				"contactTitle": "Owner",
				"address": {
					"street": "Avda. de la Constitución 2222",
					"city": "México D.F.",
					"region": "NULL",
					"postalCode": 5021,
					"country": "Mexico",
					"phone": "(5) 555-4729"
				}
			},
			{
				"customerID": "CACTU",
				"companyName": "Cactus Comidas para llevar",
				"contactName": "Patricio Simpson",
				"contactTitle": "Sales Agent",
				"address": {
					"street": "Cerrito 333",
					"city": "Buenos Aires",
					"region": "NULL",
					"postalCode": 1010,
					"country": "Argentina",
					"phone": "(1) 135-5555"
				}
			},
			{
				"customerID": "BSBEV",
				"companyName": "B's Beverages",
				"contactName": "Victoria Ashworth",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Fauntleroy Circus",
					"city": "London",
					"region": "NULL",
					"postalCode": "EC2 5NT",
					"country": "UK",
					"phone": "(171) 555-1212"
				}
			},
			{
				"customerID": "CENTC",
				"companyName": "Centro comercial Moctezuma",
				"contactName": "Francisco Chang",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "Sierras de Granada 9993",
					"city": "México D.F.",
					"region": "NULL",
					"postalCode": 5022,
					"country": "Mexico",
					"phone": "(5) 555-3392"
				}
			},
			{
				"customerID": "CHOPS",
				"companyName": "Chop-suey Chinese",
				"contactName": "Yang Wang",
				"contactTitle": "Owner",
				"address": {
					"street": "Hauptstr. 29",
					"city": "Bern",
					"region": "NULL",
					"postalCode": 3012,
					"country": "Switzerland",
					"phone": "0452-076545"
				}
			},
			{
				"customerID": "COMMI",
				"companyName": "Comércio Mineiro",
				"contactName": "Pedro Afonso",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "23 Av. dos Lusíadas",
					"city": "Sao Paulo",
					"region": "SP",
					"postalCode": "05432-043",
					"country": "Brazil",
					"phone": "(11) 555-7647"
				}
			},
			{
				"customerID": "CONSH",
				"companyName": "Consolidated Holdings",
				"contactName": "Elizabeth Brown",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Berkeley Gardens 12  Brewery",
					"city": "London",
					"region": "NULL",
					"postalCode": "WX1 6LT",
					"country": "UK",
					"phone": "(171) 555-2282"
				}
			},
			{
				"customerID": "ALFKI",
				"companyName": "Alfreds Futterkiste",
				"contactName": "Maria Anders",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Obere Str. 57",
					"city": "Berlin",
					"region": "NULL",
					"postalCode": 12209,
					"country": "Germany",
					"phone": "030-0074321"
				}
			},
			{
				"customerID": "BOTTM",
				"companyName": "Bottom-Dollar Markets",
				"contactName": "Elizabeth Lincoln",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "23 Tsawassen Blvd.",
					"city": "Tsawassen",
					"region": "BC",
					"postalCode": "T2F 8M4",
					"country": "Canada",
					"phone": "(604) 555-4729"
				}
			},
			{
				"customerID": "DRACD",
				"companyName": "Drachenblut Delikatessen",
				"contactName": "Sven Ottlieb",
				"contactTitle": "Order Administrator",
				"address": {
					"street": "Walserweg 21",
					"city": "Aachen",
					"region": "NULL",
					"postalCode": 52066,
					"country": "Germany",
					"phone": "0241-039123"
				}
			},
			{
				"customerID": "DUMON",
				"companyName": "Du monde entier",
				"contactName": "Janine Labrune",
				"contactTitle": "Owner",
				"address": {
					"street": "67 rue des Cinquante Otages",
					"city": "Nantes",
					"region": "NULL",
					"postalCode": 44000,
					"country": "France",
					"phone": "40.67.88.88"
				}
			},
			{
				"customerID": "FAMIA",
				"companyName": "Familia Arquibaldo",
				"contactName": "Aria Cruz",
				"contactTitle": "Marketing Assistant",
				"address": {
					"street": "Rua Orós 92",
					"city": "Sao Paulo",
					"region": "SP",
					"postalCode": "05442-030",
					"country": "Brazil",
					"phone": "(11) 555-9857"
				}
			},
			{
				"customerID": "FISSA",
				"companyName": "FISSA Fabrica Inter. Salchichas S.A.",
				"contactName": "Diego Roel",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "C/ Moralzarzal 86",
					"city": "Madrid",
					"region": "NULL",
					"postalCode": 28034,
					"country": "Spain",
					"phone": "(91) 555 94 44"
				}
			},
			{
				"customerID": "FOLIG",
				"companyName": "Folies gourmandes",
				"contactName": "Martine Rancé",
				"contactTitle": "Assistant Sales Agent",
				"address": {
					"street": "184 chaussée de Tournai",
					"city": "Lille",
					"region": "NULL",
					"postalCode": 59000,
					"country": "France",
					"phone": "20.16.10.16"
				}
			},
			{
				"customerID": "FOLKO",
				"companyName": "Folk och fä HB",
				"contactName": "Maria Larsson",
				"contactTitle": "Owner",
				"address": {
					"street": "Åkergatan 24",
					"city": "Bräcke",
					"region": "NULL",
					"postalCode": "S-844 67",
					"country": "Sweden",
					"phone": "0695-34 67 21"
				}
			},
			{
				"customerID": "FRANK",
				"companyName": "Frankenversand",
				"contactName": "Peter Franken",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "Berliner Platz 43",
					"city": "München",
					"region": "NULL",
					"postalCode": 80805,
					"country": "Germany",
					"phone": "089-0877310"
				}
			},
			{
				"customerID": "FRANR",
				"companyName": "France restauration",
				"contactName": "Carine Schmitt",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "54 rue Royale",
					"city": "Nantes",
					"region": "NULL",
					"postalCode": 44000,
					"country": "France",
					"phone": "40.32.21.21"
				}
			},
			{
				"customerID": "EASTC",
				"companyName": "Eastern Connection",
				"contactName": "Ann Devon",
				"contactTitle": "Sales Agent",
				"address": {
					"street": "35 King George",
					"city": "London",
					"region": "NULL",
					"postalCode": "WX3 6FW",
					"country": "UK",
					"phone": "(171) 555-0297"
				}
			},
			{
				"customerID": "ERNSH",
				"companyName": "Ernst Handel",
				"contactName": "Roland Mendel",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "Kirchgasse 6",
					"city": "Graz",
					"region": "NULL",
					"postalCode": 8010,
					"country": "Austria",
					"phone": "7675-3425"
				}
			},
			{
				"customerID": "FRANS",
				"companyName": "Franchi S.p.A.",
				"contactName": "Paolo Accorti",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Via Monte Bianco 34",
					"city": "Torino",
					"region": "NULL",
					"postalCode": 10100,
					"country": "Italy",
					"phone": "011-4988260"
				}
			},
			{
				"customerID": "FURIB",
				"companyName": "Furia Bacalhau e Frutos do Mar",
				"contactName": "Lino Rodriguez",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "Jardim das rosas n. 32",
					"city": "Lisboa",
					"region": "NULL",
					"postalCode": 1675,
					"country": "Portugal",
					"phone": "(1) 354-2534"
				}
			},
			{
				"customerID": "GALED",
				"companyName": "Galería del gastrónomo",
				"contactName": "Eduardo Saavedra",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "Rambla de Cataluña 23",
					"city": "Barcelona",
					"region": "NULL",
					"postalCode": 8022,
					"country": "Spain",
					"phone": "(93) 203 4560"
				}
			},
			{
				"customerID": "GODOS",
				"companyName": "Godos Cocina Típica",
				"contactName": "José Pedro Freyre",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "C/ Romero 33",
					"city": "Sevilla",
					"region": "NULL",
					"postalCode": 41101,
					"country": "Spain",
					"phone": "(95) 555 82 82"
				}
			},
			{
				"customerID": "GOURL",
				"companyName": "Gourmet Lanchonetes",
				"contactName": "André Fonseca",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "Av. Brasil 442",
					"city": "Campinas",
					"region": "SP",
					"postalCode": "04876-786",
					"country": "Brazil",
					"phone": "(11) 555-9482"
				}
			},
			{
				"customerID": "HILAA",
				"companyName": "HILARION-Abastos",
				"contactName": "Carlos Hernández",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Carrera 22 con Ave. Carlos Soublette #8-35",
					"city": "San Cristóbal",
					"region": "Táchira",
					"postalCode": 5022,
					"country": "Venezuela",
					"phone": "(5) 555-1340"
				}
			},
			{
				"customerID": "HUNGC",
				"companyName": "Hungry Coyote Import Store",
				"contactName": "Yoshi Latimer",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "City Center Plaza 516 Main St.",
					"city": "Elgin",
					"region": "OR",
					"postalCode": 97827,
					"country": "USA",
					"phone": "(503) 555-6874"
				}
			},
			{
				"customerID": "HUNGO",
				"companyName": "Hungry Owl All-Night Grocers",
				"contactName": "Patricia McKenna",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "8 Johnstown Road",
					"city": "Cork",
					"region": "Co. Cork",
					"postalCode": "NULL",
					"country": "Ireland",
					"phone": "2967 542"
				}
			},
			{
				"customerID": "ISLAT",
				"companyName": "Island Trading",
				"contactName": "Helen Bennett",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "Garden House Crowther Way",
					"city": "Cowes",
					"region": "Isle of Wight",
					"postalCode": "PO31 7PJ",
					"country": "UK",
					"phone": "(198) 555-8888"
				}
			},
			{
				"customerID": "KOENE",
				"companyName": "Königlich Essen",
				"contactName": "Philip Cramer",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "Maubelstr. 90",
					"city": "Brandenburg",
					"region": "NULL",
					"postalCode": 14776,
					"country": "Germany",
					"phone": "0555-09876"
				}
			},
			{
				"customerID": "LACOR",
				"companyName": "La corne d'abondance",
				"contactName": "Daniel Tonini",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "67 avenue de l'Europe",
					"city": "Versailles",
					"region": "NULL",
					"postalCode": 78000,
					"country": "France",
					"phone": "30.59.84.10"
				}
			},
			{
				"customerID": "GROSR",
				"companyName": "GROSELLA-Restaurante",
				"contactName": "Manuel Pereira",
				"contactTitle": "Owner",
				"address": {
					"street": "5ª Ave. Los Palos Grandes",
					"city": "Caracas",
					"region": "DF",
					"postalCode": 1081,
					"country": "Venezuela",
					"phone": "(2) 283-2951"
				}
			},
			{
				"customerID": "HANAR",
				"companyName": "Hanari Carnes",
				"contactName": "Mario Pontes",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Rua do Paço 67",
					"city": "Rio de Janeiro",
					"region": "RJ",
					"postalCode": "05454-876",
					"country": "Brazil",
					"phone": "(21) 555-0091"
				}
			},
			{
				"customerID": "LAUGB",
				"companyName": "Laughing Bacchus Wine Cellars",
				"contactName": "Yoshi Tannamuri",
				"contactTitle": "Marketing Assistant",
				"address": {
					"street": "1900 Oak St.",
					"city": "Vancouver",
					"region": "BC",
					"postalCode": "V3F 2K1",
					"country": "Canada",
					"phone": "(604) 555-3392"
				}
			},
			{
				"customerID": "LAZYK",
				"companyName": "Lazy K Kountry Store",
				"contactName": "John Steel",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "12 Orchestra Terrace",
					"city": "Walla Walla",
					"region": "WA",
					"postalCode": 99362,
					"country": "USA",
					"phone": "(509) 555-7969"
				}
			},
			{
				"customerID": "LEHMS",
				"companyName": "Lehmanns Marktstand",
				"contactName": "Renate Messner",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Magazinweg 7",
					"city": "Frankfurt a.M.",
					"region": "NULL",
					"postalCode": 60528,
					"country": "Germany",
					"phone": "069-0245984"
				}
			},
			{
				"customerID": "GREAL",
				"companyName": "Great Lakes Food Market",
				"contactName": "Howard Snyder",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "2732 Baker Blvd.",
					"city": "Eugene",
					"region": "OR",
					"postalCode": 97403,
					"country": "USA",
					"phone": "(503) 555-7555"
				}
			},
			{
				"customerID": "LAMAI",
				"companyName": "La maison d'Asie",
				"contactName": "Annette Roulet",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "1 rue Alsace-Lorraine",
					"city": "Toulouse",
					"region": "NULL",
					"postalCode": 31000,
					"country": "France",
					"phone": "61.77.61.10"
				}
			},
			{
				"customerID": "LETSS",
				"companyName": "Let's Stop N Shop",
				"contactName": "Jaime Yorres",
				"contactTitle": "Owner",
				"address": {
					"street": "87 Polk St. Suite 5",
					"city": "San Francisco",
					"region": "CA",
					"postalCode": 94117,
					"country": "USA",
					"phone": "(415) 555-5938"
				}
			},
			{
				"customerID": "MAGAA",
				"companyName": "Magazzini Alimentari Riuniti",
				"contactName": "Giovanni Rovelli",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "Via Ludovico il Moro 22",
					"city": "Bergamo",
					"region": "NULL",
					"postalCode": 24100,
					"country": "Italy",
					"phone": "035-640230"
				}
			},
			{
				"customerID": "MAISD",
				"companyName": "Maison Dewey",
				"contactName": "Catherine Dewey",
				"contactTitle": "Sales Agent",
				"address": {
					"street": "Rue Joseph-Bens 532",
					"city": "Bruxelles",
					"region": "NULL",
					"postalCode": "B-1180",
					"country": "Belgium",
					"phone": "(02) 201 24 67"
				}
			},
			{
				"customerID": "MEREP",
				"companyName": "Mère Paillarde",
				"contactName": "Jean Fresnière",
				"contactTitle": "Marketing Assistant",
				"address": {
					"street": "43 rue St. Laurent",
					"city": "Montréal",
					"region": "Québec",
					"postalCode": "H1J 1C3",
					"country": "Canada",
					"phone": "(514) 555-8054"
				}
			},
			{
				"customerID": "MORGK",
				"companyName": "Morgenstern Gesundkost",
				"contactName": "Alexander Feuer",
				"contactTitle": "Marketing Assistant",
				"address": {
					"street": "Heerstr. 22",
					"city": "Leipzig",
					"region": "NULL",
					"postalCode": 4179,
					"country": "Germany",
					"phone": "0342-023176"
				}
			},
			{
				"customerID": "NORTS",
				"companyName": "North/South",
				"contactName": "Simon Crowther",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "South House 300 Queensbridge",
					"city": "London",
					"region": "NULL",
					"postalCode": "SW7 1RZ",
					"country": "UK",
					"phone": "(171) 555-7733"
				}
			},
			{
				"customerID": "OCEAN",
				"companyName": "Océano Atlántico Ltda.",
				"contactName": "Yvonne Moncada",
				"contactTitle": "Sales Agent",
				"address": {
					"street": "Ing. Gustavo Moncada 8585 Piso 20-A",
					"city": "Buenos Aires",
					"region": "NULL",
					"postalCode": 1010,
					"country": "Argentina",
					"phone": "(1) 135-5333"
				}
			},
			{
				"customerID": "LINOD",
				"companyName": "LINO-Delicateses",
				"contactName": "Felipe Izquierdo",
				"contactTitle": "Owner",
				"address": {
					"street": "Ave. 5 de Mayo Porlamar",
					"city": "I. de Margarita",
					"region": "Nueva Esparta",
					"postalCode": 4980,
					"country": "Venezuela",
					"phone": "(8) 34-56-12"
				}
			},
			{
				"customerID": "LILAS",
				"companyName": "LILA-Supermercado",
				"contactName": "Carlos González",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Carrera 52 con Ave. Bolívar #65-98 Llano Largo",
					"city": "Barquisimeto",
					"region": "Lara",
					"postalCode": 3508,
					"country": "Venezuela",
					"phone": "(9) 331-6954"
				}
			},
			{
				"customerID": "OLDWO",
				"companyName": "Old World Delicatessen",
				"contactName": "Rene Phillips",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "2743 Bering St.",
					"city": "Anchorage",
					"region": "AK",
					"postalCode": 99508,
					"country": "USA",
					"phone": "(907) 555-7584"
				}
			},
			{
				"customerID": "OTTIK",
				"companyName": "Ottilies Käseladen",
				"contactName": "Henriette Pfalzheim",
				"contactTitle": "Owner",
				"address": {
					"street": "Mehrheimerstr. 369",
					"city": "Köln",
					"region": "NULL",
					"postalCode": 50739,
					"country": "Germany",
					"phone": "0221-0644327"
				}
			},
			{
				"customerID": "PICCO",
				"companyName": "Piccolo und mehr",
				"contactName": "Georg Pipps",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "Geislweg 14",
					"city": "Salzburg",
					"region": "NULL",
					"postalCode": 5020,
					"country": "Austria",
					"phone": "6562-9722"
				}
			},
			{
				"customerID": "PARIS",
				"companyName": "Paris spécialités",
				"contactName": "Marie Bertrand",
				"contactTitle": "Owner",
				"address": {
					"street": "265 boulevard Charonne",
					"city": "Paris",
					"region": "NULL",
					"postalCode": 75012,
					"country": "France",
					"phone": "(1) 42.34.22.66"
				}
			},
			{
				"customerID": "PERIC",
				"companyName": "Pericles Comidas clásicas",
				"contactName": "Guillermo Fernández",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Calle Dr. Jorge Cash 321",
					"city": "México D.F.",
					"region": "NULL",
					"postalCode": 5033,
					"country": "Mexico",
					"phone": "(5) 552-3745"
				}
			},
			{
				"customerID": "PRINI",
				"companyName": "Princesa Isabel Vinhos",
				"contactName": "Isabel de Castro",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Estrada da saúde n. 58",
					"city": "Lisboa",
					"region": "NULL",
					"postalCode": 1756,
					"country": "Portugal",
					"phone": "(1) 356-5634"
				}
			},
			{
				"customerID": "LONEP",
				"companyName": "Lonesome Pine Restaurant",
				"contactName": "Fran Wilson",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "89 Chiaroscuro Rd.",
					"city": "Portland",
					"region": "OR",
					"postalCode": 97219,
					"country": "USA",
					"phone": "(503) 555-9573"
				}
			},
			{
				"customerID": "QUEEN",
				"companyName": "Queen Cozinha",
				"contactName": "Lúcia Carvalho",
				"contactTitle": "Marketing Assistant",
				"address": {
					"street": "Alameda dos Canàrios 891",
					"city": "Sao Paulo",
					"region": "SP",
					"postalCode": "05487-020",
					"country": "Brazil",
					"phone": "(11) 555-1189"
				}
			},
			{
				"customerID": "RATTC",
				"companyName": "Rattlesnake Canyon Grocery",
				"contactName": "Paula Wilson",
				"contactTitle": "Assistant Sales Representative",
				"address": {
					"street": "2817 Milton Dr.",
					"city": "Albuquerque",
					"region": "NM",
					"postalCode": 87110,
					"country": "USA",
					"phone": "(505) 555-5939"
				}
			},
			{
				"customerID": "REGGC",
				"companyName": "Reggiani Caseifici",
				"contactName": "Maurizio Moroni",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "Strada Provinciale 124",
					"city": "Reggio Emilia",
					"region": "NULL",
					"postalCode": 42100,
					"country": "Italy",
					"phone": "0522-556721"
				}
			},
			{
				"customerID": "QUEDE",
				"companyName": "Que Delícia",
				"contactName": "Bernardo Batista",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Rua da Panificadora",
					"city": "12Rio de Janeiro",
					"region": "RJ",
					"postalCode": "02389-673",
					"country": "Brazil",
					"phone": "(21) 555-4252"
				}
			},
			{
				"customerID": "RANCH",
				"companyName": "Rancho grande",
				"contactName": "Sergio Gutiérrez",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Av. del Libertador 900",
					"city": "Buenos Aires",
					"region": "NULL",
					"postalCode": 1010,
					"country": "Argentina",
					"phone": "(1) 123-5555"
				}
			},
			{
				"customerID": "ROMEY",
				"companyName": "Romero y tomillo",
				"contactName": "Alejandra Camino",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Gran Vía 1",
					"city": "Madrid",
					"region": "NULL",
					"postalCode": 28001,
					"country": "Spain",
					"phone": "(91) 745 6200"
				}
			},
			{
				"customerID": "QUICK",
				"companyName": "QUICK-Stop",
				"contactName": "Horst Kloss",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Taucherstraße 10",
					"city": "Cunewalde",
					"region": "NULL",
					"postalCode": 1307,
					"country": "Germany",
					"phone": "0372-035188"
				}
			},
			{
				"customerID": "RICAR",
				"companyName": "Ricardo Adocicados",
				"contactName": "Janete Limeira",
				"contactTitle": "Assistant Sales Agent",
				"address": {
					"street": "Av. Copacabana 267",
					"city": "Rio de Janeiro",
					"region": "RJ",
					"postalCode": "02389-890",
					"country": "Brazil",
					"phone": "(21) 555-3412"
				}
			},
			{
				"customerID": "RICSU",
				"companyName": "Richter Supermarkt",
				"contactName": "Michael Holz",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "Grenzacherweg 237",
					"city": "Genève",
					"region": "NULL",
					"postalCode": 1203,
					"country": "Switzerland",
					"phone": "0897-034214"
				}
			},
			{
				"customerID": "SANTG",
				"companyName": "Santé Gourmet",
				"contactName": "Jonas Bergulfsen",
				"contactTitle": "Owner",
				"address": {
					"street": "Erling Skakkes gate 78",
					"city": "Stavern",
					"region": "NULL",
					"postalCode": 4110,
					"country": "Norway",
					"phone": "07-98 92 35"
				}
			},
			{
				"customerID": "SAVEA",
				"companyName": "Save-a-lot Markets",
				"contactName": "Jose Pavarotti",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "187 Suffolk Ln.",
					"city": "Boise",
					"region": "ID",
					"postalCode": 83720,
					"country": "USA",
					"phone": "(208) 555-8097"
				}
			},
			{
				"customerID": "SEVES",
				"companyName": "Seven Seas Imports",
				"contactName": "Hari Kumar",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "90 Wadhurst Rd.",
					"city": "London",
					"region": "NULL",
					"postalCode": "OX15 4NB",
					"country": "UK",
					"phone": "(171) 555-1717"
				}
			},
			{
				"customerID": "SIMOB",
				"companyName": "Simons bistro",
				"contactName": "Jytte Petersen",
				"contactTitle": "Owner",
				"address": {
					"street": "Vinbæltet 34",
					"city": "Kobenhavn",
					"region": "NULL",
					"postalCode": 1734,
					"country": "Denmark",
					"phone": "31 12 34 56"
				}
			},
			{
				"customerID": "SPECD",
				"companyName": "Spécialités du monde",
				"contactName": "Dominique Perrier",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "25 rue Lauriston",
					"city": "Paris",
					"region": "NULL",
					"postalCode": 75016,
					"country": "France",
					"phone": "(1) 47.55.60.10"
				}
			},
			{
				"customerID": "SPLIR",
				"companyName": "Split Rail Beer & Ale",
				"contactName": "Art Braunschweiger",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "P.O. Box 555",
					"city": "Lander",
					"region": "WY",
					"postalCode": 82520,
					"country": "USA",
					"phone": "(307) 555-4680"
				}
			},
			{
				"customerID": "SUPRD",
				"companyName": "Suprêmes délices",
				"contactName": "Pascale Cartrain",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Boulevard Tirou 255",
					"city": "Charleroi",
					"region": "NULL",
					"postalCode": "B-6000",
					"country": "Belgium",
					"phone": "(071) 23 67 22 20"
				}
			},
			{
				"customerID": "THEBI",
				"companyName": "The Big Cheese",
				"contactName": "Liz Nixon",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "89 Jefferson Way Suite 2",
					"city": "Portland",
					"region": "OR",
					"postalCode": 97201,
					"country": "USA",
					"phone": "(503) 555-3612"
				}
			},
			{
				"customerID": "THECR",
				"companyName": "The Cracker Box",
				"contactName": "Liu Wong",
				"contactTitle": "Marketing Assistant",
				"address": {
					"street": "55 Grizzly Peak Rd.",
					"city": "Butte",
					"region": "MT",
					"postalCode": 59801,
					"country": "USA",
					"phone": "(406) 555-5834"
				}
			},
			{
				"customerID": "TOMSP",
				"companyName": "Toms Spezialitäten",
				"contactName": "Karin Josephs",
				"contactTitle": "Marketing Manager",
				"address": {
					"street": "Luisenstr. 48",
					"city": "Münster",
					"region": "NULL",
					"postalCode": 44087,
					"country": "Germany",
					"phone": "0251-031259"
				}
			},
			{
				"customerID": "TORTU",
				"companyName": "Tortuga Restaurante",
				"contactName": "Miguel Angel Paolino",
				"contactTitle": "Owner",
				"address": {
					"street": "Avda. Azteca 123",
					"city": "México D.F.",
					"region": "NULL",
					"postalCode": 5033,
					"country": "Mexico",
					"phone": "(5) 555-2933"
				}
			},
			{
				"customerID": "TRADH",
				"companyName": "Tradição Hipermercados",
				"contactName": "Anabela Domingues",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Av. Inês de Castro 414",
					"city": "Sao Paulo",
					"region": "SP",
					"postalCode": "05634-030",
					"country": "Brazil",
					"phone": "(11) 555-2167"
				}
			},
			{
				"customerID": "TRAIH",
				"companyName": "Trail's Head Gourmet Provisioners",
				"contactName": "Helvetius Nagy",
				"contactTitle": "Sales Associate",
				"address": {
					"street": "722 DaVinci Blvd.",
					"city": "Kirkland",
					"region": "WA",
					"postalCode": 98034,
					"country": "USA",
					"phone": "(206) 555-8257"
				}
			},
			{
				"customerID": "VAFFE",
				"companyName": "Vaffeljernet",
				"contactName": "Palle Ibsen",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "Smagsloget 45",
					"city": "Århus",
					"region": "NULL",
					"postalCode": 8200,
					"country": "Denmark",
					"phone": "86 21 32 43"
				}
			},
			{
				"customerID": "VICTE",
				"companyName": "Victuailles en stock",
				"contactName": "Mary Saveley",
				"contactTitle": "Sales Agent",
				"address": {
					"street": "2 rue du Commerce",
					"city": "Lyon",
					"region": "NULL",
					"postalCode": 69004,
					"country": "France",
					"phone": "78.32.54.86"
				}
			},
			{
				"customerID": "VINET",
				"companyName": "Vins et alcools Chevalier",
				"contactName": "Paul Henriot",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "59 rue de l'Abbaye",
					"city": "Reims",
					"region": "NULL",
					"postalCode": 51100,
					"country": "France",
					"phone": "26.47.15.10"
				}
			},
			{
				"customerID": "WANDK",
				"companyName": "Die Wandernde Kuh",
				"contactName": "Rita Müller",
				"contactTitle": "Sales Representative",
				"address": {
					"street": "Adenauerallee 900",
					"city": "Stuttgart",
					"region": "NULL",
					"postalCode": 70563,
					"country": "Germany",
					"phone": "0711-020361"
				}
			},
			{
				"customerID": "WARTH",
				"companyName": "Wartian Herkku",
				"contactName": "Pirkko Koskitalo",
				"contactTitle": "Accounting Manager",
				"address": {
					"street": "Torikatu 38",
					"city": "Oulu",
					"region": "NULL",
					"postalCode": 90110,
					"country": "Finland",
					"phone": "981-443655"
				}
			},
			{
				"customerID": "WELLI",
				"companyName": "Wellington Importadora",
				"contactName": "Paula Parente",
				"contactTitle": "Sales Manager",
				"address": {
					"street": "Rua do Mercado 12",
					"city": "Resende",
					"region": "SP",
					"postalCode": "08737-363",
					"country": "Brazil",
					"phone": "(14) 555-8122"
				}
			},
			{
				"customerID": "WHITC",
				"companyName": "White Clover Markets",
				"contactName": "Karl Jablonski",
				"contactTitle": "Owner",
				"address": {
					"street": "305 - 14th Ave. S. Suite 3B",
					"city": "Seattle",
					"region": "WA",
					"postalCode": 98128,
					"country": "USA",
					"phone": "(206) 555-4112"
				}
			},
			{
				"customerID": "WILMK",
				"companyName": "Wilman Kala",
				"contactName": "Matti Karttunen",
				"contactTitle": "Owner/Marketing Assistant",
				"address": {
					"street": "Keskuskatu 45",
					"city": "Helsinki",
					"region": "NULL",
					"postalCode": 21240,
					"country": "Finland",
					"phone": "90-224 8858"
				}
			},
			{
				"customerID": "WOLZA",
				"companyName": "Wolski  Zajazd",
				"contactName": "Zbyszek Piestrzeniewicz",
				"contactTitle": "Owner",
				"address": {
					"street": "ul. Filtrowa 68",
					"city": "Warszawa",
					"region": "NULL",
					"postalCode": "01-012",
					"country": "Poland",
					"phone": "(26) 642-7012"
				}
			}
		];
	}

}

module.exports = ControllerShowcaseES6MapFunction