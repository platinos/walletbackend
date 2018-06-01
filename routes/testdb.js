var express = require('express');
var router = express.Router();
var user = require('../data/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    user.create({name:'Priyank'},function (err, user) {
        if (err) throw err;
        if (!user) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": user }));
    });
    
});



module.exports = router;
