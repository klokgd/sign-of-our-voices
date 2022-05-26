const {Schema, model} = require('mongoose')

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
        required: true
    },
    pictures: {
        type: Array,
        required: false
    }
})

module.exports = model('collection', schema)