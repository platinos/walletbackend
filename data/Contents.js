const mongoose = require('mongoose');
//var Profile = require('../data/Profile.js');
var Comment = require('../data/Comment.js');
var User = require('../data/user.js');
const schema = mongoose.Schema;
delete mongoose.connection.models['Content'];
var contentSchema = new schema({
      image:String,
      content:String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comments:[{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
      likes:[{liker:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
      shares:[{sharedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
      isShared:{type:schema.Types.Boolean,default:false},
      parent:{type: mongoose.Schema.Types.ObjectId, ref:'Content',autopopulate: true}
       
        //ref array for likes
       //ref array for shares..
      },{ timestamps: { createdAt: 'created_at',updatedAt:'updated_at' } });


  var Content = mongoose.model("Content",contentSchema);
  module.exports=Content;
