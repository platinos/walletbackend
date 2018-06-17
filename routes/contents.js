var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
const Profile = require('../data/Profile.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    getAllContent(res);             //done
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

function addLike(req,res){
    res.setHeader('Content-Type', 'application/json');
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
  res.setHeader('Content-Type', 'application/json');
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
    res.setHeader('Content-Type', 'application/json');
    var body = req.body.content;
    var id = req.params.id;
       //create content and assign id to content and save 
       var data = {"content":body,"user":id}
  Profile.findById(id,(err,profile)=>{
      if(err)  return res.send({"error":err});
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
 .populate('comments')
 .exec((e,content)=>{

        if(e)  return console.error(e);
     
        res.send({"response":content});

    });
}

function getContentById(id,res) {
    res.setHeader('Content-Type', 'application/json');
    
Content.findById(id).populate('likes.liker').populate('shares.sharedBy')
.populate('user').populate('parent').populate('comments').exec((e,content)=>{

   if(e)  return console.error(e);

   res.send({"response":content});
   


    }) 


}

function getContentByUserId(req,res) {
    //will be called  when profile is loaded.
   
    res.setHeader('Content-Type', 'application/json');
       var userId = req.params.id;
       var page = req.body.page;
       const pageSize=10;
Profile.findById(userId)
.populate({
           //field content =>{all}
          // no of lieks =>{get the sizes of liek array}
         //no of shares  => {get the size of share array}
      //comments => {sorted by updated  date} 
    path:'contents',
    options:{skip:pageSize*page,limit:pageSize,sort:'-createdAt'},
    populate:{path:'comments',sort:'-createdAt',limit:pageSize}

})
.exec((err,contents)=>{
  if(err)  return res.send({"error":err});
  res.send({"response":contents});
 
    });
     
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


function getLikesOnContent(req,res){
   Content.findById(req.params.contentId).select('_id likes')
   .populate({path:'likes.liker',select:'name _id'})
   .exec((err,response)=>{
    if(err)  return res.send({"error":err}); 
    var   likesArr = [];
   likesArr= response.likes.map((item)=>{
       var doc = {
                  "user_id":item.liker._id,
                  "name":item.liker.name,
                  "time":item.time

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
       var doc = {
                  "user_id":item.sharedBy._id,
                  "name":item.sharedBy.name,
                  "time":item.time

              };
        return doc;

      });
      res.send({"response":sharesArr});

   });
    
 }

function deleteContentById(id) {



}

module.exports = router;
