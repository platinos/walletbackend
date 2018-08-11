var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
const Profile = require('../data/Profile.js');
var Wallet = require('../data/wallet.js')
var Shop = require('../data/Shop.js')
var router = express.Router();


router.post('/create',(req,res)=>{
  
    var data = {owners:req.body.owners,Icon:req.body.Icon, Name:req.body.Name,
    Description:req.body.Description,
    CoverImage:req.body.CoverImage,
    Category:req.body.Category,
    Address:req.body.Address,
    wallets:req.body.wallets}
   createShop(data,res);
 });

function createShop(data,res){

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
      Shop.find({_id:shop._id}).populate('owners').exec((err,shop)=>{

        if(err)  return res.send({"error":err})
        res.send({"response":shop})

      });
     
    })


      }


   }

router.get('/:id',(req,res)=>{

 getShopById(req.params.id,res);


 });

 function getShopById(id,res){
   Shop.findOne({_id:id}).populate('owners').populate('wallets').exec((err,shop)=>{
     if(err)  return res.send({"error":err})
     if(!shop) return res.send({"empty":"yes"})
     res.send({"response":shop})
   
     })


    }

router.get('/user/:userId',(req,res)=>{
  getShopByUser(req.params.userId,res);
     
    
   });

   function getShopByUser(userId,res) {
    var resShops = [];
    Shop.find((err, shops) => {
      if (err)
        return res.send({ "error": err });
      if (!shops.length)
        return res.send({ "empty": "yes" });
      var i=0;
      for (i in shops) {
          
        if (shops[i].owners != undefined) {
          var j=0;
          for (j in shops[i].owners) {
            if (shops[i].owners[j].equals(userId)) {
              resShops.push(shops[i]);
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

      Shop.findByIdAndUpdate(id,data,(err,shop)=>{
          if(err) return res.send({"error":err})
         
          Shop.findById(shop._id,(err,updatedshop)=>{
            if(err)  return res.send({"error":err})

            res.send({"response":updatedshop});  
          })
          


           })



     }

router.delete('/:id',(req,res)=>{
   


     });


     module.exports = router;

