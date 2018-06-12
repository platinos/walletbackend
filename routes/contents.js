var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    getAllContent(res);             //done
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    getContentById(id, res);        //not done
});

router.get('/user/:id', function (req, res, next) {
    var id = req.params.id;
    getContentByUserId(id, res);     //not done 
});

router.put('/:id', function (req, res) { //not done 
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

router.post('/post/:id',function(req,res){
  postContent(req,res);

});

router.put('/:contentId/:likerId',function(req,res){

     addLike(req,res);

});

function addLike(req,res){
    var contentId = req.params.contentId;
    var likerId = req.params.likerId;
Content.findById(contentId,(err,content)=>{
       content.likes.push({liker:likerId,time:Date.now()});
    content.save((e,c)=>{
    if(e)   throw e;
     res.send({"response":content});
    
    });
   
  });

}

/* User Router Functions */

function postContent(req, res) {
   var body = req.body.content;
   var id = req.params.id;
    //create content and assign id to content and save 
    var data = {"content":body,"user":id}

   Content.create(data,function(err,content){
  if(err)  throw err;

    res.send({"response":content});


    });  
   


   
}

function getAllContent(res) {
    res.setHeader('Content-Type', 'application/json');
  /*  Content.find(function (err, contents) {
        if (err) throw err;
        if (!contents) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": contents }));
    });  */

 Content.find().populate('likes.liker').populate('shares.sharedBy').exec((e,content)=>{

        if(e)  return console.error(e);
     
        res.send({"response":content});

    });
}

function getContentById(id,res) {
    res.setHeader('Content-Type', 'application/json');
    
  Content.findById(id).populate('likes.liker').populate('shares.sharedBy').exec((e,content)=>{

   if(e)  return console.error(e);

   res.send({"response":content});
   


    }) 


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
