var express = require('express');
var Profile = require('../data/Profile.js')
var User = require('../data/user.js')
const mongoose = require('mongoose');

var Requests = require('../data/FriendRequests')
var router = express.Router();
const bitgo = require('./bitgoauth')
var Wallet = require('../data/wallet.js')
router.post('/create/:id',function(req,res){
     
  createWallet(req.params.id,res);


    })

router.get('/:id',function(req,res){
 
   getAllWallet(req.params.id,res);

  })


  function createWallet(id,res){
      const label='my_wallet_one'
      const passphrase ='sheq_wallet_one'
       
            try{
                const walletOptions = {
                    label,
                    passphrase
                  };
                 
                  const wallet = yield bitgo.coin(coin).wallets().generateWallet(walletOptions);
                
                  const walletInstance = wallet.wallet;
                
                  console.log(`Wallet ID: ${walletInstance.id()}`);
                  console.log(`Receive address: ${walletInstance.receiveAddress()}`);
                
                  console.log('BACK THIS UP: ');
                  console.log(`User keychain encrypted xPrv: ${wallet.userKeychain.encryptedPrv}`);
                  console.log(`Backup keychain xPrv: ${wallet.backupKeychain.prv}`);
                  Wallet walletObj = new Wallet();
                  walletObj.userId = id;
                  walletObj.walletId= walletInstance.id();
                  walletObj.uxprv = wallet.userKeychain.encryptedPrv;
                  walletObj.uxpub =  wallet.userKeychain.xpub;

                }
              catch(e){



                  }

   }








   