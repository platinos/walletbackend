var express = require('express');
var Profile = require('../data/Profile.js')
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
    getContactsById(id, res);
});


router.put('/:id', function (req, res) {
    var id = req.params.id;
    var address = req.body.address;
    var dob = req.body.dob;
    var active = req.body.active;
    var data = { /*Fill this*/ }
    updateProfileById(id, data, res);

});





/* Profile Router Functions */



function getAllProfiles(res) {
    res.setHeader('Content-Type', 'application/json');
    User.find(function (err, user) {
        if (err) throw err;
        if (!user) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
    });


}

function getProfileByUname(uname) {
    //uname can be anything
    //for now only consider email and name
    //can use regular expression




}

function getProfileById(id, res) {
    res.setHeader('Content-Type', 'application/json');
    User.find({ "_id": id }, function (err, user) {
        if (err) return res.sendStatus(404)
        if (!user) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
    });


}

function updateProfileById(id, data, res) {
    res.setHeader('Content-Type', 'application/json');
    User.findByIdAndUpdate(id, data, function (err, user) {
        if (err) return res.sendStatus(404);
        if (!user) return res.send(401);

        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));

    });
}


function getContactsById(id, res) {

}






module.exports = router;
