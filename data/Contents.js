const mongoose = require('mongoose');
//var Profile = require('../data/Profile.js');
var Comment = require('../data/Comment.js');
var User = require('../data/user.js');
const schmea = mongoose.Schema;

var contentSchema = new schmea({
      content:String,
      tag:String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comments:[{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
      likes:[{liker:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},time:{type:Date,default:Date.now()}}],
      shares:[{sharedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},time:{type:Date,default:Date.now()}}]
       
        //ref array for likes
       //ref array for shares..
 },{ timestamps: { createdAt: 'created_at',updatedAt:'updated_at' } });