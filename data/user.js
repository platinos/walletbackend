//user schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var userSchema = new Schema({
        name:String,
        email:String,
        phone:String,
        password:String,
        displayPic:String,
        created:Date,
        lastLogin:Date,
        active:{type:boolean,default:false}
      
    });

    var User = mongoose.model("User",userSchema);
module.exports=User;


