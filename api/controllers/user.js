'use strict'

var bcrypt = require('bcrypt-nodejs');
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

function saveUser(req, res){
  var user = new User();
  var params = req.body;

  if(params.name && params.lastname && params.nick && params.email && params.password){
    user.name = params.name;
    user.lastname = params.lastname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    //Find duplicate email
    User.find({ $or:[{email: user.email.toLowerCase()}, {nick: user.nick.toLowerCase()}]}).exec((err, users) => {
      if(err) return res.status(500).send({ message: 'Error at save user'});
      if(users && users.length >= 1){
        return res.status(200).send({message: 'User already exists'});
      }
      else{
        bcrypt.hash(params.password, null, null, (err, hash) =>{
            user.password = hash;
            user.save((err, userStore) => {
              if(err) return res.status(500).send({message: 'Error at save user'});
              userStore ? res.status(200).send({user: userStore}) : res.status(404).send({message: 'Error at register'});
            });
        });  
      }
    });
  }
  else{
    res.status(500).send({
      message: 'Incomplete Data'
    });
  }

}

module.exports = {
  home,
  pruebas,
  saveUser
}
