var express = require('express');
var Profile = require('../data/Profile.js')
var User = require('../data/user.js')
const mongoose = require('mongoose');

var Requests = require('../data/FriendRequests')
var router = express.Router();

//********** Send friend request **********//
router.post('/addrequest/:id/:fid',(req,res)=>{
    var id = req.params.id;
    var fid=req.params.fid;
    Profile.findById(fid,function(err,friend){
        if(err)  return console.error(err);
        friend.friendRequests.push(id);
        friend.save((err,friend)=>{
          if(err) return console.error(err);
            Profile.findById(id,(err,user)=>{
                if(err)  return console.error(err);
                user.sent.push(fid);
                user.save((e,u)=>{
                if(e) return console.error(e);
                res.send({"response":[u,friend]});
                })
            })
        })
    })
})
    
//**********Accept friend request **********//
router.post('/acceptrequest/:id/:fid', (req, res) => {
    var id = req.params.id;
    var fid = req.params.fid;
    Profile.findById(fid, function (err, friend) {
        if (err) return res.send({ "error": "Wrong Friend Id."});
        friend.friendRequests.push(id);
        friend.save((err, friend) => {
            if (err) return res.send({ "error": "Error saving request." });
            Profile.findById(id, (err, user) => {
                if (err) return res.send({ "error": "Wrong User Id." });
                user.sent.push(fid);
                user.save((e, u) => {
                    if (e) return console.error(e);
                    res.send({ "response": [u, friend] });
                })
            })
        })
    })
})

    
    router.post('/addContact/:id/:fid',function(req,res){

        addContact(req,res);
    });
   //***************************************  




/* GET users listing. */
router.get('/', function (req, res, next) {
    getAllProfiles(res);
});




router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    getProfileById(id, res);
});


router.get('/contacts/:id', function (req, res, next) {
    var id = req.params.id;
    console.log("the id is "+ id);
    getContactsById(id, res);
});


router.put('/:id', function (req, res) {
    var id = req.params.id;
    var address = req.body.address;
    var dob = req.body.dob;
    var active = req.body.active;
    var status= req.body.status;
    var about = req.body.about;
    var data = { "address":address,"dob":dob,"active":active,"status":status,"about":about }
    updateProfileById(id, data, res);

});

router.post('/contacts/add/:id/:fid',(req,res)=>{
   addContact(req,res);
    
});


router.get('/:id/saves',(req,res)=>{
       var id = req.params.id; 
   getSavedContent(id,res);


  })

/* Profile Router Functions */



function getAllProfiles(res) {
    res.setHeader('Content-Type', 'application/json');
    Profile.find().populate('user').exec(function(err,profile){
     if(err)   return console.error(err);

     console.log(`The comment is ${profile}`);
    
     res.send(JSON.stringify({ "status": 201, "response":profile }));



    });



}

function getProfileByUname(uname) {
    //uname can be anything
    //for now only consider email and name
    //can use regular expression




}

function getProfileById(id, res) {
    res.setHeader('Content-Type', 'application/json');
    Profile.findById(id).populate('user').exec(function(err,profile){
        if(err)   return console.error(err);
   
        //console.log(`The comment is ${profile}`);
       
        res.send(JSON.stringify({ "status": 201, "response":profile }));
   


}); 
}

function updateProfileById(id, data, res) {
    res.setHeader('Content-Type', 'application/json');
    Profile.findByIdAndUpdate(id, data, function (err, profile) {
        if (err) return res.send({"error":err});
        if (!profile) return res.send(401);

        res.send(JSON.stringify({ "status": 200, "error": null, "response": profile }));

    });
}


function getContactsById(id, res) {
    res.setHeader('Content-Type', 'application/json');

    Profile.findById(id).populate('contacts').exec(function (err,profile) {
    if(err)  return console.error(err);
    //if(profile==null)
    // return  res.send(JSON.stringify({ "status": 200, "error": null, "response": "no contacts" }));
    
     res.send(JSON.stringify({ "status": 200, "error": null, "response": profile }));

    })



}

function addContact(req,res){
    res.setHeader('Content-Type', 'application/json');
   var status = req.body.status;
   if(status==='Accept'){
      var id = req.params.id; //here id is the recippient of friend request
      var fid = req.params.fid;//id of person who sent the friend request
    Profile.find({"_id":{$in:[id,fid]}},(err,profiles)=>{
    if(err) return res.send({"response":err});
    var user,friend;
      if(profile[0]._id.equals(id)){
          user = profile[0];
          friend=profile[1];
      }
      if(profile[0]._id.equals(fid)){
          user = friend[1];
          friend=prodile[0];
      }
    //here should be some logic to check if user exist in contact list or not but it looks like redundendt here.
       user.save((e,u)=>{
  if(e) throw e;
      friend.save((e,f)=>{
         if(e)  throw e;
         res.send({"response":[u,f]});
         removeRequest(id,fid);
      })
       })
    
    
        


    });

        

   }
else{

   //pata nai
}


}


function removeRequest(userId,friendId){
  Profile.find({"_id":{$in:[userId,friendId]}},(err,docs)=>{
   console.log(docs);
    if(err)  return console.error(err);
         
// if(docs[0]._id.equals(userId)){
//      docs[0].requests.pull(friendId);
//      docs[1].sent.pull(userId);
//        }
//      else {
//         docs[1].requests.pull(friendId);
//         docs[0].sent.pull(userId);

//       }
      
//       console.log(docs[0].requests);
//         docs[0].save((e,u)=>{

//             if(e) throw e;
//             docs[1].save((e,f)=>{

//                 if(e) throw e;
//                 console.log([u,f]);
//             })
//         })
   

  })


}


function getSavedContent(id,res){

      Profile.findById(id).select('saves').populate('saves.saved').exec(function(err,profile){
             if(err) throw err;
             if(!profile) return res.send({"response":"no user"});

    res.send({"status":200,"response":profile});
 

   });
    




}

module.exports = router;
