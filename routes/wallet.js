
var express = require('express');
var Profile = require('../data/Profile.js')
var User = require('../data/user.js')
const mongoose = require('mongoose');

var Requests = require('../data/FriendRequests')
var router = express.Router();
const bitgo = require('../bitgoauth.js')
const Wallet = require('../data/wallet.js')
router.post('/create/:id',function(req,res){
     console.log("hello***********")
  createWallet(req.params.id,res);


    })

router.post('/:id',function(req,res){
 //api to create wallet 
 //body:{label,password}
   createWallet(req,res);

  })

  router.get('/createAddress/:wId/:coin',function (req,res){

      generateAddress(req,res);

  })

  //to get wallet 
  router.get('/:coin/:walletId',function (req,res){
    
    getWallet(req.params.walletId,req.params.coin,res);

    })

function getWallet(wId,coinType,res){
  var wallets = bitgo.coin(coinType).wallets();
  var data = {
    "id": wId
   };
   wallets.get(data, function callback(err, wallet) {
    if (err) {
      return conmsole.error(err)
    }
    console.dir(wallet);
    res.send({"response":wallet._wallet})
    
  });
 
    }
  
    function createWallet(req,res){
      let label = req.body.label;
      let passphrase =req.body.password;
      let id = req.params.id
    var data = {
      "passphrase":passphrase ,
      "label": label,
      "backupXpubProvider": "keyternal"
      }
    
    bitgo.coin('tbtc').wallets().generateWallet(data, function(err, result) {
      if (err) { console.dir(err); throw new Error("Could not create wallet!"); }
      console.dir(result.wallet._wallet);
      console.log("User keychain encrypted xPrv: " + result.userKeychain.encryptedXprv);
      console.log("Backup keychain xPub: " + result.backupKeychain.xPub);
      console.log(result.userKeychain);
      console.log(result.backupKeychain);

      var data = {"userId":id,"walletId":result.wallet._wallet.id,"userKeychain":result.userKeychain,
      "backupKeychain":result.backupKeychain,"addresses":[]}
      data.addresses.push({"address":result.wallet._wallet.receiveAddress.address});
    Wallet.create(data,function (err,newWallet){
        if(err)  return console.error(err);
           return res.send({"response":newWallet ,"wallet":result.wallet._wallet});
        })
    
      })
    
} 

/*function createWallet(req,res){
      let label = req.body.label;
      let passphrase =req.body.password;
      let id = req.params.id
    var data = {
      "passphrase":passphrase ,
      "label": label,
      "backupXpubProvider": "keyternal"
      }
    
    bitgo.wallets().createWalletWithKeychains(data, function(err, result) {
      if (err) { console.dir(err); throw new Error("Could not create wallet!"); }
      console.dir(result.wallet.wallet);
      console.log("User keychain encrypted xPrv: " + result.userKeychain.encryptedXprv);
      console.log("Backup keychain xPub: " + result.backupKeychain.xPub);
      console.log(result.userKeychain);
      console.log(result.backupKeychain);

      var data = {"userId":id,"walletId":result.wallet.wallet.id,userKeychain:result.userKeychain,
      backupKeychain:result.backupKeychain}
    Wallet.create(data,function (err,newWallet){
        if(err)  return console.error(err);
           return res.send({"response":newWallet ,"wallet":result.wallet.wallet});
        })
    
      })
    
}  */            
             
   function  generateAddress(req,res){

    let wId = req.params.wId;
    //generate addresss for the respective wallet 
    //address wallet for the 
    bitgo.coin(req.params.coin).wallets().get({ "id": wId }, function callback(err, wallet) {
      if (err) {
        throw err;
      }
      wallet.createAddress({ "chain": 0 }, function callback(err, address) {
        //get the Wallet object for the userId.
        //find the wallet generate Address and save.
        //saved the address in user wallet schema
        if(err)  return console.error(err);
          console.log(address)
             Wallet.findOne({walletId:wId},(err,userWallet)=>{
               if(err)  throw err
               userWallet.addresses.push({"address":address.address})
               userWallet.save((err,updated)=>{
                 if(err)  throw err
                 res.send({"response":address});
                })  
               })
              })
        })         

   }


   module.exports = router;





   