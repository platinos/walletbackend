var express = require('express');
var Profile = require('../data/Profile.js')
var User = require('../data/user.js')
const mongoose = require('mongoose');

var Requests = require('../data/FriendRequests')
var router = express.Router();

//********** do not touch this
router.post('/addrequest/:id/:fid',(req,res)=>{
      var id = req.params.id;
      var fid=req.params.fid;

    Requests.findById(fid,function(err,friend){
        if(err)  return console.error(err);
        friend.requests.push(id);

        friend.save((err,friend)=>{
          if(err) return console.error(err);
            Requests.findById(id,(err,user)=>{
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
    var data = { "_id":id,"address":address,"dob":dob,"active":active,"status":status,"about":about }
    updateProfileById(id, data, res);

});

router.post('/contacts/add/:id/:fid',(req,res)=>{
   addContact(req,res);
    
});



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
        if (err) return res.sendStatus(404);
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
       var user = profiles[0];
       var friend=profiles[1];
    if(!user.contacts.includes(fid)){
        user.contacts.push(fid);
       } 

       if(!friend.contacts.includes(id)){
        friend.contacts.push(id);
       } 

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
  //userId => id of user who accepted or rejected the request 
  //friendId => who requested to be friend
 //freind id will be in request array of userId
 //userId will be in set array of friendID
  Requests.find({"_id":{$in:[userId,friendId]}},(err,docs)=>{
   console.log(docs);
    if(err)  return console.error(err);
         
if(docs[0]._id.equals(userId)){
     docs[0].requests.pull(friendId);
     docs[1].sent.pull(userId);
       }
     else {
        docs[1].requests.pull(friendId);
        docs[0].sent.pull(userId);

      }
      
      console.log(docs[0].requests);
        docs[0].save((e,u)=>{

            if(e) throw e;
            docs[1].save((e,f)=>{

                if(e) throw e;
                console.log([u,f]);
            })
        })
   

  })


}

function  removeFromArray(docs,userId,fId){
    var index = docs[0].requests.indexOf(new mongoose.Types.ObjectId(userId));
    if (index > -1) {
        
      docs[0].splice(index, 1);
    }

    var index = docs[1].sent.indexOf(new mongoose.Types.ObjectId(fId));
    if (index > -1) {
      docs[1].splice(index, 1);
    }
    
  return docs;
}

module.exports = router;
