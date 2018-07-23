
var express = require('express');
var Profile = require('../data/Profile.js')
var User = require('../data/user.js')
const mongoose = require('mongoose');

var Requests = require('../data/FriendRequests')
var router = express.Router();
const bitgo = require('../bitgoauth.js')
const Wallet = require('../data/wallet.js')
 
router.get('/:uid', function (req, res) {

  getWalletForUser(req, res);

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

    router.post('/makeTransaction/type',(req,res)=>{
      console.log("hi******************************");
      //res.send({"response":{"id":req.body.walletId,"address":req.body.destAddress}})
 sendTransaction(req.body.walletId,req.body.destAddress,req.body.amount,res);

      });

      router.post('/makeTransactionToMany/type/many',(req,res)=>{
                var data = { "walletId":req.body.walletId,
                               "recipients":req.body.recipients,"coin":req.body.coin }
               sendTransactionsToMany(data,res);


            });



    function sendTransactionsToMany(data,res){
         let walletId=data.walletId;
           let coin = data.coin;
      Wallet.findOne({"walletId":walletId},function(err,walletData){
        if(err)  return console.error(err);
        if(!walletData)  return res.send({"response":"InvalidWalletId"});
           console.log("the address is destAddress"+  destAddress);
          let params = {
                 recipients:data.recipients,//array of {amount,addresses}
                 walletPassphrase: walletData.passPhrase 
                  };
                 var wallets = bitgo.coin(coin).wallets();
                 var data = {
                   "id":walletId
                  };
                  wallets.get(data, function callback(err, wallet) {
                   if (err) {
                     return console.error(err)
                   }
                   wallet.sendMany(params,(err,transaction)=>{
                     console.log(params);
                     console.log(err)
                     if(err)  return  res.send({"error":err});
                     res.send({"response":transaction});

                   })
                   
                 });
                 
      }) ; 




              }


function getWallet(wId, coinType,,res){
  var wallets = bitgo.coin(coinType).wallets();
  var data = {
    "id": wId
   };
   wallets.get(data, function callback(err, wallet) {
    if (err) {
      return conmsole.error(err)
    }
    console.dir(wallet);
    res.send({"response":wallet._wallet});

    
  });
 
    }
function getWalletForUser(req,res){
  var uid = req.params.uid;
   wallet.findOne({"userId":uid},(err,walletData)=>{
     if (err) { return res.send({ "error":  err })}
    if(!walletData){
      res.send({ "error": "wallet not found: "+err });
    }
    else{
      res.send({ "response": walletData });
    }
   });
  
 
}
  
    function createWallet(req,res){
      let label = req.body.label;
      let passphrase =req.body.password;
      let id = req.params.id
      let coin =req.body.coin
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



   function sendTransaction(walletId,destAddress,amount,res){
              
    Wallet.findOne({"walletId":walletId},function(err,walletData){
         if(err)  return console.error(err);
         if(!walletData)  return res.send({"response":"InvalidWalletId"});
            console.log("the address is destAddress"+  destAddress);
           let params = {
                  amount: amount,  //amount in integer
                  address: destAddress,  //destination address
                  walletPassphrase: walletData.passPhrase //walletpassPhrase
                  };
                  var wallets = bitgo.coin('tbtc').wallets();
                  var data = {
                    "id":walletId
                   };
                   wallets.get(data, function callback(err, wallet) {
                    if (err) {
                      return console.error(err)
                    }
                    wallet.send(params,(err,transaction)=>{
                      console.log(params);
                      console.log(err)
                      if(err)  return  res.send({"error":err});
                      res.send({"response":transaction});

                    })
                    
                  });
                  
       }) ;   

     
      }


   
      router.get('/:coin/:walletId/transfer',function(req,res){

         let walletId = req.params.walletId;
         let coin = req.params.coin;

         var wallets = bitgo.coin(coin).wallets();
         var data = {
           "id":walletId
          };
          wallets.get(data, function callback(err, wallet) {
           if (err) {
             return console.error(err)
             }

             wallet.transfers(err,function(err,transfers){
                if(err) return console.error(err);
                res.send({"response":transfers});
           });
             
          });
      
        })


   module.exports = router;





   