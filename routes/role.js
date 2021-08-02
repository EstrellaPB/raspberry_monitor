'use strict'

var express = require('express');
var RoleController = require('../controllers/role');

//cargar router de express
var api = express.Router();

// middlewares
const md_auth = require('../middlewares/authenticated');

api.get('/pruebasRole', RoleController.pruebasRole);
api.get('/role', md_auth.ensureAuth, RoleController.findRoles);
api.post('/save-role', RoleController.saveRole);

module.exports = api;