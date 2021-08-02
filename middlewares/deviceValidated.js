'use strict'
const { check, body } = require('express-validator');

var Device = require('../models/device');

exports.validate = (method) => {
    switch (method) {
        case 'saveDevice':
            {
                return [
                    body('name', "Valid name is required").exists().isLength({ min: 4, max: 100 }),
                    body('ip', "Valid IP address required").exists().isLength({ min: 11 }),
                    body('mac_address', "Valid MAC address required").exists().isLength({ min: 17, max: 17 }).custom(value => {
                        return Device.macAddressIsUnique(value.toLowerCase());
                    }),
                    body('password', 'Valid password required').exists().isLength({ min: 4, max: 160 }),
                    body('confirmPassword', 'Valid password required').exists().isLength({ min: 4, max: 160 }).custom((value, { req }) => {
                        return Device.passwordConfirm(value, req.body.password);
                    })
                ]
            }
            break;
        case 'loginDevice':
            {

                return [
                    body('mac_address', "Valid MAC address required").exists().isLength({ min: 4, max: 100 }),
                    body('password', 'Valid password required').exists().isLength({ min: 4, max: 160 })
                ]
            }
            break;
        case 'updateDevice':
            {
                return [
                    body('name', "Valid name is required").exists().isLength({ min: 4, max: 100 }),
                    body('ip', "Valid IP address required").exists().isLength({ min: 11 }),
                    body('mac_address', "Valid MAC address required").exists().isLength({ min: 17, max: 17 }).custom((value, { req }) => {
                        return Device.macAddressIsUnique(value, req.params.id);
                    }),
                ]
            }
            break;
        case 'devicePasswordReset':
            {
                return [
                    body('password', 'Valid password required').exists().isLength({ min: 4, max: 160 }),
                    body('confirmPassword', 'Valid password required').exists().isLength({ min: 4, max: 160 }).custom((value, { req }) => {
                        return Device.passwordConfirm(value, req.body.password);
                    })
                ]
            }
            break;

    }

}