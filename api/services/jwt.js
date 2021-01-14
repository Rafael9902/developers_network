'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_password'

exports.createToken = function(user){
  var payload = {
    sub: user._id,
    name: user.name,
    lastname: user.lastname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };

  //encode data
  return jwt.encode(payload, secret);
};
