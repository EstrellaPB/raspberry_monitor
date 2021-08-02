'user strict'

var express = require('express');
var DeviceController = require('../controllers/device');

var api = express.Router();
const multipart = require('connect-multiparty');

// middlewares
const md_auth = require('../middlewares/authenticated');
const md_user = require('../middlewares/userValidated');
const md_permit = require('../middlewares/permitted');
const md_upload = multipart({ uploadDir: './uploads/users' });
const md_device = require('../middlewares/deviceValidated');

//creando ruta

api.post('/login-device', md_device.validate('loginDevice'), DeviceController.loginDevice);
api.post('/register-device', md_auth.ensureAuth, md_permit.permit('create.user'), md_device.validate('saveDevice'), DeviceController.saveDevice);
api.post('/logout', md_auth.ensureAuth, DeviceController.logout);

api.get('/device', md_auth.ensureAuth, md_permit.permit('view.user'), DeviceController.findDevices);
api.get('/device/paginated', md_auth.ensureAuth, md_permit.permit('view.user'), DeviceController.findDevicesPaginated);
api.get('/device/:id', md_auth.ensureAuth, md_permit.permit('view.user'), DeviceController.findDeviceById);
api.post('/device/:id/update', md_auth.ensureAuth, md_permit.permit('edit.user'), md_device.validate('updateDevice'), DeviceController.updateDevice);
api.get('/device/:id/delete', md_auth.ensureAuth, md_permit.permit('delete.user'), DeviceController.deleteDevice);
api.post('/device/password-reset/:id', md_auth.ensureAuth, md_permit.permit('edit.user'), md_device.validate('devicePasswordReset'), DeviceController.devicePasswordReset);



module.exports = api;