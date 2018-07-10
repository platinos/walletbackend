const mongoose = require('mongoose');
var Profile = require('../data/Profile.js')
const Schema = mongoose.Schema;


var walletSchema = new Schema ({
         userId:String,
         walletId:[String],
        uxprv:String,  //user private key
         uxpub:String, //user public key
        bxprv:String,  //backup private key
        bxpub:String  //backup public key 

          });


     var Wallet = mongoose.model("Wallet",userSchema);
     module.exports=Wallet;


