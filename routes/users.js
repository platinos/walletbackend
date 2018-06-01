var express = require('express');
var User = require('../data/User.js')
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
  var result = postUser(data, res);
   console.log(result);

  });

router.post('/', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var data = {"name":name,"email":email}
  postUser(data,res)


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

function postUser(data, res) {

  User.create(data,function(err,user){
  if(err){
         console.log(err);
        res.send(JSON.stringify({ "status": 200, "response": err }));
       }
      console.log("the user is created with id "+ user._id);
      res.send(JSON.stringify({ "status": 201, "response": user }));
     });
}

function getAllUsers(res) {
  res.setHeader('Content-Type', 'application/json');
    User.find(function (err, user) {
        if (err) throw err;
        if (!user) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
    });


}

function getUserByUname() {

}

function getUserById(id,res) {
  res.setHeader('Content-Type', 'application/json');
  User.find({"_id":id},function (err, user) {
      if (err) throw err;
      if (!user) return res.send(401);
      res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
  });


}

function updateUserById(id, data) {

}

function deleteUserById(id) {



}






module.exports = router;
