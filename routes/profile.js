var express = require('express');
var Profile = require('../data/Profile.js')
var User = require('../data/user.js')
var router = express.Router();

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

router.get('/contacts/add/:id/:fid',(req,res)=>{
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
      var id = req.params.id;
        Profile.findById(id,(err,profile)=>{
      if(err)  return console.error(err);
      console.log(profile.toObject().contacts);
      if(!profile.contacts.includes(req.params.fid)){
          profile.contacts.push(req.params.fid);
         }  
     profile.save((err,profile)=>{
          if(err) return console.error(err);
            //to add id to fid's contact list
          Profile.findById(req.params.fid,(err,friend)=>{

             if(err)  return console.error(err);

             friend.contacts.push(id);
             friend.save((err,friend)=>{
               if(err)  return console.error(err);

               res.send({"user":profile,"friend":friend});

             });

          })
               
          
         

       })
          
         

     });



}




module.exports = router;
