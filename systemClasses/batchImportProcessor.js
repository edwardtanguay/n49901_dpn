"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const TextChunkDocument = require('../systemTextParsers/textChunkDocument');
const BatchImportBlock = require('../systemClasses/batchImportBlock');
const System = require('../system/system');
const dpod = require('../system/dpod');

class BatchImportProcessor {

	constructor(batchImportTextStringOrObject) {

		this.regeneratedBatchImportBlockObjectRecords = [];
		this.regeneratedOriginText = '';
		//this.validMarkers = ['!!', '**', '==', ';;', 'pp', 'ff'];
		this.validMarkers = ['==', ';;'];

		this.numberOfItemsSaved = 0;
		this.numberOfItemsImported = 0;
		this.numberOfItemsUpdated = 0;

		let batchImportText = '';
		if (typeof batchImportTextStringOrObject == 'object') {
			// assume object: batchImportBlockObjectRecords
			this.batchImportBlockObjectRecords = batchImportTextStringOrObject;
			//batchImportText = this.createBatchImportTextFromBatchImportTextObject(batchImportBlockObjectRecords);
		} else {
			// assume string: batch import text 

			batchImportText = batchImportTextStringOrObject;
			this.batchImportText = batchImportText;
			this.preparsedBatchImportText = '';

			this.preparsedBatchImportText = batchImportText;
			this.preparse_separateDoubles(); // figure out why this was included
			this.preparse_expandLists();

			this.convertSpacesToTabs();

			this.textChunkDocument = new TextChunkDocument(this.preparsedBatchImportText);
			// at this point, we simply have a collection of TextChunks, i.e. objects each with a collection of lines, but paragraph lines have already been processed
			this.batchImportBlocks = [];
			this.parse();


		}


	}

	isValidMarker(marker) {
		return this.validMarkers.includes(marker);
	}

	/*
	separates:
	==testServer
	==testServer

	as two
	*/
	preparse_separateDoubles() {
		const oldLines = qstr.convertStringBlockToLines(this.preparsedBatchImportText, false);
		const lines = [];
		let lastMarkerWasValid = false;
		for (const oldLine of oldLines) {
			const line = oldLine;
			const marker = qstr.getBatchImportBlockMarker(line);
			const markerIsValid = this.isValidMarker(marker);
			if (markerIsValid && lastMarkerWasValid) {
				lines.push('');
			}
			lines.push(line);
			lastMarkerWasValid = markerIsValid;
		}
		const batchImportText = qstr.convertLinesToStringBlock(lines);
		this.preparsedBatchImportText = batchImportText;
	}


	convertSpacesToTabs() {
		const oldLines = qstr.convertStringBlockToLines(this.preparsedBatchImportText, false);
		const lines = [];
		for (const oldLine of oldLines) {
			const line = qstr.convertBeginningSpacesToTabs(oldLine);
			lines.push(line);
		}
		this.preparsedBatchImportText = qstr.convertLinesToStringBlock(lines);
	}

	/*
	CONVERTS:
	;;testServers
	server4;Server 4;This is server 4.;4
	server5;Server 5;This is server 5.;5

	TO:
	==testServer
	server4
	Server 4
	...
	*/
	preparse_expandLists() {
		const oldLines = qstr.convertStringBlockToLines(this.preparsedBatchImportText, false);
		const lines = [];
		let processingList = false;
		let processingItemTypeIdCodeSingular = '';
		for (const oldLine of oldLines) {
			if (processingList) {
				if (qstr.isEmpty(oldLine)) {
					processingList = false;
					continue;
				}
				// e.g. "00070; What does the folder `qtools` stand for?; It stands for Quick Tools and is functions), **qfil** (file functions), **qdat** (date functions), etc."
				const parts = qstr.breakIntoParts(oldLine, ';');
				lines.push('==' + processingItemTypeIdCodeSingular);
				for (const part of parts) {
					lines.push(part);
				}
				lines.push('');
				continue;
			}

			const marker = qstr.getBatchImportBlockMarker(oldLine);

			if (marker == ';;') {
				const itemTypeIdCode = qstr.chopLeft(oldLine, marker);
				processingItemTypeIdCodeSingular = qstr.forceSingular(itemTypeIdCode);
				processingList = true;
				continue;
			}

			const line = oldLine;
			lines.push(line);
		}
		const batchImportText = qstr.convertLinesToStringBlock(lines);
		this.preparsedBatchImportText = batchImportText;
	}

	parse() {
		for (const textChunk of this.textChunkDocument.textChunks) {
			const batchImportBlock = new BatchImportBlock(textChunk);
			this.batchImportBlocks.push(batchImportBlock);
		}
	}

	renderAsHtml() {
		let html = ``;
		for (const batchImportBlock of this.batchImportBlocks) {
			html += batchImportBlock.renderAsHtml();
		}
		html += `<div class="clear"></div>`;
		return html;
	}

	saveAndRegenerate() {
		let r = '';
		for (const batchImportBlockObjectRecord of this.batchImportBlockObjectRecords) {
			if (batchImportBlockObjectRecord.todo == 'save') {
				if (batchImportBlockObjectRecord.action == 'import') {
					const item = System.instantiateItem(batchImportBlockObjectRecord.itemTypeIdCode);
					item.fillWithLines(batchImportBlockObjectRecord.lines);
					item.save();
					this.numberOfItemsSaved++;
					this.numberOfItemsImported++;
				} else if (batchImportBlockObjectRecord.action == 'update') {
					const item = System.instantiateItem(batchImportBlockObjectRecord.itemTypeIdCode);
					item.fillWithLines(batchImportBlockObjectRecord.lines);
					//also add system fields
					item.id = batchImportBlockObjectRecord.baseItem.id;
					// item.systemWhenCreated = batchImportBlockObjectRecord.baseItem.systemWhenCreated;
					// item.systemWhoCreated = batchImportBlockObjectRecord.baseItem.systemWhoCreated;
					item.save();
					this.numberOfItemsSaved++;
					this.numberOfItemsUpdated++;
				}
			} else {
				this.regeneratedBatchImportBlockObjectRecords.push(batchImportBlockObjectRecord);
				this.regeneratedOriginText += batchImportBlockObjectRecord.originalBatchText + qstr.NEW_LINE(2);
			}
		}
		this.regeneratedOriginText.trim();
		return r;
	}

	getBatchImportBlockObjectRecords() {
		const objectRecords = [];
		for (const batchImportBlock of this.batchImportBlocks) {
			const object = batchImportBlock.getBatchImportBlockObject();
			objectRecords.push(object);
		}
		return objectRecords;
	}

	static getBatchImportItemTypeRecords(callback) {
		const ra = [];
		dpod.fetchItems('itemTypes', function (itemTypes) {
			callback(itemTypes.getBatchImportItemTypeRecords());
		});
	}


}

module.exports = BatchImportProcessor