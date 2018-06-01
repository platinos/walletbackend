const mongoose = require('mongoose');
var contact = require('/data/Contact');
const Schema = mongoose.Schema;

var Profile = new Schema({

       userId:mongoose.Schema.Types.ObjectId,
       address:String,
       dob:date,
       about:String,
       status:{type:String,default:"hey there i am using Sheq"}
       // contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'contact'}]

});