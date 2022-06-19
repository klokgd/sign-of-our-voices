const {Schema, model} = require('mongoose')
const paginate = require("mongoose-paginate-v2");

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_path: {
        type: String,
        required: false
    },
    pictures: {
        type: Array,
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
})

schema.plugin(paginate);

module.exports = model('collection', schema)