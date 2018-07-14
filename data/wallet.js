const mongoose = require('mongoose');
var Profile = require('../data/Profile.js')
const Schema = mongoose.Schema;

//wallet to store userID and then wallets and their addresses.
//store userId and wallet..
 var walletSchema = new Schema ({
         userId:String,
         coin:String,
         walletId:String,
         addresses:[{address:String,date:{type:Date,default:Date.now}}],
      backupKeychain:{ id: String,
      users: [ String ],
      pub: String,
      ethAddress: String,
      provider: String,
      source: String } ,
        userKeychain:{ id: String,
        users: [ String ],
        pub: String,
        ethAddress: String,
        encryptedPrv: String,
        prv: String }
                            
      });


     var Wallet = mongoose.model("Wallet",walletSchema);
     module.exports=Wallet;


