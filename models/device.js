'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

//objeto de tipo esquema

var DeviceSchema = Schema({
    name: {
        type: String,
        minlength: 4,
        maxlength: 100
    },
    ip: {
        type: String,
        required: true,
        minlength: 11
    },
    mac_address: {
        type: String,
        match: [/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i, 'Please fill a valid mac address'],
        required: true,
        minlength: 17,
        maxlength: 17
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 160
    }
}, { timestamps: true });

DeviceSchema.statics.hashPassword = function(password) {
    return new Promise(resolve => {
        bcrypt.hash(password, 10, function(err, hash) {
            password = hash;
            console.log('passhash: ' + hash);
            // return password;
            resolve(hash);
        });
    });
}
DeviceSchema.statics.macAddressIsUnique = function(macAddress, except) {
    var query = { mac_address: macAddress }
    if (except) {
        query = { mac_address: macAddress, _id: { $nin: [except] } };
    }
    console.log('find mac', query);
    return this.find(query).then(function(macAddresses) {
        if (macAddresses.length > 0) {
            return Promise.reject('The MAC ADRESS is already in use');
        }
    });
}

DeviceSchema.statics.passwordConfirm = function(passwordConfirm, password) {
    if (password !== passwordConfirm) {
        throw new Error('Password confirmation does not match password');
    }
    return true;
}
module.exports = mongoose.model('Device', DeviceSchema);