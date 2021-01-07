'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Load Routes


//Middlewares = método que se ejecuta antes de llegar a un controlador
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cors

//Routes
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Pruebas en el servidor de nodejs'
  });
});

//export
module.exports = app;
