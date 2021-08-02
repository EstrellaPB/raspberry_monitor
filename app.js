'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//1. cargar rutas -ficheros
var lecture_routes = require('./routes/lecture');
var user_routes = require('./routes/user');
var permission_routes = require('./routes/permission');
var role_routes = require('./routes/role');
var device_routes = require('./routes/device');



//2. configurar bodyParser- convertir a objetos json los datos que nos llegan por las peticiones http
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//3. configurar cabeceras http
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

//4. carga de rutas base
app.use('/api', user_routes);
app.use('/api', lecture_routes);
app.use('/api', permission_routes);
app.use('/api', role_routes);
app.use('/api', device_routes);


//5. exportar modulo -ya podemos usar express dentro de otros ficheros que incluyan app
module.exports = app;