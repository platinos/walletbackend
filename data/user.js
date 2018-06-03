//user schema
const mongoose = require('mongoose');
var Profile = require('../data/Profile.js')
const Schema = mongoose.Schema;

delete mongoose.connection.models['User'];
var userSchema = new Schema({
        name:String,
        email:{type:String,default:null},
        phone:String,
        password:String,
        displayPic:String,
        created:Date,
        lastLogin:Date,
        active:{type:Boolean,default:false}
       
        
    });

     var User = mongoose.model("User",userSchema);
 module.exports=User;


