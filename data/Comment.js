const mongoose = require('mongoose');
var User = require('../data/user.js');
var Content = require('../data/Contents.js');
const Schema = mongoose.Schema;

var comment = new Schema({

comment:String
//ref array for likes.

},

{ timestamps: { createdAt: 'created_at', updatedAt:'updated_at' } }
);

