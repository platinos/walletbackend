var express = require('express');
var router = express.Router();
var request = require('request');
router.get('/:phoneNo', function (request1, response, next) {
    response.setHeader('Content-Type', 'application/json');

    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/sendotp.php?template=&otp_length=6&authkey=147351AegMLMB0q58e0e449&message=&sender=ELZIRE&mobile=" + request1.params.phoneNo,
        "headers": {}
    };

    var req = request(options, function (error, res) {
        
        response.send(JSON.stringify({ "status": 200, "error": error, "response": res }));
        
    });

    req.end();

});




module.exports = router;
