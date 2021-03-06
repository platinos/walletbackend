const mongoose = require('mongoose');
var User = require('./User');
var Content = require('../data/Contents.js');
var Wallet = require('./wallet')
var Shop=require('../data/Shop.js')
const Schema = mongoose.Schema;
delete mongoose.connection.models['Profile'];
var ProfileSchema = new Schema({
       _id:mongoose.Schema.Types.ObjectId,
       address:String,
       dob:Date,
       about:String,
       active:{type: Boolean, Default: true},
       status:{type:String,default:"hey there i am using Sheq"},
       // contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'contact'}]
       contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       contents:[{type:mongoose.Schema.Types.ObjectId,ref:'Content'}],
       saves:[{saved:{type:mongoose.Schema.Types.ObjectId,ref:'Content'}}],//ref for posts saved by user.
       wallets:[{type:mongoose.Schema.Types.ObjectId,ref:'Wallet'}],
       shops:[{type:mongoose.Schema.Types.ObjectId,ref:'Shop'}],
       sent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
       friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],


});


var Profile = mongoose.model("Profile",ProfileSchema);
module.exports=Profile;