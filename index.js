'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//hacer conexion

mongoose.connect('mongodb://localhost:27017/raspberry_monitor', { useNewUrlParser: true, useFindAndModify: false }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("la conexión a la base de datos está funcionando correctamente... raspberry_monitor");
        app.listen(port, function() {
            console.log("servidor del api rest de musica escuchando en http://localhost:" + port);
        })
    }
});



//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db"
//"C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"