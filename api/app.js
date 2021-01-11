'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Load Routes
var user_routes = require('./routes/user');


//Middlewares = método que se ejecuta antes de llegar a un controlador
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cors

//Routes
app.use('/api', user_routes);

//export
module.exports = app;
