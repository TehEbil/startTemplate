
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

server.get('/:name', getByNameCB);

server.put('/:type', compareDataCB, saveCB);

// server.get('/byId/:id', getProjectByIdCB);

// server.get('/byPn/:pn', getProjectByProjectNumberCB);

// server.get('/documents', getProjectDocumentsCB);

function getAllCB(req, res) {
    res.status(200).json(dbHelper.getDataByFieldName(db, 'baseDatas'));
}

function getByNameCB(req, res) {
    res.baseData = req.params.name;
    res.status(200).json(dbHelper.getDataByFieldName(db, `baseDatas.${req.params.name}`));
}

function compareDataCB(req, res, next) {

    var type = req.params.type;
    var data = dbHelper.getDataByFieldName(db, `baseDatas.${type}`);

    if((typeof data.changedCounter) !== 'undefined' && (data.changedCounter === req.body.changedCounter)) {
        next();
    } else {
        res.status(409).json(req.data);
    } 
}

function saveCB(req, res) {
    var type = req.params.type;
    var items  = dbHelper.getDataByFieldName(db, `baseDatas.${type}`);
    var changedCounter = req.body.changedCounter + 1;

    items.data = req.body.data;
    items.changedCounter = changedCounter;

    db.write();

    res.status(200).json(items);


}



module.exports = server;