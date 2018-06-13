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
  
    updateContentById(req, res);

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

router.post('/share/:content/:user',(req,res)=>{

   doShare(req,res);
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

function doShare(req,res){
  //add to shared list of content
  //create new content in content 
    var uId= req.params.user;
    var cId = req.params.content;
    var addedContent = req.body.content;
   Content.findById(cId,(err,content)=>{
       if(err)  return console.log(err);
        var newContent = new Content();
        if(addedContent){
          newContent.content=addedContent;
        }
         newContent.user=uId;
         newContent.isShared=true;
         newContent.parent=cId;
         newContent.save((err,newContent)=>{
         if(err)  throw err;
         console.log(newContent._id);
         content.shares.push({sharedBy:uId});
           content.save((e,c)=>{
               if(e)  throw e;
               res.send({"response":newContent});  
           });
           

         })
   

    })


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

 Content.find().populate('likes.liker')
 .populate('shares.sharedBy')
 .populate('parent')
 .populate('user')
 .exec((e,content)=>{

        if(e)  return console.error(e);
     
        res.send({"response":content});

    });
}

function getContentById(id,res) {
    res.setHeader('Content-Type', 'application/json');
    
Content.findById(id).populate('likes.liker').populate('shares.sharedBy')
.populate('user').populate('parent').exec((e,content)=>{

   if(e)  return console.error(e);

   res.send({"response":content});
   


    }) 


}

function getContentByUserId(uname) {

}

function getContentByTag(uname) {
  
}




function updateContentById( req, res) {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;
     Content.findById(id,(err,content)=>{
          if(err)  throw err;
       var c = req.body.content;
     if(c){
        content.content=c;
       
      }

      content.save((err,response)=>{
       if(err)   throw err;

          res.send({"response":response});

      });

    });
}

function deleteContentById(id) {



}






module.exports = router;
