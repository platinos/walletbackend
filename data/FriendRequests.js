const mongoose = require('mongoose');
var schema = mongoose.Schema;
var objectId= schema.Types.ObjectId;
var requestSchema = new schema({
         _id:schema.Types.ObjectId,
         requests:[objectId],
         sent:[objectId]

});


var FriendRequests = mongoose.model("FriendRequests",requestSchema);
module.exports=FriendRequests;