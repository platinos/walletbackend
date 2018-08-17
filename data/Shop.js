const mongoose = require('mongoose');
//var Profile = require('../data/Profile.js');
var Comment = require('../data/Comment.js');
var User = require('../data/User.js');
const Schema = mongoose.Schema;

var ShopSchema = new Schema({
           
            owners:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            Icon:String,
            Name:String,
            Description:String,
            CoverImage:String,
            Category:String,
            Address:String,
            wallets:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]


                           });
                           
                           
var Shop = mongoose.model("Shop",ShopSchema);
    module.exports=Shop;

        