var express = require('express');
var User = require('../data/User.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  getAllUsers();
});




router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  getUserById(id);
});

router.post('/login', function (req, res) {
  var pass = req.body.password;
  var uname = req.body.uname;

  getUserByUname(uname);

  


});

router.post('/signup', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var name = req.body.name;
  var email = req.body.email;
  var active = req.body.active;
  var data = {"name":name,"email":email,"active":active}
   var result =  postUser(data);
   console.log(result);
   res.send(JSON.stringify({"status":200,"response":result}));

  });

router.post('/', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var data = {"name":name,"email":email}
  postUser(data)


});

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var uname = req.body.uname;
  var email = req.body.email;
  var type = req.body.type;

  updateUserById(id, data);

});


router.delete('/:id', function (req, res) {
  var id = req.params.id;
  deleteUserById(id)
  res.end("Record Deleted");
});


/* User Router Functions */

function postUser(data) {

  User.create(data,function(err,user){

       if(err){
         console.log(err);
       }

        console.log("the user is created with id "+ user._id);
     return user;
      


  })
  
     

  
}

function getAllUsers() {

}

function getUserByUname() {

}

function getUserById(id) {

}

function updateUserById(id, data) {

}

function deleteUserById(id) {

}






module.exports = router;
