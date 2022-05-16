const {Schema, model} = require('mongoose')

const schema = new Schema({
    path: {
        type: String,
        required: true
    },
    collection_name: {
        type: String,
        required: true
    }
})

module.exports = model('v-for-vendetta', schema)