const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ProfileSchema = new Schema({
       _id:mongoose.Schema.Types.ObjectId,
       address:String,
       dob:Date,
       about:String,
       active:{type: Boolean, Default: true},
       status:{type:String,default:"hey there i am using Sheq"},
       // contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'contact'}]
       contacts:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]

});


var Profile = mongoose.model("Profile",ProfileSchema);
module.exports=Profile;