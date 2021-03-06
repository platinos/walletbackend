const mongoose = require('mongoose');
var Profile = require('../data/Profile.js')
const Schema = mongoose.Schema;
var User = require('../data/User.js');
var Shop = require('../data/Shop.js')
//wallet to store userID and then wallets and their addresses.
//store userId and wallet..

delete mongoose.connection.models[Wallet];
 var walletSchema = new Schema ({
         shopId:{type: mongoose.Schema.Types.ObjectId, ref: 'Shop'},
         userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
         coin:String,
         walletId:String,
         passPhrase:String,
         addresses:[{address:String,date:{type:Date,default:Date.now}}],
        // type:String,
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


