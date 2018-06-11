const mongoose = require('mongoose');
var Profile = require('../data/Profile.js');
var Comment = require('../data/Comment.js');
const schmea = mongoose.Schema;

var contentSchema = new schema({

      profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
      content:String,

     




},{ timestamps: { createdAt: 'created_at',updatedAt:'updated_at' } });