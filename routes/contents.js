var express = require('express');
var User = require('../data/Content.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    getAllContent(res);
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    getContentById(id, res);
});

router.get('/user/:id', function (req, res, next) {
    var id = req.params.id;
    getContentByUserId(id, res);
});

router.put('/:id', function (req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var active = req.body.active;
    var data = { "_id": id, "name": name, "email": email, "active": active }
    updateUserById(id, data, res);

});


router.delete('/:id', function (req, res) {
    var id = req.params.id;
    deleteUserById(id)
    res.end("Record Deleted");
    //Delete user Profile
});


/* User Router Functions */

function postContent(data, res) {

    User.create(data, function (err, user) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({ "status": 200, "response": err }));
        }
        console.log("the user is created with id " + user._id);
        res.send(JSON.stringify({ "status": 201, "response": user }));
    });
}

function getAllContent(res) {
    res.setHeader('Content-Type', 'application/json');
    User.find(function (err, user) {
        if (err) throw err;
        if (!user) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
    });


}

function getContentById(uname) {
    //uname can be anything
    //for now only consider email and name
    //can use regular expression
}

function getContentByUserId(uname) {

}

function getContentByTag(uname) {

}




function updateContentById(id, data, res) {
    res.setHeader('Content-Type', 'application/json');
    User.findByIdAndUpdate(id, data, function (err, user) {
        if (err) return res.sendStatus(404);
        if (!user) return res.send(401);

        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));

    });



}

function deleteContentById(id) {



}






module.exports = router;
