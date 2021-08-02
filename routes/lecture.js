'use strict'

var express = require('express');
var LectureController = require('../controllers/lecture');

//cargar router de express
var api = express.Router();

// middlewares
const md_auth = require('../middlewares/authenticated');

// api.get('/probando-controlador', LectureController.pruebas);
api.get('/lecture', md_auth.ensureAuth, LectureController.findLectures);
api.get('/lecture-data', md_auth.ensureAuth, LectureController.findLecturesGraph);
api.post('/save-lecture', md_auth.ensureAuth, LectureController.saveLecture);
api.get('/find-lectures', md_auth.ensureAuth, LectureController.findLectures);
api.get('/find-lecture/:id', md_auth.ensureAuth, LectureController.findLectureById);
api.get('/delete-lecture/:id', md_auth.ensureAuth, LectureController.deleteLecture);

module.exports = api;