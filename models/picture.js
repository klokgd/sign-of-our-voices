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
    },
    city: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.plugin(paginate);

module.exports = model('picture', schema)