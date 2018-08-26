var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
const Profile = require('../data/Profile.js');
var router = express.Router();


router.get('user/:userId', function (req, res) {
    getAllContentByUser(req, res);
})
router.get('/type/:type',function(req,res){

  var data = {"type":req.params.type}

   getContentsByType(data,res);
    
 })


 router.get('/type/project',function(req,res){
   
    var data = {"type":"project"}
    getContentsByType(data,res);


 })
 router.get('/type/post',function(req,res){
   
    var data = {"type":"post"}
    getContentsByType(data,res);


 })
/* GET users listing. */
router.post('/', function (req, res, next) {
    getAllContentPaged(req,res);             //done
});
router.get('/', function (req, res, next) {
    var id = req.params.id;
    getAllContent(id, res);   
});
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    getContentById(id, res);   //by content Id     //not done
});

router.post('/user/:id', function (req, res, next) {
    var id = req.params.id;
    getContentByUserId(req, res);     //not done 
});

router.put('/:id', function (req, res) { //not done 
  
    updateContentById(req, res);

});


router.delete('/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
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

router.get('/likes/:contentId',(req,res)=>{

    getLikesOnContent(req,res);

});

router.get('/shares/:contentId',(req,res)=>{
    getSharesOnContent(req,res);
})

router.post("/:contentId/comments",(req,res)=>{
    getCommentsByContentId(req,res);

 })

function addLike(req,res){ //or remove like 
    res.setHeader('Content-Type', 'application/json');
    var contentId = req.params.contentId;
    var likerId = req.params.likerId;
    //need to push contentId into saves array of profile object 

Content.findById(contentId,(err,content)=>{
       if(err)  return res.send({"error":err});
   var isExists= content.likes.map((item)=>{
       return item.liker;

    }).some((item)=>{ return item.equals(likerId)});
    console.log(isExists);
     if(!isExists){ //if starts
     content.likes.push({liker:likerId});
    content.save((e,c)=>{
    if(e)   throw e;
         //just for now getting profie to add to save value
         Profile.findById(likerId,(err,profile)=>{
           if(err)  return console.log(err);
           profile.saves.push(contentId);
           profile.save((err,profiles)=>{

            if(err)  return console.error(err)
            return res.send({"response":content});
           })

         })
     
    
    });
       }   //if ends
     else{
         var likeItem;
        content.likes.map((item)=>{

            if(item.liker.equals(likerId)){
              likeItem= item;
            }
        });
        content.likes.pull(likeItem);
        content.save((err,content)=>{
            if(err)  return console.error(err);

            Profile.findById(likerId,(err,profile)=>{
                if(err)  return console.log(err);
                profile.saves.pull(contentId);
                profile.save((err,profiles)=>{
     
                 if(err)  return console.error(err)
                 return res.send({"response":content});
                })
     
              })
            r
        });
        

     }
  });

}

function doShare(req,res){
  //add to shared list of content
  //create new content in content 
  res.setHeader('Content-Type', 'application/json');
    var uId= req.params.user;
    var cId = req.params.content;
    var addedContent = req.body.content;
    var type = req.body.type;
   Content.findById(cId,(err,content)=>{
       if(err)  return console.log(err);
        var newContent = new Content();
        if(addedContent){
          newContent.content=addedContent;
        }
         newContent.user=uId;
         newContent.isShared=true;
         newContent.parent=cId;
         newContent.type = type;
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
    res.setHeader('Content-Type', 'application/json');
    var body = req.body.content;
    var type=req.body.type;
    var title = req.body.title;
    var id = req.params.id;
       //create content and assign id to content and save 
       var data = {"content":body,"user":id,"image":req.body.image,"type":type,"title":title}
  Profile.findById(id,(err,profile)=>{
      if(err)  return res.send({"error":err});
      if(!profile) return res.send({"response":"InvalidUSerId"});
    Content.create(data,function(err,content){
        if(err)  throw err;
     profile.contents.push(content._id);
     profile.save((e,p)=>{
         if(e)  return res.send({"error":e});

         res.send({"response":content});
      });
    
      });  
 });
   
   


   
}
//get all content version1 
/*function getAllContent(res) {
    res.setHeader('Content-Type', 'application/json');
  /*  Content.find(function (err, contents) {
        if (err) throw err;
        if (!contents) return res.send(401);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": contents }));
    });  */

/* Content.find().sort('--createdAt').populate('likes.liker')
 .populate('shares.sharedBy')
 .populate('parent')
 .populate('user')
 .populate('comments')
 .exec((e,content)=>{

        if(e)  return console.error(e);
     
        res.send({"response":content});

    });
}  */

function getAllContentPaged(req, res) {
    console.log('inside method');
    res.setHeader('Content-Type', 'application/json');
    var page = req.body.page;
    const pageSize = 10;
    Content.find()
        .sort('-updated_at')
        .skip(pageSize * page)
        .limit(pageSize)
        .populate({ path: 'user', select: 'name  ImageUrl _id' })
        .populate({ path: 'parent', select: '',populate: { path: 'user', select: 'name ImageUrl _id' }})
        .populate('comments', 'comment likes user updated_at', null, { sort: { updated_at: -1 }, limit: 2, populate: { path: 'user', select: 'name ImageUrl _id' } }
        )
        .exec((err, contents) => {
            if (err) return res.send({ "error": err });


            var contentResponse = contents.map((item) => {
                var doc = {
                    "content": item.content,
                    "Id": item._id,
                    "PostByUser": { "Id": item.user._id, "image": item.user.ImageUrl, "name": item.user.name },
                    "likesCount": item.likes.length,
                    "sharesCount": item.shares.length,
                    "createdAt": item.created_at,
                    "updateAt": item.updated_at,
                    "isShared": item.isShared,
                    "parentContentId": item.parent,
                    "commentsCount": item.comments.length,
                    "comments": item.comments.map((item) => {
                        return {
                            "Id": item._id, "byUser": item.user, "likesCount": item.likes.length,
                            "updatedAt": item.updated_at
                        }
                    })


                }
                return doc;


            });
            res.send({ "response": contentResponse });


        });


}
function getAllContentByUser(req, res) {
    res.setHeader('Content-Type', 'application/json');

    Content.find({user: req.params.userId})
        .sort('-created_at')
        .populate({ path: 'user', select: 'name  ImageUrl _id' })
        .populate({ path: 'parent', select: '', populate: { path: 'user', select: 'name ImageUrl _id' } })
        .populate('comments', 'comment likes user updated_at', null, { sort: { updated_at: -1 }, limit: 2, populate: { path: 'user', select: 'name ImageUrl _id' } }
        )
        .exec((err, contents) => {
            if (err) return res.send({ "error": err });


            var contentResponse = contents.map((item) => {
                console.log(item);

                var doc = {
                    "content": item.content,
                    "Id": item._id,
                    "PostByUser": { "Id": item.user._id, "image": item.user.ImageUrl, "name": item.user.name },
                    "likesCount": item.likes.length,
                    "sharesCount": item.shares.length,
                    "createdAt": item.created_at,
                    "updateAt": item.updated_at,
                    "isShared": item.isShared,
                    "parentContentId": item.parent,
                    "commentsCount": item.comments.length,
                    "image": item.image,
                    "comments": item.comments.map((item) => {
                        return {
                            "Id": item._id, "byUser": item.user, "likesCount": item.likes.length,
                            "updatedAt": item.updated_at
                        }
                    })


                }
                return doc;


            });
            res.send({ "response": contentResponse });


        });


}

function getAllContent(req,res){
    res.setHeader('Content-Type', 'application/json');

    Content.find()
    .sort('-created_at')
    .populate({path:'user',select:'name  ImageUrl _id'})
    .populate({ path: 'parent', select: '',populate: { path: 'user', select: 'name ImageUrl _id' }})
    .populate('comments','comment likes user updated_at',null, { sort: { updated_at: -1 },limit:2,populate:{path:'user',select:'name ImageUrl _id'}}
    )
    .exec((err,contents)=>{
          if(err) return res.send({"error":err});
   
          
       var contentResponse = contents.map((item)=>{
            console.log(item);
           
              var doc = {
                      "content":item.content,
                       "Id":item._id,
                       "PostByUser":{"Id":item.user._id,"image":item.user.ImageUrl,"name":item.user.name},
                       "likesCount":item.likes.length,
                       "sharesCount":item.shares.length,
                       "createdAt":item.created_at,
                       "updateAt":item.updated_at,
                       "isShared":item.isShared,
                       "parentContentId":item.parent,
                        "commentsCount":item.comments.length,
                        "image":item.image,
                        "comments":item.comments.map((item)=>{
                              return {
                                    "Id":item._id, "byUser":item.user,"likesCount":item.likes.length,
                                     "updatedAt": item.updated_at
                              }
                        })
           

              }
              return doc;
                

       }); 
       res.send({"response":contentResponse});


    });


}
function getContentById(id,res) {
    res.setHeader('Content-Type', 'application/json');
    
Content.findById(id).populate('likes.liker').populate('shares.sharedBy')
.populate('user')
.populate({ path: 'parent', select: '',populate: { path: 'user', select: 'name ImageUrl _id' }})
.populate('comments','comment likes user updated_at',null, { sort: { updated_at: -1 },limit:2,populate:{path:'user',select:'name ImageUrl _id'}}
         )
.exec((err,content)=>{
    if(err) return res.send({"error":err});

    var item = content;
    var doc = {
                "content":item.content,
                 "Id":item._id,
                 "PostByUser":{"Id":item.user._id,"image":item.user.ImageUrl,"name":item.user.name},
                 "likesCount":item.likes.length,
                 "sharesCount":item.shares.length,
                 "createdAt":item.created_at,
                 "updateAt":item.updated_at,
                 "isShared":item.isShared,
                 "parentContentId":item.parent,
                  "commentsCount":item.comments.length,
                  "image":item.image,
                  "comments":item.comments.map((item)=>{
                        return {
                              "Id":item._id, "byUser":item.user,"likesCount":item.likes.length,
                               "updatedAt": item.updated_at
                        }
                  })
     

        }
       
res.send({"response":doc});


});


}

function getContentByUserId(req,res) {
    //will be called  when profile is loaded.
   
    res.setHeader('Content-Type', 'application/json');
       var userId = req.params.id;
       var page = req.body.page;
       const pageSize=10;
       var skip = page*pageSize;
Profile.findOne({_id:userId},(err,profile)=>{
         if(err)  res.send(JSON.stringify({"error":err}))
         if(!profile)  res.send(JSON.stringify({"error":"profileNotFound"}))
        var contents = profile.contents;
        if(contents===undefined || contents.length===0){
            return res.send(JSON.stringify({"respone":"nocontents"}))
          }

        Content.find({ "_id": { "$in": contents } })
        .sort('-updated_at')
        .skip(pageSize * page)
        .limit(pageSize)
        .populate({ path: 'user', select: 'name  ImageUrl _id' })
        .populate({ path: 'parent', select: '',populate: { path: 'user', select: 'name ImageUrl _id' }})
        .populate('comments', 'comment likes user updated_at', null, { sort: { updated_at: -1 }, limit: 2, populate: { path: 'user', select: 'name ImageUrl _id' } }
        )
        .exec((err, contents) => {
            if (err) return res.send({ "error": err });


            var contentResponse = contents.map((item) => {
                var doc = {
                    "content": item.content,
                    "Id": item._id,
                    "PostByUser": { "Id": item.user._id, "image": item.user.ImageUrl, "name": item.user.name },
                    "likesCount": item.likes.length,
                    "sharesCount": item.shares.length,
                    "createdAt": item.created_at,
                    "updateAt": item.updated_at,
                    "isShared": item.isShared,
                    "parentContentId": item.parent,
                    "commentsCount": item.comments.length,
                    "comments": item.comments.map((item) => {
                        return {
                            "Id": item._id, "byUser": item.user, "likesCount": item.likes.length,
                            "updatedAt": item.updated_at
                        }
                    })


                }
                return doc;


            });
            res.send({ "response": contentResponse });


        });



        })

        
       


     
}

function getContentByTag(uname) {
  


}




function updateContentById( req, res) {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;
    let data = {"content":req.body.content}
    if(data.content===undefined || data.content===""){
         return res.send(JSON.stringify({"error":"EmptyContentOrInvalidContent"}))
       }
    Content.findByIdAndUpdate(id,data,(err,content)=>{
            if(err)  return res.send(JSON.stringify({"error":err}))
            if(!content)  return res.send(JSON.stringify({"error":"invalidId"}))
            Content.findById(content._id,(err,updatedContent)=>{
                   if(err)  res.send(JSON.stringify({"error":err}))
                   res.send(JSON.stringify({"response":updatedContent}))
             
          });

    });
    /* Content.findById(id,(err,content)=>{
          if(err)  throw err;
       var c = req.body.content;
     if(c){
        content.content=c;
       
         }

      content.save((err,response)=>{
       if(err)   throw err;

          res.send({"response":response});

      });

    }) */
    
    
}


function getLikesOnContent(req,res){
   Content.findById(req.params.contentId).select('_id likes')
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

function getSharesOnContent(req,res){
    Content.findById(req.params.contentId).select('_id shares')
   .populate({path:'shares.sharedBy',select:'name _id'})
   .exec((err,response)=>{
    if(err)  return res.send({"error":err}); 
    var   sharesArr = [];
   sharesArr= response.shares.map((item)=>{
       var doc = { "timeStamp": item._id.getTimestamp(),
                  "user_id":item.sharedBy._id,
                  "name":item.sharedBy.name,
                  //"time":item.time

              };
        return doc;

      });
      res.send({"response":sharesArr});

   });
    
 }

function deleteContentById(id) {



}



function getCommentsByContentId(req,res){
    res.setHeader('Content-Type', 'application/json');
         var page = req.body.page;
         
         const  pageSize=10;
         var  skip = page*pageSize;
         if(page==0) {skip=2;}
   Content.find({_id:req.params.contentId}).select('_id likes')
   .populate('comments','_id comment updated_at',null
   ,{sort: { 'updated_at': -1 },limit:10,skip:skip,populate:{path:'user',select:'name ImageUrl _id'}}
   ,{populate:{path:'user',select:'name ImageUrl _id'}})
   .exec((err,comments)=>{
             if(err)  return res.send({"error":err})

             res.send(  {"status":200,"response":comments});
       

    });

}



function getContentsByType(data,res){
    res.setHeader('Content-Type', 'application/json'); 
           let type = data.type;
           if(type===undefined || type.length===0){
                return res.send(JSON.stringify({"error":"invalidType"}))
              }
              Content.find({"type":type}).sort('-created_at')
              .populate({path:'user',select:'name  ImageUrl _id'})
              .populate({ path: 'parent', select: '',populate: { path: 'user', select: 'name ImageUrl _id' }})
             .populate('comments','comment likes user updated_at',null, { sort: { updated_at: -1 },limit:2,populate:{path:'user',select:'name ImageUrl _id'}}
              )
              .exec((err,contents)=>{
                    if(err) {
                         
                         return res.send(JSON.stringify({"error":err}))
                    }
             
                    
                 var contentResponse = contents.map((item)=>{
                     
                     
                        var doc = {
                                "content":item.content,
                                "title":item.title,
                                 "Id":item._id,
                                 "PostByUser":{"Id":item.user._id,"image":item.user.ImageUrl,"name":item.user.name},
                                 "likesCount":item.likes.length,
                                 "sharesCount":item.shares.length,
                                 "createdAt":item.created_at,
                                 "updateAt":item.updated_at,
                                 "isShared":item.isShared,
                                 "parentContentId":item.parent,
                                  "commentsCount":item.comments.length,
                                  "image":item.image,
                                  "comments":item.comments.map((item)=>{
                                        return {
                                              "Id":item._id, "byUser":item.user,"likesCount":item.likes.length,
                                               "updatedAt": item.updated_at
                                        }
                                  })
                     
          
                        }
                        return doc;
                          
          
                 }); 

                
                 
                 return res.send(JSON.stringify({"response":contentResponse}))
          
              });
          

              }

module.exports = router;
