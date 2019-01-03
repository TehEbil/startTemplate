/*jshint esversion: 6*/
/*jshint loopfunc:true*/
/*jshint sub:true*/
/*jshint asi:true*/
/*jshint forin:false*/
/*jshint shadow:true*/
console.time("Time to boot")

/* server */
const express = require('express');
const compression = require('compression');
const clientServer_app = express();
const clientServer = require('http').createServer(clientServer_app);
const https = require("https");
const helmet = require("helmet");
const bodyParser  = require('body-parser');
const fs = require('fs');
const path = require('path');
const clone = require('clone');

/* db */
const jsonServer = require('json-server');
const lodashId = require('lodash-id');
const mixins = require('./mixins');

const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();

/* loggers */
var { createLogger, format, transports } = require('winston');
var { combine, timestamp, label, prettyPrint, colorize, json } = format;
const browser = require('browser-detect');
const morgan = require('morgan');
const logger = createLogger({
	// level: 'info',
	format: combine(
		timestamp({
		    format: 'YYYY-MM-DD HH:mm:ss'
		}),
		prettyPrint(),
		json()
	),
	transports: [
		new transports.File({ filename: 'error.log', level: 'error' }),
		new transports.File({ filename: 'combined.log'})
	]
});

/* etc */
const FileUploadController = require('./controllers/FileUploadController');

/* init settings */
var clientPort, serverPort, serverip, clientip, serveripwoport;

clientPort = 443;
serverPort = 3006;

serverip = "https://127.0.0.1:" + serverPort + "/";
clientip = "https://127.0.0.1:" + clientPort + "/";

serveripwoport = "https://127.0.0.1";

const server = jsonServer.create();
const routerx = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({logger: false});

clientServer_app.use(compression());
server.use(compression());

clientServer_app.use(helmet());
server.use(helmet());

server.set('superSecret', "abcdef"); // secret variable
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(middlewares);  		// ALLOW CORS!!


const db = routerx.db;
db._.mixin(lodashId);
db._.mixin(mixins);

console.log("hi");

clientServer_app.use('/', express.static(__dirname + '/../theme/admin_1_angularjs/'));
clientServer_app.use('/', express.static(__dirname + '/../theme/'));

clientServer_app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

clientServer.listen(80, () => {
	console.log('Client-Server is running');
})

/** Router Configurations */
const partnerForm = require('./routers/partner-form.router');
const stammDaten = require('./routers/stamm-daten.router');
const project = require('./routers/project.router');

server.listen(serverPort, () => {
  console.log('JSON Server is running');

  server.use('/project', project);
  server.use('/partnerForm', partnerForm);
  server.use('/stammDaten', stammDaten);
})

console.timeEnd("Time to boot")

/* helper functions */

const dbHelper = require('./helpers/db.helper');

function loggerLog(req, type, text, obj = undefined) {
	if(type !== "error")
		type = "info";

	if(req)
		logger.log(type, {
			browser: browser(req.headers['user-agent']), 
			url: req.url, 
			body: req.body,
			message: text,
			obj
		});
	else
		logger.log(type, {
			info: "No req available!",
			message: text,
			obj
		});
}

server.use(morgan((tokens, req, res) => {
	  var tok = [
	  	new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
	    tokens.method(req, res),
	    tokens.url(req, res),
	    tokens.status(req, res),
	    tokens['response-time'](req, res), 'ms'
	  ];

	  return tok.join(' ');
	},
	{
	  skip: (req, res) => {
	  	return req.method == "OPTIONS";
  	}
}));

exports.writeToDB = function(x) {
  db.get('project.documents').insert(x).write();
  /* until mongodb */
  return dbHelper.getMaxId(db, 'project.documents') - 1;
}

/* routing */

server.post('/uploadDoc', multipartyMiddleware, FileUploadController.uploadFile);

server.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + 3006 + '/api');
});

server.get('/testUploads', (req, res, next) => {
	var user = db.get('testUsers').find(o => o.id === 1).value();
	return res.json(user.uploads);
});

server.get('/dashboard', (req, res, next) => {
    var data = {
        todayAuftraege: 5,
        todayAuftraegeMonth: 500
    };
    res.json(data);
});