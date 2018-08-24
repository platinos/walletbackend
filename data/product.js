const mongoose = require('mongoose');
var Content = require('../data/Contents.js');
var Wallet = require('../data/wallet.js')
var Shop = require('../data/Shop.js')
const Schema = mongoose.Schema;
delete mongoose.connection.models['Product'];
var ProductSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    Name: String,
    Desc: String,
    image: String,
    Price: Number,
    Quantity: Number,
     
    },
    { timestamps: { createdAt: 'created_at', updatedAt:'updated_at' } });


var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;