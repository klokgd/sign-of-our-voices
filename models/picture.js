const {Schema, model} = require('mongoose')

const schema = new Schema({
    path: {
        type: String,
        required: true
    },
    collectionId: {
        type: String,
        required: true
    }
})

module.exports = model('v-for-vendetta', schema)