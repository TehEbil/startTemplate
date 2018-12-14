
const express = require('express');
const jsonServer = require('json-server');
const lodashId = require('lodash-id');
const mixins = require('../mixins');

const dbHelper = require('../helpers/db.helper');

const server = jsonServer.create();
const routerx = jsonServer.router('db.json');

const db = routerx.db;
db._.mixin(lodashId);
db._.mixin(mixins);

server.get('/', getAllPartnerFormsCB);
server.post('/', postPartnerDataCB);

function getAllPartnerFormsCB(req, res, nex) {
	res.status(200).json(dbHelper.getDataByFieldName('partners'));
}

function postPartnerDataCB(req, res, next) {

	var items = dbHelper.getDataByFieldName('partners');

	items.push(req.body);

	db.write();

	res.status(200).json('ok');
}

module.exports = server;