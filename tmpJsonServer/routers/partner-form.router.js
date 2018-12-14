
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

server.get('/', getAllDatas, getAllPartnerFormsCB);
server.post('/', getAllDatas, postPartnerDataCB);

function getAllDatas(req, res, next) {
	res.data = dbHelper.getDataByFieldName('partners');
	next();
}

function getAllPartnerFormsCB(req, res, next) {
	res.status(200).json(res.data);
}

function postPartnerDataCB(req, res, next) {

	var items = res.data;

	items.push(req.body);

	db.write();

	res.status(200).json('ok');
}

module.exports = server;