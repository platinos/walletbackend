var express = require('express');
var User = require('../data/User.js')
var Profile = require('../data/Profile.js')
var Requests = require('../data/FriendRequests')
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

  getAllUsers(res);
});




router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  getUserById(id,res);
});

router.post('/login', function (req, res) {
  var password = req.body.password;
  var uname = req.body.uname;
  console.log(password);
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
  var data = {"_id":id,"name":name,"email":email,"active":active}
  updateUserById(id, data,res);

});


router.delete('/:id', function (req, res) {
  var id = req.params.id;
  deleteUserById(id)
  res.end("Record Deleted");
  //Delete user Profile
});

/* User Router Functions */

function postUser(data, res) {
   
  User.find({email:data.email},function (err,user){
       if(err)  return console.error(err);
       if(user.length){
        return res.send({"response":"user already exists"});
           }
       
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


  })

}

function getAllUsers(res) {
  res.setHeader('Content-Type', 'application/json');
  User.find((err,user)=>{
   if(err)   res.send(JSON.stringify({ "error":"no user data", "response": null}));

   res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));



  }) 


}

function getUserByUname(uname,password,res) {
   
  User.findOne({phone:uname},(err,user)=>{
      if(err)  return res.send({"error":err})

      if(user){
        console.log(user.password);
            if(user.password===password)
           return res.send({"response":user});
           return res.send({"response":"wrong password or username"});
          }

    User.find({email:uname},(err,user)=>{
         if(err)  return err;
         if(user){
          if(user.password===password)
         return res.send({"response":user});
         return res.send({"response":"wrong password or username"});
        }
         

      })
      res.send({"response":"user not found"});
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
