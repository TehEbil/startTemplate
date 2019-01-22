
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

server.get('/byId/:id', getProjectByIdCB);

server.get('/byPn/:pn', getProjectByProjectNumberCB);

server.get('/documents', getProjectDocumentsCB);

function getAllCB(req, res) {
    res.status(200).json(dbHelper.getDataByFieldName(db, 'projects'));
}

function getProjectDocumentsCB(req, res) {
    res.status(200).json(dbHelper.getDataByFieldName(db, 'project.documents'));
}

function getProjectByIdCB(req, res) {
    
    var id = req.params.id;
    console.log('====================================');
    console.log(id);
    console.log('====================================');
    res.status(200).json(dbHelper.findById(db, 'projects', id));
}

function getProjectByProjectNumberCB(req, res) {
    var projectNumber = req.params.pn;
    if (typeof projectNumber === 'string') {
        res.status(200).json(dbHelper.findByPn(db, 'projects', projectNumber));    
    } else {
        res.status(404);
    }
    
}

function saveCB(req, res) {

    var items = dbHelper.getDataByFieldName(db, 'project');

    items.projectNumber = req.body.projectNumber;
    items.projectName = req.body.projectName;
    items.ownPerformanceBuilder = req.body.ownPerformanceBuilder;  
    items.intenalNotes = req.body.intenalNotes;
    items.documents = req.body.documents;
    items.orderDatas = req.body.orderDatas;
    items.detectionDatas = req.body.detectionDatas;
    items.protocolDatas = req.body.protocolDatas;

    db.write();

    res.status(200).json(items);
}

module.exports = server;