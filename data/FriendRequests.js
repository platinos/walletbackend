const mongoose = require('mongoose');
var schema = mongoose.Schema;
var objectId= schema.Types.ObjectId;
var requestSchema = new schema({
         _id:schema.Types.ObjectId,
         requests:[{fid:objectId,status:{type:String,default:"pending"}}],
         sent:[{fid:objectId,status:{type:String,default:"pending"}}]

});


var FriendRequests = mongoose.model("FriendRequests",requestSchema);
module.exports=FriendRequests;