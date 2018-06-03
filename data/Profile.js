const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var Profile = new Schema({
       _id:mongoose.Schema.Types.ObjectId,
       userId:mongoose.Schema.Types.ObjectId,
       address:String,
       dob:Date,
       about:String,
       active:{type: Boolean, Default: true},
       status:{type:String,default:"hey there i am using Sheq"},
       // contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'contact'}]
       contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]

});