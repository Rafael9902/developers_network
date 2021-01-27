//Database connect
const mongoose = require('mongoose');
var port = 3800;
var app = require('./app');

//MongoDB Connection
mongoose.connect('mongodb://localhost:27017/developers_network', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {

    if (err) {
        console.log('Connection Error', message);
    } else {
        console.log('Connection Stablished');

        app.listen(port, () => {
            console.log('Listening on port ', 3000);
        });
    }
});