var express = require('express');
var User = require('../data/User.js')
var Profile = require('../data/Profile.js')
var Requests = require('../data/FriendRequests')
var router = express.Router();
var bcrypt = require('bcrypt');
/* GET users listing. */
router.get('/', function (req, res, next) {

  getAllUsers(res);
});



router.get('/phone/:phoneNo', function (req, res, next) {
  var phoneNo = req.params.phoneNo;
  getUserByPhone(phoneNo, res);
});

router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  getUserById(id,res);
});

router.post('/login', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var password = req.body.password;
  var uname = req.body.uname;
  console.log(password);
  console.log(uname);
  getUserByUname(uname,password,res);//uname can be email ,id or number 

  
});

router.post('/signup', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var name = req.body.name;
  var email = req.body.email;
  var active = req.body.active;
  var data = {"name":name,"email":email,"active":active,"ImageUrl":req.body.ImageUrl,"phone":req.body.phone,
  "password":req.body.password}
  var result = postUser(data, res);
  //Add user Profile
   console.log(result);

  });

router.post('/', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var data = {"name":name,"email":email}
  //Add user Profile
  postUser(data,res)


});

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var email = req.body.email;
  var active = req.body.active;
 
  var data = {"name":name,"email":email,"active":active,"ImageUrl":req.body.ImageUrl,"phone":req.body.phone,
  "password":req.body.password}
  updateUserById(id, data,res);

});
router.put('/updatepic/:id', function (req, res) {
  var id = req.params.id;

  var data = {
    "ImageUrl": req.body.ImageUrl
  }
  updateUserById(id, data, res);

});


router.delete('/:id', function (req, res) {
  var id = req.params.id;
  deleteUserById(id)
  res.end("Record Deleted");
  //Delete user Profile
});

/* User Router Functions */

function postUser(data, res) {
  var type=' '
   if(!(data.phone||data.email))
       return res.send({"error":"empty request"});
   if(data.email){
     type={email:data.email}
   }
   if(data.phone){
     type={phone:data.phone}

    }
    

   
  User.findOne(type,function (err,user){
       if(err)  return console.error(err);
       if(user){
        return res.send({"response":"user already exists"});
           }
       
           //hash the password 
        const  saltRounds = 10;
        //generate teh random salt
        bcrypt.hash(data.password, saltRounds, function(err, hash) {
          if(err)  return res.send({"error":"error in hashing"});
          // Store hash in your password DB.
          data.password=hash;
          User.create(data,function(err,user){
            if(err){
                   console.log(err);
              res.send(JSON.stringify({ "status": 200, "response": err }));
                }     
             Profile.create({"_id":user._id,"user":user._id},(err,profile)=>{
                 
                         if(err) res.sendStatus(403);
                           //creating request for user
                         Requests.create({"_id":profile._id},(err,request)=>{
                           if(err)  return console.error(err);
                            
                                 });
                         res.send(JSON.stringify({ "status": 201, "response": [user,profile] }));
                 
                 });
                           
              });
        });
   


  })

}

function getAllUsers(res) {
  res.setHeader('Content-Type', 'application/json');
  User.find({},"-password",(err,user)=>{
   if(err)   res.send(JSON.stringify({ "error":"no user data", "response": null}));
        
   res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));



  }) 


}

function getUserByPhone(phoneNo, res){
  type = { "phone": phoneNo };
  User.find(type, (err, user) => {
    if (err) return res.send({ "error": err });

    if (!user.length) {
      return res.send({ "registered": false });
    }
    else {
      return res.send({ "registered": true });
    }
  });

}


function getUserByUname(uname,password,res) {
   
 //write regex to deffrectiate between email and number:=
  //check for password 
  //return response
  //   var phone= /^\+\d{1,3}\d{9,10}$/;
  //  // var email=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   var type = ''
  //    if(phone.test(uname)){
  let  type={ phone:uname}
    
   console.log(type);
     User.findOne(type,(err,user)=>{
        if(err) return res.send({"error":err})
        //console.log(user);
        //if user not found in tool:=

           if(!user){
              return res.send({"response":"username or password  is wrong"});
            }

       //check if user is in database
        
       bcrypt.compare(password,user.password, function(err, isMatch) {
        // res == true
         if(err) {  return res.send({"response":"some error in comapring"})}
              
                if(isMatch){
                    user.password=null
                     res.send({"response":user,"success":"success"})
                 }

              else{ res.send({"response":"wrong password","error":"error"})}
        });
        

   })
     



}

function getUserById(id,res) {
  res.setHeader('Content-Type', 'application/json');
  User.find({"_id":id},function (err, user) {
      if (err) return res.sendStatus(404)
      if (!user) return res.send(401);
      res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
  });


}

function updateUserById(id, data,res) {
  res.setHeader('Content-Type', 'application/json');
   User.findByIdAndUpdate(id,data,function(err,user){
      if(err) return res.sendStatus(404);
      if(!user) return  res.send(401);

      res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));

   });



}

function deleteUserById(id) {

   

}






module.exports = router;
