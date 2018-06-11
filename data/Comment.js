var mongoose = require('mongoose');
const schema = mongoose.schema;

var comment = new schema({



},


    { timestamps: { createdAt: 'created_at',updatedAt:'updated_at' } }
);