const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contactSchema = new Schema({

    friend:mongoose.Schema.Types.ObjectId,
    date_Added:Date


})

var Contact = mongoose.model("Contact",contactSchema);
module.exports = Contact;