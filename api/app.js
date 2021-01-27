var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Load Routes
var user_routes = require('./routes/userRoutes');
var follow_routes = require('./routes/followRoutes');


//Middlewares = método que se ejecuta antes de llegar a un controlador
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cors

//Routes
app.use('/api', user_routes);
app.use('/api', follow_routes);

//export
module.exports = app;