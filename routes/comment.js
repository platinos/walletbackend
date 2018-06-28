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


// getLikesOnComment
function getLikes(req,res){
  // var commentId = req.params.id;
   Conmment.findById(req.params.commentId).select('_id likes')
   .populate({path:'likes.liker',select:'name _id'})
   .exec((err,response)=>{
    if(err)  return res.send({"error":err}); 
    var   likesArr = [];
   likesArr= response.likes.map((item)=>{
       var doc = { "timeStamp": item._id.getTimestamp(),
                  "user_id":item.liker._id,
                  "name":item.liker.name,
                  "ImageUrl":item.liker.ImageUrl
                  //"time":item.time

              };
        return doc;

      });

      res.send({"response":likesArr});

   });


   }


module.exports = router;