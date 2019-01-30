
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

server.post('/', createCB);

server.put('/:id', editCB);

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

function createCB(req, res) {
    var items = dbHelper.getDataByFieldName(db, 'projects');

    items.push(req.body);

    db.write();

    res.status(200).json(items);
}

function editCB(req, res) {
    var id = req.params.id;
    var item = dbHelper.findById(db, 'projects', id);
    if (item) {
        res.status(200).json(item.assign(req.body).write());
    } else {
        res.status(404).json({error: "item not found"});
    }
}

module.exports = server;