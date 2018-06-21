var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
var Comment = require('../data/Comment.js');
var router = express.Router();



router.post('/addComment/:contentId/:id',(req,res)=>{
   //is is user id who posts a comment
     addCommentToContent(req,res);

 });

router.put("/editComment/:commentId",(req,res)=>{
  
           editComment(req,res);

});

router.post("/addLike/:cId:/:uId",(req,res)=>{
                
     addLikeToComment(req,res);
    
  })

 
router.get('/',(req,res)=>{
    Comment.find((err,comment)=>{
         if(err)  throw err;
         res.send({"response":comment});
            });

      });


  function addLikeToComment(req,res){
          Comment.findById(req.params.cId,(err,comment)=>{
             comment.likes.push({"liker":req.params.uId});
             comment.save((e,c)=>{
              if(e)  throw e;
               res.send({"response":"Ok"});
             });
      });
      
  

  }

  function addCommentToContent(req,res){

     var cId = req.params.contentId;
      data = {"comment":req.body.comment,"user":req.params.id,"content":cId}
   
       Comment.create(data,(err,commentdoc)=>{
        if(err)  throw err;
              
           Content.findById(cId,(e,content)=>{
                if(e) throw e;
                content.comments.push(commentdoc._id);
                content.save((err,content)=>{
                  if(err) throw err;
                  res.send({"response":commentdoc});
                });
                
           });


        });

      


  }


function editComment(req,res){
   var id = req.params.commentId;
   Comment.findByIdAndUpdate(id,{"comment":req.body.comment},
   (err,comment)=>{
   if(err)  throw err;

    res.send({"result":"updated","error":"No","response":comment});

   });


}




module.exports = router;