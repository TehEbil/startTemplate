
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

server.get('/', getProjectCB);

server.post('/', saveCB);

server.get('/documents', getProjectDocumentsCB);

function getProjectDocumentsCB(req, res) {
    res.status(200).json(dbHelper.getDataByFieldName(db, 'project.documents'));
}

function getProjectCB(req, res) {
    // console.log('====================================');
    // console.log(req.params.id);
    // console.log('====================================');
    res.status(200).json(dbHelper.getDataByFieldName(db, 'project'));
}

function saveCB(req, res) {

    var items = dbHelper.getDataByFieldName(db, 'project');

    items.orderDatas = req.body.orderDatas;
    items.detectionDatas = req.body.detectionDatas;
    items.protocolDatas = req.body.protocolDatas;

    db.write();

    res.status(200).json(items);
}

module.exports = server;