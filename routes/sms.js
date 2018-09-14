var express = require('express');
var router = express.Router();
var request = require('request');
router.get('/:phoneNo', function (request, response, next) {
    res.setHeader('Content-Type', 'application/json');

    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/sendotp.php?template=&otp_length=6&authkey=147351AegMLMB0q58e0e449&message=&sender=ELZIRE&mobile=" + request.params.phoneNo,
        "headers": {}
    };

    var req = request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();

});




module.exports = router;
