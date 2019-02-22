
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

// Tempreture variable 
const uId = "136";
const adminId = "1";

/* Project */


// server.get('/test', doIt);

server.get('/:name', getByNameCB);

server.put('/:type', compareDataCB, saveCB);

server.post('/:type', compareDataCB, saveCB);

server.get('/', getAllCB);

// server.get('/byId/:id', getProjectByIdCB);

// server.get('/byPn/:pn', getProjectByProjectNumberCB);

// server.get('/documents', getProjectDocumentsCB);

// function doIt(req, res) {

//     console.log('====================================');
//     console.log('testt');
//     console.log('====================================');

//     let items = dbHelper.getDataByFieldName(db, 'baseDatas.1');

//     for (const key in items) {
//         if (items.hasOwnProperty(key)) {
//             const element = items[key];
            
//             for (const el of element.data) {
//                 el["flag"] = 'SYS';
//             }
//         }
//     }

//     db.write();
//     res.status(200).json(items);
// }

function getAllCB(req, res) {
    // res.status(200).json(dbHelper.getDataByFieldName(db, 'baseDatas'));
    let systemDatas = dbHelper.getDataByFieldName(db, 'baseDatas.1');
    
    if (dbHelper.isHaveField(db, 'baseDatas', uId)) {
        // TODO: merge system datas with expert datas 
        let userDatas = dbHelper.getDataByFieldName(db, `baseDatas.${uId}`);

        let keys = Object.keys(systemDatas);
        let response = {};

        for (const key of keys) {
            response[key] = {};
            response[key].data = [...systemDatas[key].data, ...userDatas[key].data];
            response[key].changedCounter = userDatas[key].changedCounter;
        }

        res.status(200).json(response);
    } else { 
        // TODO: just return system values 
        res.status(200).json(systemDatas);
    }
}

function getByNameCB(req, res) {
    res.baseData = req.params.name;

    let items = dbHelper.getDataByFieldName(db, `baseDatas.${req.params.name}`);

    if (items) {
        res.status(200).json(items);    
    } else {
        res.status(400).json({error: "not found `${req.params.name}` values"});
    }

    
}

function compareDataCB(req, res, next) {

    var type = req.params.type;
    var data = dbHelper.getDataByFieldName(db, `baseDatas.${uId}.${type}`);

    if((typeof data.changedCounter) !== 'undefined' && (data.changedCounter === req.body.changedCounter)) {
        next();
    } else {
        res.status(409).json(req.data);
    } 
    // next();
}
        
function saveCB(req, res) {
    let type = req.params.type;
    let items = [];
    if (dbHelper.isHaveField(db, 'baseDatas', uId)) {
        // TODO: update to baseDatas.136 point
        items  = dbHelper.getDataByFieldName(db, `baseDatas.${uId}.${type}`);
        let changedCounter = req.body.changedCounter + 1;

        console.log('====================================');
        console.log(items);
        console.log('====================================');

        let cstDatas = req.body.data.filter(f => f.flag !== 'SYS');
        if (items.length !== csDatas.length) {
            dbHelper.setNextId(db, `baseDatas.${uId}.${type}`, items.length < cstDatas.length ? cstDatas : items);
        }
        items.data = cstDatas;
        items.changedCounter = changedCounter;   
        console.log('====================================');
        console.log(items);
        console.log('====================================');
        // remember add flag

    } else {
        // TODO: Create baseDatas.136 point 
        items  = dbHelper.getDataByFieldName(db, 'baseDatas');

        items[type].data = req.body.data;
        items[type].changedCounter = 0;

        // remember add flag

    }

    db.write();

    res.status(200).json(items);


}



module.exports = server;