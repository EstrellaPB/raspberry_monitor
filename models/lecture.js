'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LectureSchema = Schema({
    mac_address: {
        type: String,
        match: [/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i, 'Please fill a valid mac address']
    },
    vib_sensor_data: {
        type: Boolean,

    },
    voltage_data: mongoose.Types.Decimal128,
    pow_sensor_data: mongoose.Types.Decimal128,
    pow_sensor_data_01: mongoose.Types.Decimal128,
    pow_sensor_data_02: mongoose.Types.Decimal128
}, { timestamps: true });

module.exports = mongoose.model('Lecture', LectureSchema);