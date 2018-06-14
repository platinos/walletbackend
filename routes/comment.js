var express = require('express');
var User = require('../data/Contents.js');
var Content = require('../data/Contents.js');
var router = express.Router();



router.post('/addComment/:id',(req,res)=>{

     addCommentToContent(req,res);



});


  function addCommentToContent(req,res){

     

  }







module.exports = router;