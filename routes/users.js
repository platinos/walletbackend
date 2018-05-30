var express = require('express');
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
  var name = req.body.name;
  var uname = req.body.uname;
  var email = req.body.email;
  var type = req.body.type;

  postUser(data)


});

router.post('/', function (req, res) {
  var name = req.body.name;
  var uname = req.body.uname;
  var email = req.body.email;
  var type = req.body.type;

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
