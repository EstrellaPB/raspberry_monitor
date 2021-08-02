'user strict'

var bcrypt = require('bcryptjs');
var Device = require('../models/device');
var jwt = require('../services/jwt');

var moment = require('moment');
const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

function saveDevice(req, res) {
    try {
        validationResult(req).throw();

        var device = new Device();

        var params = req.body;
        device.mac_address = params.mac_address.toLowerCase();
        device.ip = params.ip;

        if (params.password == params.confirmPassword) {
            //encriptar contraseña y guardar datos
            bcrypt.hash(params.password, 10, function(err, hash) {
                device.password = hash;
                if (device.mac_address != null) {
                    //guardar usuario
                    device.save((err, deviceStored) => {
                        if (err) {
                            res.status(500).send({ message: 'Server error. Device not saved.' });
                        } else {
                            if (!deviceStored) {
                                res.status(404).send({ message: 'Could not save device.' });

                            } else {
                                res.status(200).send({ device: deviceStored });
                            }
                        }
                    });
                } else {
                    res.status(200).send({ message: 'Fields missing.' });

                }
            })
        } else {
            res.status(500).send({ message: 'Password required.' });
        }
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

function loginDevice(req, res) {
    try {
        validationResult(req).throw();
        var params = req.body;
        var mac_address = params.mac_address;
        var password = params.password;
        var ip = params.ip;
        console.log('mac_address', mac_address.toLowerCase());
        Device.findOne({ mac_address: mac_address.toLowerCase() }, (err, device) => {
            if (err) {
                res.status(500).send({ message: 'error en la petición' });
            } else {
                if (!device) {
                    res.status(404).send({ message: 'el dispositivo no existe' });
                } else {
                    //comprobar la contraseña
                    bcrypt.compare(password, device.password, function(err, check) {
                        if (check) {
                            //devolver datos del usuario logueado
                            if (params.gethash) {
                                device.ip = ip;
                                device.save();

                                //devolver token de jwt
                                res.status(200).send({
                                    deviceToken: jwt.createDeviceToken(device)
                                });


                            } else {
                                res.status(200).send({ device });
                            }
                        } else {
                            res.status(404).send({ message: 'el dispositivo no ha podido loguearse' });
                        }
                    });
                }
            }
        });
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

function findDeviceById(req, res) {
    var deviceId = req.params.id;
    Device.findById(deviceId)
        .exec()
        .then((deviceFound) => {
            res.status(200).send({ device: deviceFound });
        }).catch(err => {
            res.status(404).send({ message: 'User not found' });
        });
}

function findDevices(req, res) {
    Device.find().exec().then(function(devices) {
        if (!!devices) {
            res.status(200).send({ devices: devices })
        } else {
            res.status(404).send({ message: 'No results' })
        }
    })
    .catch(function(err) {
        res.status(500).send({ message: 'Server error' })
    });
}

function findDevicesPaginated(req, res) {
    if (req.query['page']) {
        var page = req.query['page'];
    } else {
        var page = 1;
    }
    var itemsPerPage = 10;

    Device.find()
        .paginate(page, itemsPerPage, function(err, devices, total) {
            if (err) {
                res.status(500).send({ message: 'Something went wrong' });
            } else {
                if (!devices) {
                    res.status(404).send({ message: 'No results' });
                } else {
                    return res.status(200).send({
                        total: total,
                        perPage: itemsPerPage,
                        devices: devices
                    })
                }
            }
        });
}

// update otro usuario
async function updateDevice(req, res) {
    try {
        validationResult(req).throw();
        var deviceId = req.params.id;
        var update = req.body;
        // if (update.password) {
        //     update.password = await User.hashPassword(update.password);
        // }
        Device.findByIdAndUpdate(deviceId, update, (err, deviceUpdated) => {
            if (err) {
                res.status(500).send({ message: 'Something went wrong' });
            } else {
                if (!deviceUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el dispositivo' });
                } else {
                    res.status(200).send({ device: deviceUpdated });

                    Device.findById(deviceId, (err, device) => {
                        console.log('dispositivo actualizado :' + device);
                    });

                }
            }
        });
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

async function devicePasswordReset(req, res) {
    try {
        validationResult(req).throw();
        var deviceId = req.params.id;
        var update = req.body;
        console.log('passs' + update.password);
        console.log('confirmpasss' + update.confirmPassword);
        if (update.password == update.confirmPassword) {
            update.password = await Device.hashPassword(update.password);

            Device.findByIdAndUpdate(deviceId, update, (err, deviceUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar contraseña' });
                } else {
                    if (!deviceUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar la contraseña' });
                    } else {
                        console.log(deviceUpdated);
                        res.status(200).send({ device: deviceUpdated });

                        Device.findById(deviceId, (err, device) => {
                            console.log('dispoactualizado :' + device);
                        });

                    }
                }
            });
        }
    } catch (err) {
        // console.log(err.mapped());
        res.status(422).send({
            errors: err.mapped() // con llaves
                // errors: err.array() //sin llaves
        });
    }
}

function deleteDevice(req, res) {
    var deviceId = req.params.id;
    Device.deleteOne({ _id: deviceId }, (err) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar al dispositivo' });
        } else {
            res.status(200).send({ message: 'Dispositivo eliminado con exito' });
        }
    });
}

function logout(req, res) {
    res.status(200).send({ message: 'Logged out' });
}

module.exports = {
    saveDevice,
    loginDevice,
    updateDevice,
    devicePasswordReset,
    findDeviceById,
    findDevices,
    findDevicesPaginated,
    deleteDevice,
    logout
}