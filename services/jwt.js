'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    return jwt.encode(payload, secret);
};

exports.createDeviceToken = function(device) {
    var payload = {
        sub: device._id,
        mac_address: device.mac_address,
        iat: moment().unix(),
        exp: moment().add(4, 'minutes').unix()
    };
    return jwt.encode(payload, secret);
};