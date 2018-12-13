
const express = require('express');
const jsonServer = require('json-server');
const lodashId = require('lodash-id');
const mixins = require('../mixins');

const server = jsonServer.create();
const routerx = jsonServer.router('db.json');

const dbHelper = require('../helpers/db.helper');

const db = routerx.db;
db._.mixin(lodashId);
db._.mixin(mixins);

/** STAMMDATEN */
server.post('/', getAllCB, compareDataCB, editStammdataCB);

server.get('/', (req, res) => {
	res.status(200).json(dbHelper.getDataByFieldName(db, 'stammDaten'));
});

function getAllCB(req, res, next) {
	req.data = dbHelper.getDataByFieldName(db, 'stammDaten');
	
	next();
}

function compareDataCB(req, res, next) {
	if ((typeof req.data.customers.sources.changedCounter !== 'undefined') && 
		(req.data.customers.sources.changedCounter === req.body.changedCounter)
	) {
		next();
	}
	else {
		req.data = dbHelper.getDataByFieldName(db, 'stammDaten');
		res.status(409).json(req.data);
	 }
}

function editStammdataCB(req, res) {
	req.body.changedCounter++;
	var items = db.get('stammDaten.customers.sources').value();
  
	items.data = req.body.data;
	items.changedCounter = req.body.changedCounter;

	db.write();

	res.status(200).json(items);
}

module.exports = server;