'use strict'

var User = require('../models/user');

function home(req, res){
  res.status(200).send({
    message: 'Home'
  });
}

function pruebas(req, res){
  res.status(200).send({
    message: 'Pruebas'
  });
}

module.exports = {
  home,
  pruebas
}
