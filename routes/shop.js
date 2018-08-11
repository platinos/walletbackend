var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
const Profile = require('../data/Profile.js');
var Wallet = require('../data/wallet.js')
var router = express.Router();


router.post('/create',(req,res)=>{
  
    var data = {owners:req.body.owners,Icon:req.body.Icon, Name:String,
    Description:req.body.Description,
    CoverImage:req.body.CoverImage,
    Category:req.body.Category,
    Address:req.body.Address,
    wallets:req.body.wallets}
       
    createShop(data,res);
 });

function createshop(data,res){

   if(data.owners===undefined){}

   else{
      
    Shop.create(data,(err,shop)=>{
  if(err)  return res.send({"error":"err"})
  if(!shop) return res.send({"empty":"yes"})
    /* Profile.find({_id: {$in: data.owners}},(err,profiles)=>{
      for(profile in profiles){
       profile.shops.push(shop._id);
       profile.save();
       
      } 
      
      }); */
      res.send({"response":shop})
    })


      }


   }

router.get('/:id',(req,res)=>{

 getShopById(req.params.id,res);


 });

 function getShopById(id,res){
   Shop.findOne(id).populate('owners').populate('wallets').exec((err,shop)=>{
     if(err)  return res.send({"error":err})
     if(!shop) return res.send({"empty":yes})
     res.send({"response":shop})
   
     })


    }

router.get('/:userId',(req,res)=>{
  getShopByUser(req.params.userId,res);
     
    
   });

   function getShopByUser(userId,res) {
    var resShops = [];
    Shop.find((err, shops) => {
      if (err)
        return res.send({ "error": err });
      if (!shops.length)
        return res.send({ "empty": "yes" });
      var shop;
      for (shop in shops) {
        if (shop.owners != undefined && shop.owners.length) {
          var user;
          for (user in shop.owners) {
            if (user.equals(userId)) {
              resShops.push(shop);
              break;
            }
          }
        }
      }
      res.send({ "response": resShops });
    });
  }

router.put('/update/:shopId',(req,res)=>{
      
      updateShop(req.params.shopId,req.body,res);

    });

    function updateShop(id,data,res){

      Shop.findByIdAndUpdate(id,data,(err,Shop)=>{
          if(err) return res.send({"error":err})

          


        })



    }

router.delete('/:id',(req,res)=>{
   


     });




