var express = require('express');
var router = express.Router();
var Content = require('../data/Content');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    Content.find({ name1: 'Priyank' }, function (err, user) {
        if (err) throw err;
        if (!user) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
    });
});



module.exports = router;
