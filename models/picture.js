const {Schema, model} = require('mongoose')
const paginate = require("mongoose-paginate-v2");

const schema = new Schema({
    path: {
        type: String,
        required: true
    },
    collectionId: {
        type: String,
        required: true
    }
});

schema.plugin(paginate);

module.exports = model('picture', schema)