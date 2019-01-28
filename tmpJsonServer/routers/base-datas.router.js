
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

/* Project */

server.get('/', getAllCB);

server.post('/', saveCB);

// server.get('/byId/:id', getProjectByIdCB);

// server.get('/byPn/:pn', getProjectByProjectNumberCB);

// server.get('/documents', getProjectDocumentsCB);

function getAllCB(req, res) {
    res.status(200).json(dbHelper.getDataByFieldName(db, 'baseDatas'));
}

function saveCB(req, res) {

}

module.exports = server;