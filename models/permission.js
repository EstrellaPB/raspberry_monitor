'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//objeto de tipo esquema

var PermissionSchema = Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('Permission', PermissionSchema);


// {
//     "permission": {
//         "_id": "5d367c5872ee290f94b36ed7",
//         "name": "edit.user",
//         "__v": 0
//     }
// }