'use strict'

//Database connect
const mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// colocamos la url de conexión local y el nombre de la base de datos
mongoose.connect('mongodb://localhost:27017/developers_network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); // enlaza el track de error a la consola (proceso actual)
db.once('open', () => {
  console.log('connected'); // si esta todo ok, imprime esto

  app.listen(port, () =>{
      console.log("Server running");
  })

});
